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
        <span className="text-[10px] font-bold tracking-wider px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
          PAIR REPORT
        </span>
      </div>

      {/* 回答者タブ切り替え */}
      {compatibilities.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {compatibilities.map((c, idx) => (
            <button
              key={c.peerNickname}
              onClick={() => setSelectedIndex(idx)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedIndex === idx
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <span>{c.peerNickname} さん</span>
              {unlockedMap[c.peerNickname] ? (
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              ) : (
                <span className="text-[10px] opacity-70">無料版</span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* 相性サマリー（常に無料公開） */}
      <div className="bg-gradient-to-br from-rose-50 via-purple-50 to-indigo-50 border border-rose-100/80 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-rose-700 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            {hostNickname} × {current.peerNickname}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-xs text-slate-500 font-medium">波長シンクロ度</span>
            <span className="text-2xl font-black text-rose-600">
              {current.score}%
            </span>
          </div>
        </div>

        <div>
          <span className="text-[10px] font-bold text-slate-400 block mb-0.5">2人の関係性タイプ</span>
          <div className="text-sm font-black text-slate-800">
            『{current.pairTitle}』
          </div>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          {current.dynamicSummary}
        </p>
      </div>

      {/* 有料アンロック済みコンテンツ */}
      {isCurrentUnlocked ? (
        <div className="space-y-4 pt-2 border-t border-slate-100 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              <CheckCircle2 className="w-3.5 h-3.5" />
              個別カルテ開放済み
            </span>
            <span className="text-[10px] text-slate-400">100円買い切り</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-4">
              <div className="flex items-center gap-1.5 font-bold text-amber-900 mb-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                <span>すれ違いやすい地雷・衝突の落とし穴</span>
              </div>
              <p className="text-amber-900/90 leading-relaxed pl-5">
                {current.deepReport.potentialFriction}
              </p>
            </div>

            <div className="bg-indigo-50/70 border border-indigo-200/60 rounded-xl p-4">
              <div className="flex items-center gap-1.5 font-bold text-indigo-900 mb-1.5">
                <MessageCircle className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>本音を引き出すベストな会話トピック</span>
              </div>
              <p className="text-indigo-900/90 leading-relaxed pl-5">
                {current.deepReport.bestConversation}
              </p>
            </div>

            <div className="bg-emerald-50/70 border border-emerald-200/60 rounded-xl p-4">
              <div className="flex items-center gap-1.5 font-bold text-emerald-900 mb-1.5">
                <Lightbulb className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>2人の関係がさらに深まるアクション</span>
              </div>
              <p className="text-emerald-900/90 leading-relaxed pl-5">
                {current.deepReport.deepeningTip}
              </p>
            </div>
          </div>
        </div>
      ) : (
        /* 未開放ティーザー */
        <div className="relative rounded-2xl border border-dashed border-rose-200 p-5 bg-gradient-to-b from-white to-rose-50/40 text-center space-y-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-bold">
              <Lock className="w-3.5 h-3.5" />
              {current.peerNickname} さんとの深層相性カルテ
            </div>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              2人の「すれ違いやすい落とし穴」や「本音を引き出す対話法」など、関係を深める具体的なヒントをアンロックできます。
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-500 py-1">
            <div className="p-2 bg-white/80 rounded-xl border border-rose-100 shadow-sm">
              <span className="block font-bold text-slate-700 mb-0.5">⚠️ 衝突の地雷</span>
              <span className="text-[10px] text-slate-400">喧嘩の予防策</span>
            </div>
            <div className="p-2 bg-white/80 rounded-xl border border-rose-100 shadow-sm">
              <span className="block font-bold text-slate-700 mb-0.5">💬 会話テーマ</span>
              <span className="text-[10px] text-slate-400">本音の引き出し方</span>
            </div>
            <div className="p-2 bg-white/80 rounded-xl border border-rose-100 shadow-sm">
              <span className="block font-bold text-slate-700 mb-0.5">💡 深める秘訣</span>
              <span className="text-[10px] text-slate-400">長続きのコツ</span>
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <button
              onClick={handlePairCheckout}
              disabled={isLoading}
              className="w-full py-3 px-4 bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-50 active:scale-[0.99]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>決済ページへ移動中...</span>
                </>
              ) : (
                <>
                  <span>この人との相性カルテを見る（100円）</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
            <p className="text-[11px] font-bold text-rose-600">
              ※追加請求なし・1回限りの買い切りです（月額課金・自動更新等は一切ありません）
            </p>
            <p className="text-[10px] text-slate-400">
              ※{current.peerNickname} さんとの1対1詳細カルテのみを100円で買い切り閲覧できます。
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
