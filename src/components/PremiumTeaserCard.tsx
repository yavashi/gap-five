'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PremiumReport } from '@/lib/core/premium';
import { Lock, Unlock, Sparkles, Briefcase, Heart, ShieldAlert, CheckCircle2, ArrowRight, Loader2, BookOpen, Compass, Check } from 'lucide-react';

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
      <div id="premium-card" className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-6 border border-amber-500/30 relative overflow-hidden animate-in fade-in duration-500">
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
          {/* 1. 仕事・キャリア完全版 */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-blue-300 font-bold text-sm sm:text-base border-b border-white/10 pb-2">
              <Briefcase className="w-4 h-4 text-blue-400" />
              <span>【仕事・キャリア完全版】{report.career.title}</span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-200">
              <div>
                <strong className="text-amber-300 font-bold block mb-1">天賦の強み:</strong>
                <p className="text-slate-300 leading-relaxed">{report.career.superPower}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-400/20 space-y-1">
                  <strong className="text-emerald-300 font-bold text-xs block">✨ 無双できる職場環境</strong>
                  <p className="text-xs text-slate-300 leading-relaxed">{report.career.idealEnvironment}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-400/20 space-y-1">
                  <strong className="text-rose-300 font-bold text-xs block">⚠️ 一瞬で病むNG環境</strong>
                  <p className="text-xs text-slate-300 leading-relaxed">{report.career.toxicEnvironment}</p>
                </div>
              </div>

              {/* 向いている職種・役割 5選 */}
              <div className="pt-2">
                <strong className="text-blue-300 font-bold block mb-2 text-xs">🎯 向いている職種・ポジション具体例:</strong>
                <div className="flex flex-wrap gap-2">
                  {report.career.bestRoles.map((role, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-200 text-xs font-medium border border-blue-400/30"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </div>

              {/* 最強の立ち回り術 */}
              <div className="bg-indigo-500/10 p-3.5 rounded-xl border border-indigo-400/20 text-indigo-100 text-xs space-y-1">
                <strong className="font-bold block text-indigo-200">💼 会議・交渉での最強立ち回り術:</strong>
                <p className="leading-relaxed text-slate-300">{report.career.tactics}</p>
              </div>

              {/* 相棒タイプ＆成長アドバイス */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-2">
                <p><strong className="text-amber-300">🤝 才能を開花させる相棒タイプ:</strong> {report.career.bestPartnerType}</p>
                <p><strong className="text-blue-300">💡 成長アドバイス:</strong> {report.career.growthAdvice}</p>
              </div>
            </div>
          </div>

          {/* 2. 恋愛・パートナーシップ完全版 */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-pink-300 font-bold text-sm sm:text-base border-b border-white/10 pb-2">
              <Heart className="w-4 h-4 text-pink-400" />
              <span>【恋愛・パートナーシップ完全版】{report.romance.title}</span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-200">
              <div>
                <strong className="text-amber-300 font-bold block mb-1">愛のスタイル:</strong>
                <p className="text-slate-300 leading-relaxed">{report.romance.loveStyle}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-400/20 space-y-1">
                  <strong className="text-rose-300 font-bold text-xs block">💣 無意識に踏みがちな地雷</strong>
                  <p className="text-xs text-slate-300 leading-relaxed">{report.romance.hiddenTrap}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-pink-500/10 border border-pink-400/20 space-y-1">
                  <strong className="text-pink-300 font-bold text-xs block">💍 離してはいけない相手の特徴</strong>
                  <p className="text-xs text-slate-300 leading-relaxed">{report.romance.bestPartnerTrait}</p>
                </div>
              </div>

              {/* 相手に求めるべき3つの絶対条件 */}
              <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-2">
                <strong className="text-pink-300 font-bold block">✨ 相手に求めるべき「3つの絶対条件」:</strong>
                <ul className="space-y-1 text-slate-300">
                  {report.romance.idealConditions.map((cond, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                      <span>{cond}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 仲直りアプローチ */}
              <div className="bg-pink-500/10 p-3.5 rounded-xl border border-pink-400/20 text-xs space-y-1">
                <strong className="text-pink-200 font-bold block">🕊️ 喧嘩・すれ違い時の最短仲直りアプローチ:</strong>
                <p className="text-slate-300 leading-relaxed">{report.romance.conflictResolution}</p>
              </div>

              <div className="bg-purple-500/10 p-3.5 rounded-xl border border-purple-400/20 text-xs">
                🔒 <strong>裏の願望:</strong> <span className="text-slate-300">{report.romance.secretDesire}</span>
              </div>
            </div>
          </div>

          {/* 3. あなたの公式取扱説明書（5箇条） */}
          <div className="p-5 sm:p-6 rounded-2xl bg-amber-500/10 border border-amber-400/30 space-y-4">
            <div className="flex items-center gap-2 text-amber-300 font-bold text-sm sm:text-base border-b border-amber-400/20 pb-2">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>{report.manual.title}</span>
            </div>
            <p className="text-xs text-amber-200/80">
              友人・同僚・恋人にシェアして読んでもらうと、人間関係の摩擦が劇的に減る実用マニュアルです。
            </p>

            <div className="space-y-2.5">
              {report.manual.rules.map((rule, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-900/60 border border-amber-400/20 text-xs space-y-1"
                >
                  <span className="font-bold text-amber-300 block">{rule.title}</span>
                  <p className="text-slate-300 leading-relaxed">{rule.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 4. メンタル＆エナジー処方箋完全版 */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
            <div className="flex items-center gap-2 text-purple-300 font-bold text-sm sm:text-base border-b border-white/10 pb-2">
              <ShieldAlert className="w-4 h-4 text-purple-400" />
              <span>【メンタル＆エナジー処方箋】{report.mental.title}</span>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-400/20 space-y-1">
                  <strong className="text-rose-300 font-bold text-xs block">⚡ ストレスの引き金（トリガー）</strong>
                  <p className="text-xs text-slate-300 leading-relaxed">{report.mental.stressTrigger}</p>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-400/20 space-y-1">
                  <strong className="text-amber-300 font-bold text-xs block">🚨 限界寸前の危険シグナル</strong>
                  <p className="text-xs text-slate-300 leading-relaxed">{report.mental.dangerSign}</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-400/20 text-xs space-y-1">
                <strong className="text-emerald-300 font-bold block">🔋 30分でHPを回復する具体ルーティン:</strong>
                <p className="text-slate-300 leading-relaxed">{report.mental.quickRecovery}</p>
              </div>

              <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-400/20 text-xs space-y-1">
                <strong className="text-purple-200 font-bold block">🌿 月1回の「完全孤立デー」の過ごし方:</strong>
                <p className="text-slate-300 leading-relaxed">{report.mental.rechargeRoutine}</p>
              </div>

              <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-400/30 text-center text-xs sm:text-sm space-y-1">
                <span className="text-[11px] text-indigo-300 font-bold block uppercase tracking-wider">心を守るアファメーション</span>
                <p className="text-amber-200 font-bold italic">{report.mental.affirmation}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 未購入（チラ見せ）表示
  return (
    <div id="premium-card" className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl space-y-5 border border-amber-500/40 relative overflow-hidden">
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
          <Lock className="w-3.5 h-3.5 text-amber-300" />
          <span>プレミアム限定レポート</span>
        </div>
        <span className="text-[11px] font-bold text-amber-300/80 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/20">
          超増量版 ¥300
        </span>
      </div>

      <div className="space-y-1">
        <h3 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-400">
          {hostNickname} さんの深層心理トリセツ（完全版）
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed">
          周囲の統計から浮き彫りになったあなたの深層心理を徹底解剖。仕事適性、恋愛、取扱説明書5箇条、個別相性カルテまで全て網羅した大容量鑑定書です。
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
            <span className="blur-xs select-none opacity-60">...（向いている職種5選・会議立ち回り術など完全開放）</span>
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-pink-300">
            <Heart className="w-3.5 h-3.5" />
            <span>恋愛編: {report.romance.title}</span>
          </div>
          <p className="text-slate-300">
            無意識の地雷: {report.romance.hiddenTrap.slice(0, 18)}
            <span className="blur-xs select-none opacity-60">...（絶対条件3箇条・最短仲直り手順など完全開放）</span>
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-400/20 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-amber-300">
            <BookOpen className="w-3.5 h-3.5" />
            <span>公式取扱説明書（周囲・パートナー用 5箇条）</span>
          </div>
          <p className="text-slate-300">
            第1条: {report.manual.rules[0]?.title.slice(0, 18)}
            <span className="blur-xs select-none opacity-60">...（第2条〜第5条を完全開放）</span>
          </p>
        </div>

        <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-purple-300">
            <ShieldAlert className="w-3.5 h-3.5" />
            <span>メンタル処方箋: {report.mental.title}</span>
          </div>
          <p className="text-slate-300">
            限界シグナル: {report.mental.dangerSign.slice(0, 18)}
            <span className="blur-xs select-none opacity-60">...（30分急速回復法・アファメーション開放）</span>
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
            <span>300円で完全版レポートをアンロック</span>
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
