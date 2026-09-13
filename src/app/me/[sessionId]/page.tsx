import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getSession, isHostOfSession, getPeerSessionMap } from '@/lib/actions/session';
import { getPeerAnswers } from '@/lib/actions/peer';
import { ShareButtons } from '@/components/ShareButtons';
import { MutualDiagnosisCard } from '@/components/MutualDiagnosisCard';
import { SelfVisualWaitingCard } from '@/components/GapVisualCard';
import { PeerRelationNetwork } from '@/components/PeerRelationNetwork';
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

  const peerNicknames = peerAnswers.map((a) => a.peer_nickname);
  const peerSessionMap = await getPeerSessionMap(session.host_nickname, peerNicknames);

  // ホスト名・オリジンの取得
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const proto = headersList.get('x-forwarded-proto') || 'http';
  const baseUrl = `${proto}://${host}`;
  const shareUrl = `${baseUrl}/answer/${sessionId}`;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors"
          >
            GAP-FIVE
          </Link>
          <a
            href={`https://line.me/R/msg/text/?${encodeURIComponent(`【GAP-FIVE】${session.host_nickname}さんの診断管理ルームURL（回答状況・確定結果の確認用）：\n${baseUrl}/me/${sessionId}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold border border-emerald-200 transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>管理URLをLINEに保存</span>
          </a>
        </div>

        {/* 最上部：アンロック通知 または 回答募集特等席 */}
        {answerCount > 0 ? (
          <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-sm">
                <Unlock className="w-4 h-4 text-yellow-300" />
                <span>確定二つ名 アンロック済み</span>
              </span>
              <span className="text-xs font-bold text-emerald-100">
                {answerCount} 名が回答
              </span>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-black">
                🎉 診断結果が届いています！
              </h1>
              <p className="text-emerald-100 text-sm">
                あなたの自認「{session.self_label}」と周囲の目のギャップ分析が完了しました。
              </p>
            </div>

            <div className="pt-2">
              <Link
                href={`/result/${sessionId}`}
                className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl bg-white text-emerald-900 hover:bg-yellow-300 font-black text-base sm:text-lg shadow-lg transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>確定二つ名 ＆ ギャップ分析を見る</span>
                <ArrowRight className="w-5 h-5 text-emerald-800" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl p-6 sm:p-7 text-white shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-sm">
                <Lock className="w-3.5 h-3.5 text-yellow-300" />
                <span>あと1名の回答でアンロック</span>
              </span>
              <span className="text-xs text-blue-100">0 / 1 名完了</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-black">
                友達にあなたの性格を採点してもらおう！
              </h1>
              <p className="text-blue-100 text-xs sm:text-sm mt-1 leading-relaxed">
                1人以上が回答すると、隠された「実態の確定二つ名」とレーダーチャートがアンロックされます（完全匿名・1分）。
              </p>
            </div>

            <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-300 rounded-full w-1/12 animate-pulse" />
            </div>
          </div>
        )}

        {/* 友人への共有エリア（LINEメッセージ例文 & ボタン） */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              <span>{answerCount > 0 ? 'さらに回答を集める（LINE共有）' : 'LINEで友達に回答を依頼する'}</span>
            </h2>
            <p className="text-xs text-slate-500">
              メッセージ例文をコピーしてLINEに送るだけで、友達が1分で匿名回答できます。
            </p>
          </div>

          <ShareButtons
            shareUrl={shareUrl}
            hostNickname={session.host_nickname}
            sessionId={sessionId}
            selfLabel={session.self_label}
          />
        </div>

        {/* あなたの自認イラストカード */}
        <SelfVisualWaitingCard
          hostNickname={session.host_nickname}
          selfLabel={session.self_label}
        />

        {/* 評価・相互診断の関係マップ（相関図） */}
        {answerCount > 0 && (
          <PeerRelationNetwork
            sessionId={sessionId}
            hostNickname={session.host_nickname}
            peerAnswers={peerAnswers}
            peerSessionMap={peerSessionMap}
            baseUrl={baseUrl}
            isHostView={true}
          />
        )}

        {/* 回答者一覧 ＆ お返し相互診断カード */}
        <MutualDiagnosisCard
          sessionId={sessionId}
          hostNickname={session.host_nickname}
          peerAnswers={peerAnswers}
          baseUrl={baseUrl}
          peerSessionMap={peerSessionMap}
        />
      </div>
    </div>
  );
}