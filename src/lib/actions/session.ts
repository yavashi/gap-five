'use server';

import { cookies } from 'next/headers';
import { calculateScores } from '../core/tipi';
import { getSelfLabel } from '../core/gap';
import { SessionData } from '../core/types';
import { createClient } from '../supabase/server';
import { memoryDb } from '../store/memoryStore';

export async function createHostSession(nickname: string, answers: number[]) {
  const trimmedName = nickname.trim();
  if (!trimmedName || trimmedName.length > 30) {
    throw new Error('ニックネームは1〜30文字以内で入力してください。');
  }

  const selfScores = calculateScores(answers);
  const selfLabel = getSelfLabel(selfScores);

  const sessionId = crypto.randomUUID();
  const secretKey = crypto.randomUUID();
  const now = new Date().toISOString();

  const sessionData: SessionData = {
    id: sessionId,
    secret_key: secretKey,
    host_nickname: trimmedName,
    self_scores: selfScores,
    self_label: selfLabel,
    answer_count: 0,
    created_at: now,
  };

  const supabase = await createClient();
  let savedToSupabase = false;

  if (supabase) {
    const { error } = await supabase.from('sessions').insert({
      id: sessionId,
      secret_key: secretKey,
      host_nickname: trimmedName,
      self_scores: selfScores,
      self_label: selfLabel,
      created_at: now,
      updated_at: now,
    });

    if (!error) {
      savedToSupabase = true;
    } else {
      console.warn('Supabaseへの保存に失敗したため、インメモリストアにフォールバックします:', error.message);
    }
  }

  // Supabase未設定または失敗時はインメモリストアに保存
  if (!savedToSupabase) {
    console.warn('Supabase保存スキップ/失敗。原因: supabaseClient=' + !!supabase);
    memoryDb.sessions.set(sessionId, sessionData);
    memoryDb.peerAnswers.set(sessionId, []);
  }

  // ホスト認証用Cookieを設定
  const cookieStore = await cookies();
  cookieStore.set(`gap_host_${sessionId}`, secretKey, {
    path: '/',
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 365, // 1年間有効
    sameSite: 'lax',
  });

  return {
    success: true,
    sessionId,
    secretKey,
    selfLabel,
  };
}

export async function getSession(sessionId: string): Promise<SessionData | null> {
  const supabase = await createClient();

  if (supabase) {
    const { data, error } = await supabase
      .from('sessions')
      .select('id, host_nickname, self_scores, self_label, created_at')
      .eq('id', sessionId)
      .single();

    if (data && !error) {
      return data as SessionData;
    }
  }

  // フォールバック
  const memorySession = memoryDb.sessions.get(sessionId);
  if (memorySession) {
    const { secret_key, ...publicData } = memorySession;
    return publicData as SessionData;
  }

  return null;
}

export async function isHostOfSession(sessionId: string): Promise<boolean> {
  const cookieStore = await cookies();
  const hostCookie = cookieStore.get(`gap_host_${sessionId}`)?.value;
  if (!hostCookie) return false;

  const supabase = await createClient();
  if (supabase) {
    const { data } = await supabase
      .from('sessions')
      .select('secret_key')
      .eq('id', sessionId)
      .single();

    if (data?.secret_key === hostCookie) {
      return true;
    }
  }

  const memorySession = memoryDb.sessions.get(sessionId);
  return memorySession?.secret_key === hostCookie;
}
