'use server';

import { calculateScores } from '../core/tipi';
import { PeerAnswerData } from '../core/types';
import { createClient } from '../supabase/server';
import { memoryDb } from '../store/memoryStore';
import { isHostOfSession } from './session';

export async function submitPeerAnswer(
  sessionId: string,
  nickname: string,
  answers: number[],
  comment?: string
) {
  const trimmedName = nickname.trim();
  if (!trimmedName || trimmedName.length > 30) {
    throw new Error('ニックネームは1〜30文字以内で入力してください。');
  }

  const trimmedComment = comment?.trim() ? comment.trim().slice(0, 100) : undefined;
  const peerScores = calculateScores(answers);
  const answerId = crypto.randomUUID();
  const now = new Date().toISOString();

  const answerData: PeerAnswerData = {
    id: answerId,
    session_id: sessionId,
    peer_nickname: trimmedName,
    peer_scores: peerScores,
    comment: trimmedComment,
    is_excluded: false,
    created_at: now,
  };

  const supabase = await createClient();
  let savedToSupabase = false;

  if (supabase) {
    const { error } = await supabase.from('peer_answers').insert({
      id: answerId,
      session_id: sessionId,
      peer_nickname: trimmedName,
      peer_scores: peerScores,
      comment: trimmedComment,
      is_excluded: false,
      created_at: now,
    });

    if (!error) {
      savedToSupabase = true;
    } else {
      console.warn('Supabaseへの他者回答保存に失敗したため、インメモリにフォールバックします:', error.message);
    }
  }

  if (!savedToSupabase) {
    const existing = memoryDb.peerAnswers.get(sessionId) || [];
    existing.push(answerData);
    memoryDb.peerAnswers.set(sessionId, existing);
  }

  return { success: true, answerId };
}

export async function getPeerAnswers(sessionId: string) {
  const supabase = await createClient();

  if (supabase) {
    const { data, error } = await supabase
      .from('peer_answers')
      .select('id, session_id, peer_nickname, peer_scores, comment, is_excluded, created_at')
      .eq('session_id', sessionId)
      .eq('is_excluded', false)
      .order('created_at', { ascending: true });

    if (data && !error) {
      return data as PeerAnswerData[];
    }
  }

  const list = memoryDb.peerAnswers.get(sessionId) || [];
  return list.filter((a) => !a.is_excluded);
}

export async function toggleExcludeAnswer(sessionId: string, answerId: string, exclude: boolean) {
  const isHost = await isHostOfSession(sessionId);
  if (!isHost) {
    throw new Error('除外操作を行う権限がありません。');
  }

  const supabase = await createClient();
  if (supabase) {
    await supabase
      .from('peer_answers')
      .update({ is_excluded: exclude })
      .eq('id', answerId)
      .eq('session_id', sessionId);
  }

  const list = memoryDb.peerAnswers.get(sessionId);
  if (list) {
    const target = list.find((a) => a.id === answerId);
    if (target) {
      target.is_excluded = exclude;
    }
  }

  return { success: true };
}