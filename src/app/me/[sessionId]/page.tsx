import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSession, isHostOfSession } from '@/lib/actions/session';
import { getPeerAnswers } from '@/lib/actions/peer';
import { ShareButtons } from '@/components/ShareButtons';
import { Sparkles, Users, Lock, Unlock, ArrowRight, ShieldCheck, MessageSquare, Bookmark } from 'lucide-react';
import { headers } from 'next/headers';

interface MePageProps {
  params: Promise<{
    sessionId: string;
  }>;
}

export default async function MePage({ params }: MePageProps) {
  const { sessionId } = await params;
  const session = await getSession(sessionId);

  if (!session) {
    notFound();
  }

  const isHost = await isHostOfSession(sessionId);
  const peerAnswers = await getPeerAnswers(sessionId);
  const answerCount = peerAnswers.length;

  // ホスト名・オリジンの取得
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const proto = headersList.get('x-forwarded-proto') || 'http';
  const baseUrl = `${proto}://${host}`;
  const shareUrl = `${baseUrl}/answer/${sessionId}`;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        {/* ホスト歓迎バナー */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-sm">
              <ShieldCheck className="w-3.5 h-3.5" />
              ホスト管理画面
            </span>
            <span className="text-xs text-blue-100">
              {new Date(session.created_at || Date.now()).toLocaleDateString('ja-JP')}
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black">
              {session.host_nickname} さんの診断ルーム
            </h1>
            <p className="text-blue-100 text-sm mt-1">
              友人に回答を依頼して、自己評価とのギャップを解き明かしましょう！
            </p>
          </div>

          {/* 暫定自認 */}
          <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10 space-y-1">
            <span className="text-xs text-blue-200 font-bold block">あなたの暫定自認ラベル</span>
            <div className="text-xl sm:text-2xl font-black tracking-wide text-yellow-300 flex items-center gap-2">
              <Sparkles className="w-5 h-5 flex-shrink-0" />
              <span>{session.self_label}</span>
            </div>
            <p className="text-xs text-blue-100/80 pt-1">
              ※他者の回答が集まると、隠された「実態の二つ名」がアンロックされます。
            </p>
          </div>
        </div>

        {/* URL保存・迷子防止ヘルプカード */}
        <div className="bg-amber-50/90 rounded-3xl p-5 border border-amber-200/80 text-amber-950 space-y-2.5 shadow-xs">
          <div className="flex items-center gap-2 font-bold text-xs text-amber-900">
            <Bookmark className="w-4 h-4 text-amber-600 flex-shrink-0" />
            <span>【大切なお願い】このページを保存してください</span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            友達にLINEを送っている最中にこの画面を閉じてしまっても困らないよう、
            <strong>ブラウザのお気に入り・ブックマークに登録</strong>するか、
            下のボタンから<strong>自分宛て（Keepメモ等）に管理URLを送信</strong>しておくことをおすすめします。
          </p>
          <div className="pt-1">
            <a
              href={`https://line.me/R/msg/text/?${encodeURIComponent(`【GAP-FIVE】${session.host_nickname}さんの診断管理ルームURL\n（回答状況・確定結果の確認用）：\n${baseUrl}/me/${sessionId}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white font-bold text-xs shadow-xs transition-colors"
            >
              <span>自分のLINE（Keepメモ等）にこのページを保存</span>
            </a>
          </div>
        </div>

        {/* 友人への共有エリア */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>友人に回答を依頼する</span>
            </h2>
            <p className="text-xs text-slate-500">
              以下のリンクをLINEやSNSで友達に送り、あなたの印象を採点してもらいましょう（完全匿名・1分で回答完了）。
            </p>
          </div>

          <ShareButtons shareUrl={shareUrl} hostNickname={session.host_nickname} />
        </div>

        {/* 結果確認ステータスカード */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">現在の回答状況</h2>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-50 text-blue-700">
              現在 {answerCount} 人が回答
            </span>
          </div>

          {answerCount === 0 ? (
            <div className="text-center py-6 px-4 rounded-2xl bg-slate-50 border border-dashed border-slate-200 space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-400">
                <Lock className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-slate-700">まだ回答が集まっていません</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                友人が1人以上回答すると、確定結果とギャップ称号がアンロックされます！
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3">
                <Unlock className="w-6 h-6 text-emerald-600 flex-shrink-0" />
                <div className="text-xs">
                  <p className="font-bold text-sm text-emerald-900">診断結果がアンロックされました！</p>
                  <p className="text-emerald-700">自称と実態のギャップ分析を今すぐ確認できます。</p>
                </div>
              </div>

              <Link
                href={`/result/${sessionId}`}
                className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.01]"
              >
                <span>確定ギャップ診断結果を見る</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          )}
        </div>

        {/* 回答者一覧（コメント含む） */}
        {answerCount > 0 && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3">
            <h3 className="text-sm font-bold text-slate-800">
              回答してくれた友人たち（{answerCount}名）
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {peerAnswers.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="space-y-1">
                    <span className="font-bold text-slate-800">{item.peer_nickname} さん</span>
                    {item.comment && (
                      <div className="flex items-center gap-1.5 text-slate-600 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        <MessageSquare className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                        <span className="italic">「{item.comment}」</span>
                      </div>
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 flex-shrink-0">
                    {new Date(item.created_at).toLocaleDateString('ja-JP')}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-400 text-center pt-1">
              ※忖度を防ぐため、個人の採点スコアは非公開です（平均値として反映されます）。
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
