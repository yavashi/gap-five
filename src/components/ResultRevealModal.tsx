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
  peerRealityTitle?: string;
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
  peerRealityTitle,
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
    const t1 = setTimeout(() => setProgress(55), 400);
    const t2 = setTimeout(() => setProgress(88), 900);
    const t3 = setTimeout(() => {
      setProgress(100);
      setStep('ready');
    }, 1400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [isOpen, step]);

  const handleUnlock = () => {
    // ド派手な紙吹雪演出
    try {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#3b82f6', '#10b981'],
      });
      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
        });
      }, 250);
    } catch {
      // noop
    }

    setStep('revealed');
  };

  const handleClose = () => {
    const storageKey = `gap_five_revealed_${sessionId}`;
    sessionStorage.setItem(storageKey, 'true');
    setIsOpen(false);
  };

  const handleReplay = () => {
    setStep('analyzing');
    setProgress(10);
    setIsOpen(true);
  };

  return (
    <>
      {/* 再生トリガーボタン（いつでも結果発表演出を見直せる） */}
      <div className="flex justify-center mb-4">
        <button
          type="button"
          onClick={handleReplay}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300 text-xs font-bold transition-all border border-indigo-200 dark:border-indigo-800/60 hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-spin" />
          <span>二つ名の確定演出をもう一度見る</span>
        </button>
      </div>

      {/* モーダルオーバーレイ */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-3xl p-6 sm:p-8 text-white shadow-2xl text-center overflow-hidden">
            {/* 背景の光彩エフェクト */}
            <div className="absolute -top-24 -left-24 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl pointer-events-none" />

            {/* 閉じるボタン */}
            <button
              type="button"
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors z-10 cursor-pointer"
              aria-label="閉じる"
            >
              <X className="w-5 h-5" />
            </button>

            {/* STEP 1: 他者評価を照合・AI解析中 */}
            {step === 'analyzing' && (
              <div className="py-8 space-y-6 animate-in fade-in duration-300">
                <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-400 animate-spin" />
                  <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-bold text-white">
                    周囲からの評価データと照合中...
                  </h3>
                  <p className="text-xs text-slate-400">
                    {answerCount}名の回答から「本人の自覚」と「周囲の実態」の落差を計算しています
                  </p>
                </div>

                {/* プログレスバー */}
                <div className="w-full max-w-xs mx-auto space-y-1">
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-pink-500 transition-all duration-300 ease-out"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="text-[11px] font-mono text-indigo-300 text-right">
                    {progress}%
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: アンロック待機（自称 vs 実態は伏せ字🔒） */}
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

                {/* 2つのカード（周囲の目はアンロックまで非公開） */}
                <div className="grid grid-cols-2 gap-3 py-2 text-left">
                  <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-400/30 space-y-1">
                    <span className="text-[11px] font-bold text-blue-300 block">本人の自認</span>
                    <p className="text-sm font-black text-white truncate">{selfLabel}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-rose-500/10 border border-dashed border-rose-400/40 space-y-1 bg-rose-950/20">
                    <span className="text-[11px] font-bold text-rose-300 block">周囲から見た実態</span>
                    <p className="text-sm font-black text-rose-300 flex items-center gap-1.5">
                      <span>🔒</span>
                      <span className="tracking-widest">？？？？？</span>
                    </p>
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

            {/* STEP 3: 確定二つ名のリビール（自称と実態の2段構成で発表） */}
            {step === 'revealed' && (
              <div className="py-6 space-y-5 animate-in zoom-in duration-500">
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

                {/* 2段表示カード */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-left">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-400/30">
                      自称
                    </span>
                    <span className="font-bold text-slate-200 truncate">{selfLabel}</span>
                  </div>

                  <div className="space-y-1 pt-1 border-t border-white/10">
                    <div className="flex items-center gap-1.5 text-xs text-rose-300 font-bold">
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 border border-rose-400/30">
                        周囲が暴いた実態
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-200 to-yellow-400 leading-snug drop-shadow-md pt-1">
                      {peerRealityTitle || finalTitle}
                    </h2>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 leading-relaxed text-left">
                  <div className="flex items-center gap-1.5 font-bold text-yellow-300 mb-1">
                    <Award className="w-4 h-4" />
                    <span>分析コメント</span>
                  </div>
                  「{selfLabel}」を自認するあなたですが、周囲からは「{peerRealityLabel}」という圧倒的な実態が浮かび上がりました！
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-base shadow-xl transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>詳しいギャップ分析を見る</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
