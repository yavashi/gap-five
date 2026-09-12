'use client';

import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Zap, ArrowRight, X, RotateCcw, Award } from 'lucide-react';

interface ResultRevealModalProps {
  sessionId: string;
  hostNickname: string;
  finalTitle: string;
  selfLabel: string;
  peerRealityLabel: string;
  isRare?: boolean;
  rarityBadge?: string;
  answerCount: number;
}

export const ResultRevealModal: React.FC<ResultRevealModalProps> = ({
  sessionId,
  hostNickname,
  finalTitle,
  selfLabel,
  peerRealityLabel,
  isRare = false,
  rarityBadge,
  answerCount,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState<'analyzing' | 'ready' | 'revealed'>('analyzing');
  const [progress, setProgress] = useState(15);

  // 初回表示判定（sessionStorageで初回訪問時のみ自動オープン）
  useEffect(() => {
    const storageKey = `gap_five_revealed_${sessionId}`;
    const hasSeen = sessionStorage.getItem(storageKey);
    if (!hasSeen) {
      setIsOpen(true);
    }
  }, [sessionId]);

  // 解析アニメーションのステップ制御
  useEffect(() => {
    if (!isOpen || step !== 'analyzing') return;

    setProgress(20);
    const t1 = setTimeout(() => setProgress(65), 500);
    const t2 = setTimeout(() => setProgress(100), 1100);
    const t3 = setTimeout(() => {
      setStep('ready');
    }, 1600);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen, step]);

  const triggerConfetti = () => {
    if (isRare) {
      // レア称号用：豪華な3連バースト
      const end = Date.now() + 2 * 1000;
      const colors = ['#FFD700', '#FFA500', '#FF1493', '#8A2BE2', '#00FFFF'];

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });
        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    } else {
      // 通常称号用：中央からの華やかな拡散
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  };

  const handleUnlock = () => {
    setStep('revealed');
    triggerConfetti();
  };

  const handleClose = () => {
    sessionStorage.setItem(`gap_five_revealed_${sessionId}`, 'true');
    setIsOpen(false);
  };

  const handleReplay = () => {
    setStep('analyzing');
    setProgress(15);
    setIsOpen(true);
  };

  return (
    <>
      {/* 画面上に常駐する「演出をもう一度見る」トリガーボタン */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleReplay}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/5 hover:bg-slate-900/10 text-slate-600 text-xs font-bold transition-all border border-slate-200 shadow-2xs hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-indigo-600" />
          <span>結果発表の演出をもう一度見る</span>
        </button>
      </div>

      {/* フルスクリーン演出モーダル */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-2xl border border-indigo-500/30 overflow-hidden text-center">
            {/* 装飾の背景グロー */}
            <div className="absolute -top-24 -left-24 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* スキップボタン */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full hover:bg-white/10 transition-colors"
              title="スキップ"
            >
              <X className="w-5 h-5" />
            </button>

            {/* STEP 1: 解析中アニメーション */}
            {step === 'analyzing' && (
              <div className="py-12 space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="relative w-20 h-20 mx-auto">
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 animate-ping" />
                  <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/50">
                    <Sparkles className="w-10 h-10 text-yellow-300 animate-spin" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight">
                    {hostNickname} さんのギャップを照合中...
                  </h3>
                  <p className="text-xs sm:text-sm text-indigo-200">
                    自己評価 × {answerCount}名の友人データを心理学的に分析しています
                  </p>
                </div>

                {/* プログレスバー */}
                <div className="max-w-xs mx-auto space-y-1.5">
                  <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 via-indigo-400 to-pink-500 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-[11px] font-mono text-indigo-300 text-right">
                    {progress}%
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: アンロック待機（自称 vs 実態） */}
            {step === 'ready' && (
              <div className="py-6 space-y-6 animate-in fade-in zoom-in duration-300">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/30 text-indigo-300 text-xs font-bold border border-indigo-400/30">
                  <Zap className="w-3.5 h-3.5 text-yellow-400" />
                  <span>ANALYSIS COMPLETE</span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl sm:text-3xl font-black">
                    確定診断が完成しました！
                  </h3>
                  <p className="text-xs text-slate-300">
                    あなたの「自負」と周囲から見えた「実態」が衝突します
                  </p>
                </div>

                {/* 2つのカードが激突するUI */}
                <div className="grid grid-cols-2 gap-3 py-2 text-left">
                  <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-400/30 space-y-1">
                    <span className="text-[11px] font-bold text-blue-300 block">本人の自認</span>
                    <p className="text-sm font-black text-white truncate">{selfLabel}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-400/30 space-y-1">
                    <span className="text-[11px] font-bold text-rose-300 block">周囲の目</span>
                    <p className="text-sm font-black text-white truncate">{peerRealityLabel}</p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleUnlock}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-rose-500 to-purple-600 hover:from-amber-300 hover:to-purple-500 text-white font-black text-lg shadow-xl shadow-pink-500/30 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-yellow-200 animate-bounce" />
                  <span>確定二つ名をアンロック！</span>
                </button>
              </div>
            )}

            {/* STEP 3: 確定二つ名のリビール（発表） */}
            {step === 'revealed' && (
              <div className="py-6 space-y-6 animate-in zoom-in duration-500">
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">
                      {hostNickname} さんの確定二つ名
                    </span>
                    {isRare && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-black bg-gradient-to-r from-amber-400 via-rose-400 to-purple-400 text-slate-900 shadow-md animate-pulse">
                        ✨ {rarityBadge}
                      </span>
                    )}
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 leading-tight py-2 drop-shadow-md">
                    {finalTitle}
                  </h2>
                </div>

                <div className="p-4 rounded-2xl bg-white/10 border border-white/15 text-xs text-slate-200 leading-relaxed text-left">
                  <div className="flex items-center gap-1.5 font-bold text-yellow-300 mb-1">
                    <Award className="w-4 h-4" />
                    <span>自称と実態のコントラスト</span>
                  </div>
                  「{selfLabel}」を自認するあなたですが、周囲からは「{peerRealityLabel}」という圧倒的な実態が浮かび上がりました！
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-base shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>詳しいギャップ分析を見る</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
