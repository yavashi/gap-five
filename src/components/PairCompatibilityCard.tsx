'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { PairCompatibility } from '@/lib/core/compatibility';
import { PeerSessionInfo } from '@/lib/actions/session';
import { Users, Sparkles, Heart, ShieldAlert, MessageCircle, Lightbulb, Lock, ArrowRight, Loader2, CheckCircle2, UserCheck, Zap } from 'lucide-react';

interface PairCompatibilityCardProps {
  sessionId: string;
  compatibilities: PairCompatibility[];
  hostNickname: string;
  peerSessionMap?: Record<string, PeerSessionInfo>;
}

export const PairCompatibilityCard: React.FC<PairCompatibilityCardProps> = ({
  sessionId,
  compatibilities,
  hostNickname,
  peerSessionMap = {},
}) => {
  const searchParams = useSearchParams();
  const pairUnlockedFromUrl = searchParams?.get('pairUnlocked');
  const [unlockedMap, setUnlockedMap] = useState<Record<string, boolean>>({});
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const newMap: Record<string, boolean> = {};

    compatibilities.forEach((c) => {
      const storageKey = `gap_five_pair_${sessionId}_${c.peerNickname}`;
      const isSaved = localStorage.getItem(storageKey) === 'true';
      const isUrlMatch = pairUnlockedFromUrl === c.peerNickname;

      if (isSaved || isUrlMatch) {
        newMap[c.peerNickname] = true;
        if (isUrlMatch) {
          localStorage.setItem(storageKey, 'true');
        }
      }
    });

    setUnlockedMap(newMap);

    // URLで指定された回答者のタブを自動選択
    if (pairUnlockedFromUrl) {
      const targetIdx = compatibilities.findIndex((c) => c.peerNickname === pairUnlockedFromUrl);
      if (targetIdx !== -1) {
        setSelectedIndex(targetIdx);
      }
    }
  }, [sessionId, compatibilities, pairUnlockedFromUrl]);

  if (!compatibilities || compatibilities.length === 0) {
    return null;
  }

  const current = compatibilities[selectedIndex] || compatibilities[0];
  const isCurrentUnlocked = !!unlockedMap[current.peerNickname];

  const handlePairCheckout = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          hostNickname,
          itemType: 'pair',
          peerNickname: current.peerNickname,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || '決済の開始に失敗しました');
        setIsLoading(false);
      }
    } catch (e: any) {
      alert('エラーが発生しました。もう一度お試しください。');
      setIsLoading(false);
    }
  };

  return (
    <div id="pair-card" className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
            <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              回答者との個別相性カルテ
            </h2>
            <p className="text-[11px] text-slate-500">
              あなたと回答してくれた友人との1対1ケミストリー分析
            </p>
          </div>
        </div>
        <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
          1対1 相性診断
        </span>
      </div>

      {/* 回答者選択タブ（複数人の場合） */}
      {compatibilities.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {compatibilities.map((comp, idx) => {
            const isTabUnlocked = !!unlockedMap[comp.peerNickname];
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  selectedIndex === idx
                    ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span>{comp.peerNickname} さんとの相性</span>
                {isTabUnlocked ? (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                ) : (
                  <Lock className="w-3 h-3 opacity-60" />
                )}
              </button>
            );
          })}
        </div>
      )}

      {/* 【無料公開枠】相性度スコア & 二つ名・キャッチコピー */}
      <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-500/10 via-pink-500/5 to-amber-500/10 border border-rose-200/60 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-rose-700">
            {hostNickname} × {current.peerNickname} の波長シンクロ度
          </span>
          <span className="text-2xl font-black text-rose-600">
            {current.score}%
          </span>
        </div>

        <div className="space-y-1">
          <div className="text-base sm:text-lg font-black text-slate-900 leading-snug">
            {current.title}
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {current.tagline}
          </p>
        </div>
      </div>

      {/* 【有料・詳細分析コンテンツ（1人100円）】 */}
      {isCurrentUnlocked ? (
        <div className="space-y-4 text-xs animate-in fade-in duration-300">
          <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px] pb-1 border-b border-slate-100">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{current.peerNickname} さんとの詳細相性カルテ（開放済み）</span>
          </div>

          {/* 相手から見た最大の魅力 */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-blue-700">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{current.peerNickname} さんから見たあなたの魅力</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              {current.peerImpression}
            </p>
          </div>

          {/* 2人のシナジー */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-emerald-700">
              <Lightbulb className="w-3.5 h-3.5" />
              <span>2人が共鳴・高め合えるポイント</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              {current.goodChemistry}
            </p>
          </div>

          {/* すれ違いやすい地雷＆回避策 */}
          <div className="p-4 rounded-2xl bg-rose-50/60 border border-rose-100 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-rose-800">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>すれ違いやすいポイント＆仲直りアドバイス</span>
            </div>
            <p className="text-slate-700 leading-relaxed">
              <strong>注意点:</strong> {current.blindSpot}
            </p>
            <p className="text-slate-700 leading-relaxed">
              <strong>解決策:</strong> {current.advice}
            </p>
          </div>

          {/* 仲が深まる魔法の会話テーマ */}
          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/60 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-800">
              <MessageCircle className="w-3.5 h-3.5" />
              <span>2人の仲が爆速で深まる「魔法の会話テーマ」</span>
            </div>
            <p className="text-slate-800 font-medium leading-relaxed">
              「{current.magicTopic}」
            </p>
          </div>
        </div>
      ) : (
        /* 未購入時のチラ見せプレビュー（1人100円で個別購入・価値伝達型UI） */
        <div className="space-y-3.5 text-xs">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-500/5 via-pink-500/5 to-amber-500/5 border border-rose-100 space-y-2.5 text-left">
            <div className="flex items-center justify-between text-xs font-bold text-rose-700">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                100円で開放される {current.peerNickname} さんとの詳細カルテ
              </span>
              <span className="bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full text-[10px]">
                全4項目
              </span>
            </div>

            {/* 4大特典のプレビューリスト */}
            <div className="space-y-2 text-slate-700">
              <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <strong className="block text-slate-800 text-xs font-bold">{current.peerNickname} さんから見たあなたの魅力</strong>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    {current.peerImpression.slice(0, 24)}...（完全アンロック）
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
                <Zap className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <strong className="block text-slate-800 text-xs font-bold">2人が高め合えるシナジーポイント</strong>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    {current.goodChemistry.slice(0, 24)}...（完全アンロック）
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 bg-white p-3 rounded-xl border border-slate-100 shadow-2xs">
                <ShieldAlert className="w-3.5 h-3.5 text-rose-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <strong className="block text-slate-800 text-xs font-bold">すれ違いやすい地雷ポイント ＆ 回避策</strong>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    {current.blindSpot.slice(0, 20)}...（完全アンロック）
                  </p>
                </div>
              </div>

              {/* キラーフック：魔法の会話テーマ */}
              <div className="flex items-start gap-2.5 bg-gradient-to-r from-amber-50 to-orange-50 p-3 rounded-xl border border-amber-200/80 shadow-2xs">
                <MessageCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <strong className="text-amber-950 text-xs font-black">2人の仲が爆速で深まる「魔法の会話テーマ」</strong>
                    <span className="text-[9px] bg-amber-500 text-white font-bold px-1.5 py-0.2 rounded">極秘</span>
                  </div>
                  <p className="text-amber-800/80 text-[11px] leading-relaxed">
                    今夜のLINEや会話ですぐ使える、2人の波長が一気に打ち解けるキラー話題（完全開放）
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 支払いで何が起こるかの約束 */}
          <div className="text-center text-[11px] font-bold text-rose-600 flex items-center justify-center gap-1">
            <Zap className="w-3 h-3 text-rose-500 animate-pulse" />
            <span>お支払い完了後、この画面のまま瞬時にカルテがアンロックされます</span>
          </div>

          {/* 購入ボタン */}
          <button
            type="button"
            onClick={handlePairCheckout}
            disabled={isLoading}
            className="w-full py-3.5 sm:py-4 px-4 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-600 hover:to-pink-600 text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-rose-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-75"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>決済画面を準備中...</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-yellow-200" />
                <span>100円で {current.peerNickname} さんとのカルテを今すぐ見る</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </>
            )}
          </button>

          {/* ボタン下：安心保証とスマートな決済手段表記 */}
          <div className="space-y-1 text-center pt-0.5">
            <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 flex-wrap">
              <span>🍎 Apple Pay</span>
              <span>•</span>
              <span>📱 Google Pay</span>
              <span>•</span>
              <span>🔴 PayPay</span>
              <span>•</span>
              <span>💳 クレカ対応</span>
            </div>
            <p className="text-[11px] font-bold text-slate-600">
              ※追加請求なし・1回限りの完全買い切りです（月額課金・自動更新なし）
            </p>
          </div>
        </div>
      )}

      {/* 相手の診断ページへのアクセス導線（相互診断リンク） */}
      {(() => {
        const pInfo = peerSessionMap[current.peerNickname];
        if (pInfo?.sessionId) {
          return (
            <div className="p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left animate-fadeIn">
              <div className="space-y-0.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-950">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>{current.peerNickname} さんの診断ページ</span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {pInfo.hasAnswered
                    ? `${current.peerNickname} さんの確定二つ名・診断結果を見に行けます`
                    : `あなたから見た ${current.peerNickname} さんの性格を採点してあげましょう！`}
                </p>
              </div>
              <div className="shrink-0">
                {pInfo.hasAnswered ? (
                  <Link
                    href={`/result/${pInfo.sessionId}`}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
                  >
                    <span>{current.peerNickname} さんの結果を見る</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <Link
                    href={`/answer/${pInfo.sessionId}`}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
                  >
                    <span>{current.peerNickname} さんを逆評価する</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            </div>
          );
        } else {
          return (
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-left text-xs">
              <div className="text-slate-600">
                <span className="font-bold text-slate-800">{current.peerNickname}</span> さんはまだ診断を作っていないようです
              </div>
              <a
                href={`https://line.me/R/msg/text/?${encodeURIComponent(
                  `【GAP-FIVE】${current.peerNickname}ちゃんも自分のギャップ診断を作ってみて！私にも採点させて〜！\nhttps://gap-five-nine.vercel.app/diagnose`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-[#06C755] hover:bg-[#05b34c] text-white text-xs font-bold shadow-2xs transition-colors inline-flex items-center justify-center gap-1.5 shrink-0"
              >
                <span>LINEで診断をおねだり</span>
              </a>
            </div>
          );
        }
      })()}
    </div>
  );
};
