'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PairCompatibility } from '@/lib/core/compatibility';
import { Users, Sparkles, Heart, ShieldAlert, MessageCircle, Lightbulb, Lock, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

interface PairCompatibilityCardProps {
  sessionId: string;
  compatibilities: PairCompatibility[];
  hostNickname: string;
}

export const PairCompatibilityCard: React.FC<PairCompatibilityCardProps> = ({
  sessionId,
  compatibilities,
  hostNickname,
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
        /* 未購入時のチラ見せプレビュー（1人100円で個別購入） */
        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{current.peerNickname} さんから見たあなたの魅力</span>
            </div>
            <p className="text-slate-500">
              {current.peerImpression.slice(0, 24)}
              <span className="blur-xs select-none opacity-60">...（詳細解説でアンロック）</span>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>すれ違いやすい地雷ポイント & 解決策</span>
            </div>
            <p className="text-slate-500">
              {current.blindSpot.slice(0, 20)}
              <span className="blur-xs select-none opacity-60">...（詳細解説でアンロック）</span>
            </p>
          </div>

          {/* 対応決済手段のミニバッジ */}
          <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-2.5 space-y-1.5">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-700 font-bold flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-rose-500" />
                1タップ決済・複数のお支払いに対応
              </span>
              <span className="text-slate-400">カード番号入力不要</span>
            </div>
            <div className="grid grid-cols-4 gap-1 text-center text-[9px] font-bold">
              <div className="py-1 px-1 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs">
                🍎 Apple Pay
              </div>
              <div className="py-1 px-1 rounded-md bg-white border border-slate-200 text-slate-700 shadow-2xs">
                📱 G Pay
              </div>
              <div className="py-1 px-1 rounded-md bg-rose-50 border border-rose-200 text-rose-600 shadow-2xs">
                🔴 PayPay
              </div>
              <div className="py-1 px-1 rounded-md bg-blue-50 border border-blue-200 text-blue-600 shadow-2xs">
                💳 カード
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handlePairCheckout}
            disabled={isLoading}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-500/20 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-75"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>決済画面を準備中...</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-yellow-200" />
                <span>{current.peerNickname} さんとの詳細解説を開放する（¥100）</span>
                <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
              </>
            )}
          </button>
          <div className="space-y-1 text-center">
            <p className="text-[11px] font-bold text-rose-600">
              ※追加請求なし・1回限りの買い切りです（月額課金・自動更新等は一切ありません）
            </p>
            <p className="text-[10px] text-slate-400">
              Face ID / Touch ID / PayPay等で1タップ決済。ご購入後はこの端末でいつでもご覧いただけます。
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
