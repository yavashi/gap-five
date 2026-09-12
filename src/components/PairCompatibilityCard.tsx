'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PairCompatibility } from '@/lib/core/compatibility';
import { Users, Sparkles, Heart, ShieldAlert, MessageCircle, Lightbulb, Lock, ArrowRight } from 'lucide-react';

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
  const isUnlockedFromUrl = searchParams?.get('premium') === 'unlocked';
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const storageKey = `gap_five_premium_${sessionId}`;
    if (isUnlockedFromUrl || localStorage.getItem(storageKey) === 'true') {
      setIsUnlocked(true);
    }
  }, [sessionId, isUnlockedFromUrl]);

  const scrollToCheckout = () => {
    const el = document.getElementById('premium-card');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (!compatibilities || compatibilities.length === 0) {
    return null;
  }

  const current = compatibilities[selectedIndex] || compatibilities[0];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 space-y-5">
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
          {compatibilities.map((comp, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                selectedIndex === idx
                  ? 'bg-rose-500 text-white shadow-sm shadow-rose-500/20'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{comp.peerNickname} さんとの相性</span>
            </button>
          ))}
        </div>
      )}

      {/* 相性度スコア & 二つ名カード */}
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

      {/* 詳細分析コンテンツ */}
      {isUnlocked ? (
        <div className="space-y-4 text-xs animate-in fade-in duration-300">
          {/* 田中さんから見た最大の魅力 */}
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
        /* 未購入時のチラ見せプレビュー */
        <div className="space-y-3 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>{current.peerNickname} さんから見たあなたの魅力</span>
            </div>
            <p className="text-slate-500">
              {current.peerImpression.slice(0, 24)}
              <span className="blur-xs select-none opacity-60">...（プレミアム完全版でアンロック）</span>
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-slate-700">
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
              <span>2人のすれ違い地雷と解決策</span>
            </div>
            <p className="text-slate-500">
              {current.blindSpot.slice(0, 20)}
              <span className="blur-xs select-none opacity-60">...（プレミアム完全版でアンロック）</span>
            </p>
          </div>

          <button
            type="button"
            onClick={scrollToCheckout}
            className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all hover:scale-[1.01] cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5 text-amber-300" />
            <span>{current.peerNickname} さんとの詳細相性カルテを開放する</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      )}
    </div>
  );
};
