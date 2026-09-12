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

  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const proto = headersList.get('x-forwarded-proto') || 'http';
  const baseUrl = `${proto}://${host}`;
  const currentUrl = `${baseUrl}/result/${sessionId}`;

  // 回答がまだ0人の場合
  if (answerCount === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-5">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-600">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-800">
              まだ他者回答が集まっていません
            </h1>
            <p className="text-sm text-slate-500">
              {session.host_nickname} さんの診断結果は、友人が1人以上回答するとアンロックされます。
            </p>
          </div>
          <div className="pt-2 space-y-2">
            <Link
              href={`/me/${sessionId}`}
              className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-2xl bg-blue-600 text-white font-bold text-sm shadow-md transition-all hover:bg-blue-700"
            >
              <span>ホスト管理画面で回答を集める</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={`/answer/${sessionId}`}
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 rounded-2xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-all"
            >
              <span>あなたが代わりに回答する</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 他者平均スコアの算出
  const peerScoresArray = peerAnswers.map((a) => a.peer_scores);
  const averagePeerScores = calculateAveragePeerScores(peerScoresArray)!;

  // 確定二つ名と心理解説の生成
  const finalResult = generateFinalResult(session.self_scores, averagePeerScores);

  // コメントがある回答のみ抽出
  const comments = peerAnswers.filter((a) => a.comment && a.comment.trim().length > 0);

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4 sm:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        {/* 信頼度バッジ & ヘッダー */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors"
          >
            GAP-FIVE
          </Link>
          {answerCount >= 3 ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              確定診断（{answerCount}名の統計で高精度）
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-200">
              暫定速報（{answerCount}名の回答に基づく分析）
            </span>
          )}
        </div>

        {/* 確定称号メインカード */}
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-indigo-300 tracking-wider uppercase">
                {session.host_nickname} さんの確定二つ名
              </span>
              {finalResult.isRare && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400 text-slate-900 shadow-sm animate-pulse">
                  ✨ {finalResult.rarityBadge}
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 leading-tight">
              {finalResult.title}
            </h1>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-slate-400 block font-bold">本人の自認</span>
              <span className="font-extrabold text-blue-300">{finalResult.selfLabel}</span>
            </div>
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1">
              <span className="text-slate-400 block font-bold">周囲から見た実態</span>
              <span className="font-extrabold text-rose-300">
                {finalResult.primaryGap ? finalResult.primaryGap.name : 'そのまま（等身大）'}
              </span>
            </div>
          </div>
        </div>

        {/* 重ね合わせレーダーチャート */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-base font-bold text-slate-900 flex items-center justify-center gap-2">
              <Award className="w-5 h-5 text-blue-600" />
              <span>自己 vs 周囲 ギャップチャート</span>
            </h2>
            <p className="text-xs text-slate-500">
              青（自己評価）と赤（周囲の平均評価）のズレがあなたの隠れた二面性です。
            </p>
          </div>

          <RadarChart
            selfScores={session.self_scores}
            peerScores={averagePeerScores}
            selfLabel={finalResult.selfLabel}
          />
        </div>

        {/* 心理学的解説 */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span>自称と実態の心理解説</span>
          </h2>
          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
            {finalResult.description}
          </p>
        </div>

        {/* 5因子ごとの詳細ギャップリスト */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3">
          <h2 className="text-base font-bold text-slate-900">
            5因子のスコア詳細比較
          </h2>
          <TraitBarList
            selfScores={session.self_scores}
            peerScores={averagePeerScores}
          />
        </div>

        {/* 友人たちからの一言コメントカード群 */}
        {comments.length > 0 && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                <span>友人たちからの生の声</span>
              </h2>
              <span className="text-xs text-slate-400">{comments.length}件のメッセージ</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {comments.map((item) => (
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
            sessionId={sessionId}
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
