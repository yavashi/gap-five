import React from 'react';
import { TraitScores } from '@/lib/core/types';
import { AFFILIATE_CONFIG, AffiliateItem } from '@/config/affiliate';
import { Sparkles, ExternalLink, Compass, Briefcase, HeartHandshake, BookOpen } from 'lucide-react';

interface RecommendationCardProps {
  selfScores?: TraitScores;
  peerScores?: TraitScores;
  variant?: 'result' | 'thanks';
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  selfScores,
  peerScores,
  variant = 'result',
}) => {
  const o = (peerScores?.O ?? selfScores?.O) ?? 4.0;
  const e = (peerScores?.E ?? selfScores?.E) ?? 4.0;

  let item: AffiliateItem = AFFILIATE_CONFIG.career;
  let Icon = Briefcase;

  if (variant === 'thanks') {
    // 回答してくれた人向けのレコメンド（自己理解本やスキルアップ）
    item = AFFILIATE_CONFIG.book;
    Icon = BookOpen;
  } else {
    // 診断結果画面（特性連動）
    if (o >= 5.5) {
      item = AFFILIATE_CONFIG.skill;
      Icon = Compass;
    } else if (e >= 5.0) {
      item = AFFILIATE_CONFIG.matching;
      Icon = HeartHandshake;
    } else {
      item = AFFILIATE_CONFIG.career;
      Icon = Briefcase;
    }
  }

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-3">
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
          <Icon className="w-3.5 h-3.5" />
          <span>{item.badge}</span>
        </div>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          PR / おすすめ
        </span>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
          {item.title}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          {item.description}
        </p>
      </div>

      <div className="pt-1">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-flex items-center justify-center gap-1.5 w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all hover:scale-[1.01] cursor-pointer"
        >
          <span>{item.ctaText}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
