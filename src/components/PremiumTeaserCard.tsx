'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PremiumReport } from '@/lib/core/premium';
import { Lock, Unlock, Sparkles, Briefcase, Heart, ShieldAlert, CheckCircle2, ArrowRight, Loader2 } from 'lucide-react';

interface PremiumTeaserCardProps {
  sessionId: string;
  hostNickname: string;
  report: PremiumReport;
}

export const PremiumTeaserCard: React.FC<PremiumTeaserCardProps> = ({
  sessionId,
  hostNickname,
  report,
}) => {
  const searchParams = useSearchParams();
  const isUnlockedFromUrl = searchParams?.get('premium') === 'unlocked';

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storageKey = `gap_five_premium_${sessionId}`;
    if (isUnlockedFromUrl || localStorage.getItem(storageKey) === 'true') {
      setIsUnlocked(true);
      localStorage.setItem(storageKey, 'true');
    }
  }, [sessionId, isUnlockedFromUrl]);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, hostNickname }),
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

  // アンロック済み表示
  if (isUnlocked) {
    return (
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6 border border-amber-500/30 relative overflow-hidden animate-in fade-in duration-500">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              PREMIUM UNLOCKED
            </span>
            <span className="text-xs text-slate-300 font-bold">深層心理トリセツ完全版</span>
          </div>
          <CheckCircle2 className="w-5 h-5 text-amber-400" />
        </div>

        <div className="space-y-6">
          {/* 1. 仕事・キャリア編 */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-blue-300 font-bold text-sm">
              <Briefcase className="w-4 h-4" />
              <span>【仕事・キャリア】{report.career.title}</span>
            </div>
            <div className="space-y-2 text-xs text-slate-200">
              <p><strong className="text-amber-300 font-bold">天賦の強み:</strong> {report.career.superPower}</p>
              <p><strong className="text-emerald-300 font-bold">無双できる職場:</strong> {report.career.idealEnvironment}</p>
              <p><strong className="text-rose-300 font-bold">一瞬で病むNG環境:</strong> {report.career.toxicEnvironment}</p>
              <div className="bg-blue-500/10 p-3 rounded-xl border border-blue-400/20 text-blue-100">
                💡 <strong>成長アドバイス:</strong> {report.career.growthAdvice}
              </div>
            </div>
          </div>

          {/* 2. 恋愛・パートナーシップ編 */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-pink-300 font-bold text-sm">
              <Heart className="w-4 h-4" />
              <span>【恋愛・パートナーシップ】{report.romance.title}</span>
            </div>
            <div className="space-y-2 text-xs text-slate-200">
              <p><strong className="text-amber-300 font-bold">愛のスタイル:</strong> {report.romance.loveStyle}</p>
              <p><strong className="text-rose-300 font-bold">踏みがちな地雷:</strong> {report.romance.hiddenTrap}</p>
              <p><strong className="text-emerald-300 font-bold">離してはいけない相手:</strong> {report.romance.bestPartnerTrait}</p>
              <div className="bg-pink-500/10 p-3 rounded-xl border border-pink-400/20 text-pink-100">
                🔒 <strong>裏の願望:</strong> {report.romance.secretDesire}
              </div>
            </div>
          </div>

          {/* 3. ストレス・メンタル処方箋 */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-sm">
              <ShieldAlert className="w-4 h-4" />
              <span>【メンタル＆ストレス処方箋】{report.mental.title}</span>
            </div>
            <div className="space-y-2 text-xs text-slate-200">
              <p><strong className="text-rose-300 font-bold">ストレスの引き金:</strong> {report.mental.stressTrigger}</p>
              <p><strong className="text-amber-300 font-bold">危険シグナル:</strong> {report.mental.dangerSign}</p>
              <p><strong className="text-emerald-300 font-bold">最速のリカバリー:</strong> {report.mental.quickRecovery}</p>
              <div className="bg-purple-500/10 p-3 rounded-xl border border-purple-400/20 text-purple-100">
                🔋 <strong>おすすめリフレッシュ習慣:</strong> {report.mental.rechargeRoutine}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 未購入（チラ見せ）表示
  return (
    <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-5 border border-amber-500/40 relative overflow-hidden">
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
          <Lock className="w-3.5 h-3.5 text-amber-300" />
          <span>プレミアム限定レポート</span>
        </div>
        <span className="text-[11px] font-bold text-amber-300/80 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/20">
          お試し価格 ¥300
        </span>
      </div>

      <div className="space-y-1">
        <h3 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-400">
          {hostNickname} さんの深層心理トリセツ（完全版）
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          周囲から見えたリアルなギャップを元に、仕事・恋愛・メンタルの3大深層心理を徹底解説します。
        </p>
      </div>

      {/* チラ見せプレビューカード群（一部ブラー） */}
      <div className="space-y-3 text-xs pt-1">
        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-blue-300">
            <Briefcase className="w-3.5 h-3.5" />
            <span>仕事編: {report.career.title}</span>
          </div>
          <p className="text-slate-300">
            無双できる職場: {report.career.idealEnvironment.slice(0, 20)}
            <span className="blur-xs select-none opacity-60">...（有料限定で完全開放）</span>
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-pink-300">
            <Heart className="w-3.5 h-3.5" />
            <span>恋愛編: {report.romance.title}</span>
          </div>
          <p className="text-slate-300">
            無意識の地雷: {report.romance.hiddenTrap.slice(0, 18)}
            <span className="blur-xs select-none opacity-60">...（有料限定で完全開放）</span>
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-purple-300">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>メンタル処方箋: {report.mental.title}</span>
          </div>
          <p className="text-slate-300">
            危険シグナル: {report.mental.dangerSign.slice(0, 18)}
            <span className="blur-xs select-none opacity-60">...（有料限定で完全開放）</span>
          </p>
        </div>
      </div>

      {/* 購入ボタン */}
      <button
        type="button"
        onClick={handleCheckout}
        disabled={isLoading}
        className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-base sm:text-lg shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-75"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>決済画面を準備中...</span>
          </>
        ) : (
          <>
            <Unlock className="w-5 h-5" />
            <span>300円で完全版をアンロック</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </>
        )}
      </button>
      <p className="text-[11px] text-slate-400 text-center">
        ※Apple Pay / Google Pay / クレジットカード対応。1回買い切りで永久閲覧可能です。
      </p>
    </div>
  );
};
