import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getSession } from '@/lib/actions/session';
import { getPeerAnswers } from '@/lib/actions/peer';
import { calculateAveragePeerScores } from '@/lib/core/tipi';
import { generateFinalResult } from '@/lib/core/gap';
import { RadarChart } from '@/components/RadarChart';
import { TraitBarList } from '@/components/TraitBarList';
import { ShareButtons } from '@/components/ShareButtons';
import { Sparkles, MessageSquare, Award, ArrowRight, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { headers } from 'next/headers';

interface ResultPageProps {
  params: Promise<{
    sessionId: string;
  }>;
}

export async function generateMetadata({ params }: ResultPageProps): Promise<Metadata> {
  const { sessionId } = await params;
  const session = await getSession(sessionId);

  if (!session) {
    return {
      title: '診断結果が見つかりません | GAP-FIVE',
    };
  }

  const peerAnswers = await getPeerAnswers(sessionId);
  const answerCount = peerAnswers.length;

  let title = `${session.host_nickname} さんの性格ギャップ診断結果 | GAP-FIVE`;
  let description = `${session.host_nickname} さんの自称と周囲の目のギャップを分析しました。`;

  if (answerCount > 0) {
    const peerScoresArray = peerAnswers.map((a) => a.peer_scores);
    const avg = calculateAveragePeerScores(peerScoresArray)!;
    const result = generateFinalResult(session.self_scores, avg);
    title = `【${result.title}】${session.host_nickname}さんのギャップ診断結果`;
    description = result.description;
  }

  const ogImageUrl = `/api/og/${sessionId}?v=${answerCount}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { sessionId } = await params;
  const session = await getSession(sessionId);

  if (!session) {
    notFound();
  }

  const peerAnswers = await getPeerAnswers(sessionId);
  const answerCount = peerAnswers.length;

  // ホストURLの取得
  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const proto = headersList.get('x-forwarded-proto') || 'http';
  const baseUrl = `${proto}://${host}`;
  const currentUrl = `${baseUrl}/result/${sessionId}`;

  // 他者回答が0件の場合はまだ結果が出せない
  if (answerCount === 0) {
    return (
      <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
        <div className="max-w-xl mx-auto space-y-6 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 mb-2">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-black text-slate-900">
            まだ診断結果が集計されていません
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            {session.host_nickname} さんの性格診断は、友人や知人からの他者評価が1件以上集まるとアンロックされます。
          </p>

          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/answer/${sessionId}`}
              className="inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-all"
            >
              <span>{session.host_nickname} さんを評価する</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center py-3.5 px-6 rounded-2xl bg-white border border-slate-200 text-slate-700 font-bold text-sm hover:bg-slate-50 transition-colors"
            >
              <span>トップへ戻る</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 他者平均スコアの計算
  const peerScoresArray = peerAnswers.map((a) => a.peer_scores);
  const avgPeerScores = calculateAveragePeerScores(peerScoresArray)!;

  // 確定二つ名・ギャップの計算
  const finalResult = generateFinalResult(session.self_scores, avgPeerScores);

  const isConfirmed = answerCount >= 3;

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        {/* ナビゲーション */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors"
          >
            GAP-FIVE
          </Link>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
              isConfirmed
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-amber-50 text-amber-700 border-amber-200'
            }`}
          >
            {isConfirmed ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>確定診断（高精度）</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>暫定速報（{answerCount}名の回答に基づく分析）</span>
              </>
            )}
          </span>
        </div>

        {/* 確定二つ名ヒーローカード */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6 relative overflow-hidden border border-slate-800">
          <div className="space-y-2">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block">
              {session.host_nickname} さんの確定二つ名
            </span>
            <h1 className="text-2xl sm:text-3xl font-black leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-yellow-300 to-amber-400">
              {finalResult.title}
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10 backdrop-blur-xs">
              <span className="text-[11px] text-slate-400 font-bold block mb-1">
                本人の自認
              </span>
              <span className="text-sm sm:text-base font-bold text-slate-200">
                {finalResult.self_label}
              </span>
            </div>
            <div className="bg-white/5 rounded-2xl p-3.5 border border-white/10 backdrop-blur-xs">
              <span className="text-[11px] text-amber-300 font-bold block mb-1">
                周囲から見た実態
              </span>
              <span className="text-sm sm:text-base font-bold text-amber-300">
                {finalResult.peer_label}
              </span>
            </div>
          </div>
        </div>

        {/* レーダーチャート */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-lg font-black text-slate-900">
              自己 vs 周囲 ギャップチャート
            </h2>
            <p className="text-xs text-slate-500">
              青（自己評価）と赤（周囲の平均評価）のズレがあなたの隠れた二面性です。
            </p>
          </div>

          <div className="py-2">
            <RadarChart
              selfScores={session.self_scores}
              peerScores={avgPeerScores}
              size={360}
            />
          </div>
        </div>

        {/* 自称と実態の心理解説文 */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-bold text-slate-900">
              自称と実態の心理解説
            </h2>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed font-medium">
            {finalResult.description}
          </p>
        </div>

        {/* 5因子ごとの詳細ギャップ比較バー */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-slate-900">
              5因子のスコア詳細比較
            </h2>
            <p className="text-xs text-slate-500">
              各因子の自己評価・他者平均・ギャップ差分値です。
            </p>
          </div>

          <TraitBarList
            selfScores={session.self_scores}
            peerScores={avgPeerScores}
          />
        </div>

        {/* 友人たちからの生の声カード */}
        {peerAnswers.some((a) => a.comment) && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-500" />
              <h2 className="text-base font-bold text-slate-900">
                友人たちからの生の声
              </h2>
              <span className="text-xs font-bold text-slate-400">
                {peerAnswers.filter((a) => a.comment).length}件のメッセージ
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {peerAnswers.filter((a) => a.comment).map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 shadow-xs space-y-1.5"
                >
                  <p className="text-xs font-medium text-slate-800 leading-relaxed italic">
                    「{item.comment}」
                  </p>
                  <div className="text-[11px] font-bold text-amber-800 text-right">
                    — {item.peer_nickname} さん
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SNSシェアエリア */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3">
          <h2 className="text-base font-bold text-slate-900 text-center">
            診断結果をシェアする
          </h2>
          <ShareButtons
            shareUrl={currentUrl}
            hostNickname={session.host_nickname}
            isResult={true}
            resultTitle={finalResult.title}
          />
        </div>

        {/* ホスト管理画面への復帰リンク */}
        <div className="text-center pt-1 pb-2">
          <Link
            href={`/me/${sessionId}`}
            className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-bold hover:underline underline-offset-4"
          >
            <span>← あなたの診断ルーム（回答の追加募集・管理画面）に戻る</span>
          </Link>
        </div>

        {/* 自分も診断してみる（相互送客バイラル導線） */}
        <div className="text-center pt-2 pb-6">
          <Link
            href="/diagnose"
            className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-base shadow-lg transition-all hover:scale-[1.01]"
          >
            <span>あなたもギャップ診断を作ってみる（無料）</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
