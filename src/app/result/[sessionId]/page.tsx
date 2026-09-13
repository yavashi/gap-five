import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import { getSession, isHostOfSession, getPeerSessionMap } from '@/lib/actions/session';
import { getPeerAnswers } from '@/lib/actions/peer';
import { calculateAveragePeerScores } from '@/lib/core/tipi';
import { generateFinalResult } from '@/lib/core/gap';
import { generatePremiumReport } from '@/lib/core/premium';
import { calculatePairCompatibility } from '@/lib/core/compatibility';
import { RadarChart } from '@/components/RadarChart';
import { TraitBarList } from '@/components/TraitBarList';
import { ShareButtons } from '@/components/ShareButtons';
import { ResultRevealModal } from '@/components/ResultRevealModal';
import { PremiumTeaserCard } from '@/components/PremiumTeaserCard';
import { PairCompatibilityCard } from '@/components/PairCompatibilityCard';
import { RecommendationCard } from '@/components/RecommendationCard';
import { GapVisualCard, SelfVisualWaitingCard } from '@/components/GapVisualCard';
import { ResultTabContainer } from '@/components/ResultTabContainer';
import { PeerRelationNetwork } from '@/components/PeerRelationNetwork';
import { 
  Sparkles, 
  MessageSquare, 
  Award, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  Bookmark, 
  Lock, 
  Unlock, 
  Send, 
  Users, 
  HeartHandshake 
} from 'lucide-react';
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

  // ホスト本人かどうかをCookie認証で判定
  const isHost = await isHostOfSession(sessionId);

  const peerAnswers = await getPeerAnswers(sessionId);
  const answerCount = peerAnswers.length;

  const headersList = await headers();
  const host = headersList.get('host') || 'localhost:3000';
  const proto = headersList.get('x-forwarded-proto') || 'http';
  const baseUrl = `${proto}://${host}`;
  const currentUrl = `${baseUrl}/result/${sessionId}`;
  const shareUrl = `${baseUrl}/answer/${sessionId}`;

  // ==========================================================
  // 【ケース1】回答がまだ0人の場合（アンロック待機・回答募集中）
  // ==========================================================
  if (answerCount === 0) {
    if (isHost) {
      // ホスト本人が見ている場合：リッチな回答募集＆自認カード
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
                href={`https://line.me/R/msg/text/?${encodeURIComponent(
                  `【GAP-FIVE】${session.host_nickname}さんの性格診断ルームURL（回答が集まり次第、このURLで結果が自動発表されます）：\n${currentUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 hover:bg-emerald-100 text-xs font-bold border border-emerald-200 transition-colors"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>この結果URLをLINEに保存</span>
              </a>
            </div>

            {/* アンロック待ちプログレスバナー */}
            <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl p-6 sm:p-7 text-white shadow-lg space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-sm">
                  <Lock className="w-3.5 h-3.5 text-yellow-300" />
                  <span>あと1名の回答でアンロック</span>
                </span>
                <span className="text-xs text-blue-100 font-bold">0 / 1 名完了</span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-black">
                  友達にあなたの性格を採点してもらおう！
                </h1>
                <p className="text-blue-100 text-xs sm:text-sm mt-1 leading-relaxed">
                  友達が1人以上回答すると、この画面のまま隠された「実態の確定二つ名」とグラフがアンロックされます（完全匿名・1分）。
                </p>
              </div>

              <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-300 rounded-full w-1/12 animate-pulse" />
              </div>
            </div>

            {/* 友人への共有エリア（LINEメッセージ例文 & ボタン） */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
              <div className="space-y-1">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-600" />
                  <span>LINEで友達に回答を依頼する</span>
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

            {/* ガイダンス */}
            <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/70 text-center space-y-1 text-xs text-amber-900">
              <span className="font-bold block">💡 画面を開いたままお待ちいただくか、LINEにURLを保存してください</span>
              <p className="text-amber-700 text-[11px]">
                友達が回答を送信すると、このページを再読み込みした際に自動で確定二つ名と分析結果が表示されます。
              </p>
            </div>
          </div>
        </div>
      );
    } else {
      // 友人・第三者が未アンロックのURLを踏んだ場合：回答を促すバイラル画面
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-slate-100 space-y-5">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 mx-auto">
              <Lock className="w-8 h-8 text-indigo-500" />
            </div>
            <div className="space-y-2">
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
                <span>🔒 結果ロック中</span>
              </span>
              <h1 className="text-2xl font-black text-slate-900">
                {session.host_nickname} さんの性格診断
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {session.host_nickname} さんの診断結果は、まだ誰も回答していないためロックされています。あなたが最初の回答者になってアンロックしてあげませんか？
              </p>
            </div>
            <div className="pt-2 space-y-2.5">
              <Link
                href={`/answer/${sessionId}`}
                className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm sm:text-base shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.01]"
              >
                <span>{session.host_nickname} さんを評価する（約1分・匿名）</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/diagnose"
                className="inline-flex items-center justify-center gap-2 w-full py-3 px-6 rounded-2xl bg-slate-100 text-slate-700 font-bold text-xs hover:bg-slate-200 transition-all"
              >
                <span>あなたも自分のギャップ診断を作ってみる（無料）</span>
              </Link>
            </div>
          </div>
        </div>
      );
    }
  }

  // ==========================================================
  // 【ケース2】回答が1人以上集まっている場合（確定結果発表画面）
  // ==========================================================

  // 他者平均スコアの算出
  const peerScoresArray = peerAnswers.map((a) => a.peer_scores);
  const averagePeerScores = calculateAveragePeerScores(peerScoresArray)!;

  // 確定二つ名と心理解説の生成
  const finalResult = generateFinalResult(session.self_scores, averagePeerScores);

  // 深層心理トリセツ（完全版プレミアムデータ）の生成
  const premiumReport = generatePremiumReport(session.self_scores, averagePeerScores);

  // 各回答者との個別相性カルテ（1対1ケミストリー）の生成
  const pairCompatibilities = peerAnswers.map((a) =>
    calculatePairCompatibility(
      session.self_scores,
      a.peer_scores,
      session.host_nickname,
      a.peer_nickname
    )
  );

  // 回答者たちの診断セッション情報を取得（相互診断リンク用）
  const peerNicknames = peerAnswers.map((a) => a.peer_nickname);
  const peerSessionMap = await getPeerSessionMap(session.host_nickname, peerNicknames);

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

        {/* 👑 ホスト閲覧時のスマート・コントロールバー（上部特等席） */}
        {isHost ? (
          <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-2xl p-4 text-white shadow-lg border border-indigo-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              <div>
                <div className="text-xs font-black text-indigo-300 flex items-center gap-1.5">
                  <span>👑 あなたの診断ページ</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 font-bold">
                    {answerCount} 名回答済
                  </span>
                </div>
                <div className="text-[11px] text-slate-300">
                  回答が集まるほど診断精度が上がり、新しい二つ名や相性カルテが解放されます
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a
                href={`https://line.me/R/msg/text/?${encodeURIComponent(
                  `【GAP-FIVE】${session.host_nickname}さんの性格ギャップ診断！\n私の性格を1分で匿名採点してみてね！\n${baseUrl}/answer/${sessionId}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>友達を追加招待</span>
              </a>
              <a
                href={`https://line.me/R/msg/text/?${encodeURIComponent(
                  `【GAP-FIVE】${session.host_nickname}さんの診断結果ページ（回答が増えるたびに自動更新）：\n${currentUrl}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/20 transition-colors flex items-center gap-1.5"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>URL保存</span>
              </a>
            </div>
          </div>
        ) : (
          /* 第三者閲覧時の結果URL保存バー */
          <div className="bg-amber-50/90 rounded-2xl p-3.5 border border-amber-200/80 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs shadow-2xs">
            <div className="flex items-center gap-2 font-medium">
              <Bookmark className="w-4 h-4 text-amber-600 shrink-0" />
              <span>ブラウザを閉じても見返せるよう、結果URLを保存しておきましょう</span>
            </div>
            <a
              href={`https://line.me/R/msg/text/?${encodeURIComponent(
                `【GAP-FIVE】${session.host_nickname}さんの性格診断結果ページ：\n${currentUrl}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="self-end sm:self-auto shrink-0 px-3.5 py-1.5 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white font-bold text-xs shadow-2xs transition-colors flex items-center gap-1.5"
            >
              <span>LINEに保存</span>
            </a>
          </div>
        )}

        {/* 3大スマートタブコンテナ */}
        <ResultTabContainer
          commentsCount={comments.length}
          pairCount={pairCompatibilities.length}
          gapContent={
            <>
              {/* 結果発表ドラマチック演出モーダル & 再生ボタン */}
              <ResultRevealModal
                sessionId={sessionId}
                hostNickname={session.host_nickname}
                finalTitle={finalResult.title}
                selfLabel={finalResult.selfLabel}
                peerRealityLabel={finalResult.primaryGap ? finalResult.primaryGap.name : 'そのまま（等身大）'}
                peerRealityTitle={finalResult.peerRealityTitle}
                isRare={finalResult.isRare}
                rarityBadge={finalResult.rarityBadge}
                answerCount={answerCount}
              />

              {/* 確定称号メインカード（自称と実態の2段構成） */}
              <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-300 tracking-wider uppercase">
                      {session.host_nickname} さんの確定診断
                    </span>
                    {finalResult.isRare && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-black bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400 text-slate-900 shadow-sm animate-pulse">
                        ✨ {finalResult.rarityBadge}
                      </span>
                    )}
                  </div>

                  {/* 自称と実態の2段構成 */}
                  <div className="space-y-3">
                    {/* 1段目: 本人の自称 */}
                    <div className="flex items-center gap-2.5 text-xs sm:text-sm">
                      <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 font-bold border border-blue-400/30 whitespace-nowrap">
                        自称
                      </span>
                      <span className="font-extrabold text-slate-200 truncate">
                        {finalResult.selfLabel}
                      </span>
                    </div>

                    {/* 2段目: 周囲が暴いた実態（確定二つ名） */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-gradient-to-r from-pink-500 to-rose-500 text-white font-bold text-xs whitespace-nowrap shadow-xs">
                          実態
                        </span>
                        <span className="text-xs text-slate-400 font-medium">周囲から見た確定二つ名</span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-pink-300 to-indigo-200 leading-tight">
                        {finalResult.peerRealityTitle}
                      </h1>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-800">
                    {finalResult.description}
                  </p>
                </div>
              </div>

              {/* イラスト対比カード（自認 vs 周囲の目） */}
              <GapVisualCard
                hostNickname={session.host_nickname}
                selfLabel={finalResult.selfLabel}
                gapName={finalResult.primaryGap?.name}
                gapTrait={finalResult.primaryGap?.trait}
                gapType={finalResult.primaryGap?.type}
                isConcordant={finalResult.isConcordant}
              />

              {/* SNSシェアエリア */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-indigo-600" />
                    <span>このギャップ結果を友達にシェアする</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    確定した二つ名やイラスト対比をLINEやSNSで友達に見せて盛り上がろう！
                  </p>
                </div>

                <ShareButtons
                  shareUrl={currentUrl}
                  hostNickname={session.host_nickname}
                  isResult={true}
                  resultTitle={finalResult.title}
                  sessionId={sessionId}
                  selfLabel={finalResult.selfLabel}
                />
              </div>
            </>
          }
          scienceContent={
            <>
              {/* レーダーチャート */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-4">
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <Award className="w-5 h-5 text-indigo-600" />
                    <span>科学的ビッグファイブ特性マップ</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    青線（自己評価）と赤線（周囲の評価）の乖離が大きいほど、隠れたギャップが存在します。
                  </p>
                </div>

                <div className="py-2">
                  <RadarChart
                    selfScores={session.self_scores}
                    peerScores={averagePeerScores}
                  />
                </div>
              </div>

              {/* 5因子バー比較リスト */}
              <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-4">
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-slate-900">
                    5大性格因子の詳細スコア
                  </h2>
                  <p className="text-xs text-slate-500">
                    各特性における自己認識と客観的評価の数値差（デルタ）です。
                  </p>
                </div>

                <TraitBarList
                  selfScores={session.self_scores}
                  peerScores={averagePeerScores}
                />
              </div>

              {/* プレミアム深層心理トリセツ */}
              <PremiumTeaserCard
                sessionId={sessionId}
                hostNickname={session.host_nickname}
                report={premiumReport}
              />

              {/* おすすめ書籍・サービス */}
              <RecommendationCard
                selfScores={session.self_scores}
                peerScores={averagePeerScores}
              />
            </>
          }
          friendsContent={
            <>
              {/* 評価・相互診断の関係相関マップ */}
              {answerCount > 0 && (
                <PeerRelationNetwork
                  sessionId={sessionId}
                  hostNickname={session.host_nickname}
                  peerAnswers={peerAnswers}
                  peerSessionMap={peerSessionMap}
                  baseUrl={baseUrl}
                  isHostView={isHost}
                />
              )}

              {/* 友人たちからの一言コメントカード群 */}
              {comments.length > 0 ? (
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                      <MessageSquare className="w-5 h-5 text-indigo-600" />
                      <span>友人たちからの生の声</span>
                    </h2>
                    <span className="text-xs text-slate-400">{comments.length}件のメッセージ</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {comments.map((item) => {
                      const peerSession = peerSessionMap[item.peer_nickname];
                      return (
                        <div
                          key={item.id}
                          className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 shadow-xs space-y-2 flex flex-col justify-between"
                        >
                          <p className="text-xs font-medium text-slate-800 leading-relaxed italic">
                            「{item.comment}」
                          </p>
                          <div className="flex items-center justify-between pt-1 border-t border-amber-200/40">
                            <div className="text-[11px] font-bold text-amber-900">
                              — {item.peer_nickname} さん
                            </div>
                            {peerSession?.sessionId && (
                              <Link
                                href={peerSession.hasAnswered ? `/result/${peerSession.sessionId}` : `/answer/${peerSession.sessionId}`}
                                className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 hover:text-indigo-900 bg-white/80 hover:bg-white px-2 py-0.5 rounded-md border border-indigo-200/60 shadow-2xs transition-colors"
                              >
                                <span>{peerSession.hasAnswered ? '診断結果を見る' : '逆評価する'}</span>
                                <ArrowRight className="w-2.5 h-2.5" />
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-8 text-center space-y-2 border border-slate-200/80">
                  <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-sm font-bold text-slate-700">まだメッセージはありません</p>
                  <p className="text-xs text-slate-400">友人が回答時にコメントを入力するとここに表示されます。</p>
                </div>
              )}

              {/* 回答者との個別相性カルテ（1対1ケミストリー & 相互診断リンク） */}
              {pairCompatibilities.length > 0 && (
                <PairCompatibilityCard
                  sessionId={sessionId}
                  hostNickname={session.host_nickname}
                  compatibilities={pairCompatibilities}
                  peerSessionMap={peerSessionMap}
                />
              )}
            </>
          }
        />

        {/* 最下部アクション（ホスト本人か第三者かでスマートに出し分け） */}
        {isHost ? (
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white text-center space-y-4 shadow-xl border border-indigo-500/30 animate-fadeIn">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold border border-indigo-400/30">
              <span>👑</span>
              <span>ホストメニュー</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">
                もっと回答を集めて診断精度を高めますか？
              </h3>
              <p className="text-xs text-indigo-200">
                LINEで友達に回答を依頼すると、新しい二つ名や相性カルテがさらに解放されます。
              </p>
            </div>
            <a
              href={`https://line.me/R/msg/text/?${encodeURIComponent(
                `【GAP-FIVE】${session.host_nickname}さんの性格ギャップ診断！\n私の性格を1分で匿名採点してみてね！\n${baseUrl}/answer/${sessionId}`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-600 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white font-black text-base shadow-lg shadow-indigo-500/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <Send className="w-5 h-5" />
              <span>LINEで友達に回答を依頼する</span>
            </a>
            <div className="pt-1">
              <Link
                href="/diagnose"
                className="text-xs text-slate-400 hover:text-slate-200 underline underline-offset-4 transition-colors"
              >
                ※新しく別のデータで診断を作り直したい場合はこちら（無料）
              </Link>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-indigo-950 text-white text-center space-y-4 shadow-xl border border-slate-700 animate-fadeIn">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/20 text-yellow-300 text-xs font-bold border border-yellow-400/30">
              <span>✨</span>
              <span>この結果を見たあなたへ</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">
                {session.host_nickname} さんの診断はいかがでしたか？
              </h3>
              <p className="text-xs text-slate-300">
                あなたの「自称」と「友達から見えた実態」のギャップも暴いてみませんか？
              </p>
            </div>
            <div className="pt-1 space-y-2">
              <Link
                href="/diagnose"
                className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-600 to-indigo-600 hover:from-pink-600 hover:to-indigo-700 text-white font-black text-base shadow-lg shadow-pink-500/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <span>あなたもギャップ診断をつくってみる（無料・1分）</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href={`/answer/${sessionId}`}
                className="inline-flex items-center justify-center gap-1 text-xs text-indigo-300 hover:text-white underline underline-offset-4 transition-colors py-1"
              >
                <span>※まだ {session.host_nickname} さんを評価していない方はこちら</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
