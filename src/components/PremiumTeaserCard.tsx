'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { PremiumReport } from '@/lib/core/premium';
import {
  Lock,
  Unlock,
  Sparkles,
  Briefcase,
  Heart,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
  Loader2,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Check,
  Zap,
} from 'lucide-react';

interface PremiumTeaserCardProps {
  sessionId: string;
  hostNickname: string;
  report: PremiumReport;
}

type CategoryKey = 'career' | 'romance' | 'manual' | 'mental';

export const PremiumTeaserCard: React.FC<PremiumTeaserCardProps> = ({
  sessionId,
  hostNickname,
  report,
}) => {
  const searchParams = useSearchParams();
  const isUnlockedFromUrl = searchParams?.get('premium') === 'unlocked';

  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('career');

  // 折りたたみ（アコーディオン）状態管理
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    careerRoles: true,
    careerTactics: true,
    romanceConditions: true,
    romanceConflict: true,
    manualAll: true,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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
        body: JSON.stringify({ sessionId, hostNickname, itemType: 'report' }),
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

  const categories = [
    { key: 'career' as CategoryKey, label: '仕事・適職', icon: Briefcase, color: 'blue' },
    { key: 'romance' as CategoryKey, label: '恋愛・絆', icon: Heart, color: 'pink' },
    { key: 'manual' as CategoryKey, label: '公式取説5箇条', icon: BookOpen, color: 'amber' },
    { key: 'mental' as CategoryKey, label: 'メンタル処方箋', icon: ShieldAlert, color: 'purple' },
  ];

  // ==========================================
  // アンロック済み表示（タブ ＆ 折りたたみアコーディオン）
  // ==========================================
  if (isUnlocked) {
    return (
      <div
        id="premium-card"
        className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-8 text-white shadow-xl space-y-5 border border-amber-500/30 relative overflow-hidden animate-in fade-in duration-500"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* ヘッダー */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              PREMIUM UNLOCKED
            </span>
            <span className="text-xs text-slate-300 font-bold hidden sm:inline">
              深層心理トリセツ完全版
            </span>
          </div>
          <CheckCircle2 className="w-5 h-5 text-amber-400" />
        </div>

        {/* スマホ対応：4大カテゴリ切り替えタブ */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                type="button"
                onClick={() => setActiveCategory(cat.key)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 shadow-md shadow-amber-400/20 scale-[1.02]'
                    : 'bg-white/10 text-slate-300 hover:bg-white/15'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* タブコンテンツ */}
        <div className="animate-in fade-in duration-300">
          {/* 1. 仕事・キャリア */}
          {activeCategory === 'career' && (
            <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-blue-300 font-bold text-sm sm:text-base border-b border-white/10 pb-2">
                <Briefcase className="w-4 h-4 text-blue-400" />
                <span>【仕事・キャリア完全版】{report.career.title}</span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-200">
                <div>
                  <strong className="text-amber-300 font-bold block mb-1 text-xs">天賦の強み:</strong>
                  <p className="text-slate-300 leading-relaxed text-xs">{report.career.superPower}</p>
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

                {/* 向いている職種・役割 5選（アコーディオン） */}
                <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection('careerRoles')}
                    className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-white/5"
                  >
                    <span className="text-blue-300 font-bold text-xs flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" />
                      向いている職種・ポジション具体例（5選）
                    </span>
                    {openSections.careerRoles ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {openSections.careerRoles && (
                    <div className="p-3.5 pt-0 flex flex-wrap gap-2 animate-in fade-in duration-200">
                      {report.career.bestRoles.map((role, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-200 text-xs font-medium border border-blue-400/30"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 最強の立ち回り術（アコーディオン） */}
                <div className="rounded-xl bg-indigo-500/10 border border-indigo-400/20 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection('careerTactics')}
                    className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-indigo-500/15"
                  >
                    <span className="font-bold text-indigo-200 text-xs flex items-center gap-1.5">
                      💼 会議・交渉での最強立ち回り術
                    </span>
                    {openSections.careerTactics ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {openSections.careerTactics && (
                    <div className="p-3.5 pt-0 animate-in fade-in duration-200">
                      <p className="leading-relaxed text-slate-300 text-xs">{report.career.tactics}</p>
                    </div>
                  )}
                </div>

                {/* 就活・面接対策例文（アコーディオン） */}
                <div className="rounded-xl bg-blue-500/10 border border-blue-400/20 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection('careerInterview')}
                    className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-blue-500/15"
                  >
                    <span className="font-bold text-blue-200 text-xs flex items-center gap-1.5">
                      🎓 面接・自己PRで使える回答例文（「周囲からどんな人と言われる？」対策）
                    </span>
                    {openSections.careerInterview ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {openSections.careerInterview && (
                    <div className="p-3.5 pt-0 animate-in fade-in duration-200">
                      <p className="leading-relaxed text-blue-100 text-xs bg-black/20 p-3 rounded-xl border border-blue-400/20 italic">
                        {report.career.interviewTemplate}
                      </p>
                    </div>
                  )}
                </div>

                {/* 短所のポジティブ言い換え（アコーディオン） */}
                <div className="rounded-xl bg-amber-500/10 border border-amber-400/20 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection('careerReframe')}
                    className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-amber-500/15"
                  >
                    <span className="font-bold text-amber-200 text-xs flex items-center gap-1.5">
                      🔄 短所のポジティブ言い換え・リカバリー術
                    </span>
                    {openSections.careerReframe ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {openSections.careerReframe && (
                    <div className="p-3.5 pt-0 animate-in fade-in duration-200">
                      <p className="leading-relaxed text-amber-100 text-xs bg-black/20 p-3 rounded-xl border border-amber-400/20">
                        {report.career.weaknessReframe}
                      </p>
                    </div>
                  )}
                </div>

                {/* 1on1・マネジメント対話ヒント（アコーディオン） */}
                <div className="rounded-xl bg-emerald-500/10 border border-emerald-400/20 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection('career1on1')}
                    className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-emerald-500/15"
                  >
                    <span className="font-bold text-emerald-200 text-xs flex items-center gap-1.5">
                      💬 職場・1on1で本音を引き出す対話のヒント
                    </span>
                    {openSections.career1on1 ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {openSections.career1on1 && (
                    <div className="p-3.5 pt-0 animate-in fade-in duration-200">
                      <p className="leading-relaxed text-emerald-100 text-xs bg-black/20 p-3 rounded-xl border border-emerald-400/20">
                        {report.career.workplaceCommunicationTip}
                      </p>
                    </div>
                  )}
                </div>

                {/* 相棒タイプ＆成長アドバイス */}
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-2">
                  <p><strong className="text-amber-300">🤝 相棒タイプ:</strong> {report.career.bestPartnerType}</p>
                  <p><strong className="text-blue-300">💡 成長アドバイス:</strong> {report.career.growthAdvice}</p>
                </div>
              </div>
            </div>
          )}

          {/* 2. 恋愛・パートナーシップ */}
          {activeCategory === 'romance' && (
            <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-pink-300 font-bold text-sm sm:text-base border-b border-white/10 pb-2">
                <Heart className="w-4 h-4 text-pink-400" />
                <span>【恋愛・パートナーシップ完全版】{report.romance.title}</span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-200">
                <div>
                  <strong className="text-amber-300 font-bold block mb-1 text-xs">愛のスタイル:</strong>
                  <p className="text-slate-300 leading-relaxed text-xs">{report.romance.loveStyle}</p>
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

                {/* 求めるべき3つの絶対条件（アコーディオン） */}
                <div className="rounded-xl bg-white/5 border border-white/10 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection('romanceConditions')}
                    className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-white/5"
                  >
                    <span className="text-pink-300 font-bold text-xs flex items-center gap-1.5">
                      ✨ 相手に求めるべき「3つの絶対条件」
                    </span>
                    {openSections.romanceConditions ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {openSections.romanceConditions && (
                    <div className="p-3.5 pt-0 space-y-1 text-xs text-slate-300 animate-in fade-in duration-200">
                      {report.romance.idealConditions.map((cond, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                          <span>{cond}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 喧嘩・すれ違い時の最短仲直りアプローチ（アコーディオン） */}
                <div className="rounded-xl bg-pink-500/10 border border-pink-400/20 overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleSection('romanceConflict')}
                    className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-pink-500/15"
                  >
                    <span className="text-pink-200 font-bold text-xs flex items-center gap-1.5">
                      🕊️ 喧嘩・すれ違い時の最短仲直りアプローチ
                    </span>
                    {openSections.romanceConflict ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </button>
                  {openSections.romanceConflict && (
                    <div className="p-3.5 pt-0 animate-in fade-in duration-200">
                      <p className="text-slate-300 leading-relaxed text-xs">{report.romance.conflictResolution}</p>
                    </div>
                  )}
                </div>

                <div className="bg-purple-500/10 p-3.5 rounded-xl border border-purple-400/20 text-xs">
                  🔒 <strong>裏の甘えたい願望:</strong> <span className="text-slate-300">{report.romance.secretDesire}</span>
                </div>
              </div>
            </div>
          )}

          {/* 3. 公式取扱説明書（5箇条） */}
          {activeCategory === 'manual' && (
            <div className="p-5 sm:p-6 rounded-2xl bg-amber-500/10 border border-amber-400/30 space-y-4">
              <div className="flex items-center justify-between border-b border-amber-400/20 pb-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-sm sm:text-base">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>{report.manual.title}</span>
                </div>
                <button
                  type="button"
                  onClick={() => toggleSection('manualAll')}
                  className="text-[11px] font-bold text-amber-300 hover:underline cursor-pointer"
                >
                  {openSections.manualAll ? 'すべて折りたたむ' : 'すべて開く'}
                </button>
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
                    {openSections.manualAll && (
                      <p className="text-slate-300 leading-relaxed">{rule.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. メンタル＆エナジー処方箋 */}
          {activeCategory === 'mental' && (
            <div className="p-5 sm:p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-purple-300 font-bold text-sm sm:text-base border-b border-white/10 pb-2">
                <ShieldAlert className="w-4 h-4 text-purple-400" />
                <span>【メンタル＆エナジー処方箋】{report.mental.title}</span>
              </div>

              <div className="space-y-3 text-xs sm:text-sm text-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-400/20 space-y-1">
                    <strong className="text-rose-300 font-bold text-xs block">⚡ ストレスの引き金</strong>
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
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // 未購入（チラ見せ）表示（コンパクト＆タブプレビュー）
  // ==========================================
  return (
    <div
      id="premium-card"
      className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-8 text-white shadow-xl space-y-4 border border-amber-500/40 relative overflow-hidden"
    >
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
          周囲の統計から導かれたあなたの才能・キャリア・恋愛・取扱説明書5箇条を網羅した大容量鑑定書です。
        </p>
      </div>

      {/* スマホ対応：チラ見せカテゴリタブ */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeCategory === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() => setActiveCategory(cat.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                isActive
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'bg-white/10 text-slate-300 hover:bg-white/15'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-slate-950' : 'text-slate-400'}`} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* 選択されたタブのチラ見せカード（1枚のみ表示でスマホ画面をすっきり維持） */}
      <div className="text-xs">
        {activeCategory === 'career' && (
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-blue-300">
              <Briefcase className="w-3.5 h-3.5" />
              <span>仕事編: {report.career.title}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              無双できる職場: {report.career.idealEnvironment.slice(0, 24)}
              <span className="blur-xs select-none opacity-60">...（向いている職種5選・会議立ち回り術など完全開放）</span>
            </p>
          </div>
        )}

        {activeCategory === 'romance' && (
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-pink-300">
              <Heart className="w-3.5 h-3.5" />
              <span>恋愛編: {report.romance.title}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              無意識の地雷: {report.romance.hiddenTrap.slice(0, 20)}
              <span className="blur-xs select-none opacity-60">...（絶対条件3箇条・最短仲直り手順など完全開放）</span>
            </p>
          </div>
        )}

        {activeCategory === 'manual' && (
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-400/20 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-amber-300">
              <BookOpen className="w-3.5 h-3.5" />
              <span>公式取扱説明書（周囲・パートナー用 5箇条）</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              第1条: {report.manual.rules[0]?.title}
              <span className="blur-xs select-none opacity-60">...（第2条〜第5条を完全開放）</span>
            </p>
          </div>
        )}

        {activeCategory === 'mental' && (
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-purple-300">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>メンタル処方箋: {report.mental.title}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              限界シグナル: {report.mental.dangerSign.slice(0, 20)}
              <span className="blur-xs select-none opacity-60">...（30分急速回復法・アファメーション開放）</span>
            </p>
          </div>
        )}
      </div>

      {/* 対応決済手段の視覚的バッジ */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-3 space-y-2">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-amber-300 font-bold flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            1タップ決済・複数のお支払いに対応
          </span>
          <span className="text-slate-400 text-[10px]">面倒なカード入力不要</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-bold">
          <div className="py-1 px-1 rounded-lg bg-black/40 border border-white/10 text-white flex items-center justify-center gap-1">
            <span>🍎 Apple Pay</span>
          </div>
          <div className="py-1 px-1 rounded-lg bg-black/40 border border-white/10 text-white flex items-center justify-center gap-1">
            <span>📱 G Pay</span>
          </div>
          <div className="py-1 px-1 rounded-lg bg-rose-500/20 border border-rose-400/30 text-rose-200 flex items-center justify-center gap-1">
            <span>🔴 PayPay</span>
          </div>
          <div className="py-1 px-1 rounded-lg bg-blue-500/20 border border-blue-400/30 text-blue-200 flex items-center justify-center gap-1">
            <span>💳 各種カード</span>
          </div>
        </div>
      </div>

      {/* 購入ボタン */}
      <button
        type="button"
        onClick={handleCheckout}
        disabled={isLoading}
        className="w-full py-3.5 sm:py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-slate-950 font-black text-sm sm:text-base shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer disabled:opacity-75"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>決済画面を準備中...</span>
          </>
        ) : (
          <>
            <Unlock className="w-4 h-4" />
            <span>300円で完全版レポートをアンロック</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </>
        )}
      </button>

      <div className="space-y-1.5 text-center">
        <p className="text-xs font-bold text-amber-300">
          ※追加請求なし・1回限りの完全買い切りです（月額課金・自動更新等は一切ありません）
        </p>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Face ID / Touch ID で認証するだけですぐ読めます。ご購入後はこのページで永久にご覧いただけます。
        </p>
        <p className="text-[10px] text-slate-500">
          ※LINEアプリ内等でApple Payが出ない場合は、画面右下メニュー「Safari/Chromeで開く」を選ぶとワンタップ決済が可能です。
        </p>
      </div>
    </div>
  );
};
