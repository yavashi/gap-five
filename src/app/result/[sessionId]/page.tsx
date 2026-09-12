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
import { GapVisualCard } from '@/components/GapVisualCard';
import { ResultTabContainer } from '@/components/ResultTabContainer';
import { Sparkles, MessageSquare, Award, ArrowRight, ShieldAlert, CheckCircle2, Bookmark } from 'lucide-react';
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

  // ホスト本人かどうかをCookie認証で判定
  const isHost = await isHostOfSession(sessionId);

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

        {/* 結果URL保存バー（紛失・見失い防止） */}
        <div className="bg-amber-50/90 rounded-2xl p-3.5 border border-amber-200/80 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs shadow-2xs">
          <div className="flex items-center gap-2 font-medium">
            <Bookmark className="w-4 h-4 text-amber-600 shrink-0" />
            <span>ブラウザを閉じても見返せるよう、結果URLを保存しておきましょう</span>
          </div>
          <a
            href={`https://line.me/R/msg/text/?${encodeURIComponent(`【GAP-FIVE】${session.host_nickname}さんの性格診断結果ページ：\n${currentUrl}`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="self-end sm:self-auto shrink-0 px-3.5 py-1.5 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white font-bold text-xs shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <span>LINEに保存</span>
          </a>
        </div>

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
                        <span className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 font-bold border border-rose-400/30 text-xs sm:text-sm whitespace-nowrap">
                          実態（確定二つ名）
                        </span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 leading-tight pt-1 drop-shadow-sm">
                        {finalResult.peerRealityTitle || finalResult.title}
                      </h1>
                    </div>
                  </div>
                </div>
              </div>

              {/* 暴かれたズレの対比ビジュアルカード（自認 vs 実態） */}
              <GapVisualCard
                hostNickname={session.host_nickname}
                selfLabel={finalResult.selfLabel}
                gapName={finalResult.primaryGap ? finalResult.primaryGap.name : '等身大パーソン'}
                gapTrait={finalResult.primaryGap?.trait}
                gapType={finalResult.primaryGap?.type}
              />

              {/* SNSシェアエリア（即座にシェア可能） */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-3">
                <h2 className="text-base font-bold text-slate-900 text-center">
                  この二つ名・結果画像をシェアする
                </h2>
                <ShareButtons
                  shareUrl={currentUrl}
                  hostNickname={session.host_nickname}
                  isResult={true}
                  resultTitle={finalResult.title}
                  sessionId={sessionId}
                />
              </div>
            </>
          }
          scienceContent={
            <>
              {/* 重ね合わせレーダーチャート */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4">
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
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-3">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  <span>自称と実態の心理解説</span>
                </h2>
                <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {finalResult.description}
                </p>
              </div>

              {/* 5因子ごとの詳細ギャップリスト */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-3">
                <h2 className="text-base font-bold text-slate-900">
                  5因子のスコア詳細比較
                </h2>
                <TraitBarList
                  selfScores={session.self_scores}
                  peerScores={averagePeerScores}
                />
              </div>

              {/* 深層心理トリセツ（完全版プレミアムレポート・Stripe決済） */}
              <PremiumTeaserCard
                sessionId={sessionId}
                hostNickname={session.host_nickname}
                report={premiumReport}
              />

              {/* 性格タイプ連動おすすめサービス（アフィリエイト） */}
              <RecommendationCard
                selfScores={session.self_scores}
                peerScores={averagePeerScores}
              />
            </>
          }
          friendsContent={
            <>
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
              <span>ホスト専用メニュー</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-white">
                もっと回答を集めて診断精度を高めますか？
              </h3>
              <p className="text-xs text-indigo-200">
                LINEで友達に回答を依頼すると、新しい二つ名や相性カルテがさらに解放されます。
              </p>
            </div>
            <Link
              href={`/me/${sessionId}`}
              className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-500 via-indigo-600 to-violet-600 hover:from-blue-600 hover:to-violet-700 text-white font-black text-base shadow-lg shadow-indigo-500/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>ホスト管理画面へ（LINEで友達を招待する）</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
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
            <Link
              href={`/diagnose?fromSession=${sessionId}&returnToHost=${encodeURIComponent(session.host_nickname)}`}
              className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 hover:from-amber-300 hover:to-purple-500 text-white font-black text-base shadow-lg shadow-pink-500/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
            >
              <span>あなたもギャップ診断を作ってみる（無料・1分）</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        )}

        {/* 法的情報リンク・フッター */}
        <footer className="pt-4 pb-8 text-center text-xs text-slate-400 space-x-3">
          <Link href="/privacy" className="hover:text-slate-600 hover:underline">
            プライバシーポリシー
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-slate-600 hover:underline">
            利用規約
          </Link>
          <span>•</span>
          <Link href="/legal" className="hover:text-slate-600 hover:underline">
            特定商取引法に基づく表記
          </Link>
          <p className="pt-2 text-[11px] text-slate-400">
            © {new Date().getFullYear()} GAP-FIVE. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}