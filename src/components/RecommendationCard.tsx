import React from 'react';
import { TraitScores } from '@/lib/core/types';
import { Sparkles, ExternalLink, Compass, Briefcase, HeartHandshake } from 'lucide-react';

interface RecommendationCardProps {
  selfScores: TraitScores;
  peerScores: TraitScores;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  selfScores,
  peerScores,
}) => {
  const o = peerScores.O ?? selfScores.O ?? 4.0;
  const c = peerScores.C ?? selfScores.C ?? 4.0;
  const e = peerScores.E ?? selfScores.E ?? 4.0;

  let rec = {
    badge: 'キャリア・適職',
    icon: Briefcase,
    title: 'あなたの強みが活きる「市場価値」を診断してみませんか？',
    description: 'GAP-FIVEで判明したあなたの隠れた才能や対人適性は、ビジネスや転職市場でも大きな武器になります。無料の適職診断で、あなたにフィットする環境をチェック。',
    ctaText: '無料で強み・年収診断を試す',
    url: 'https://example.com/career-check', // アフィリエイトリンク差し替え可能
  };

  if (o >= 5.5) {
    rec = {
      badge: 'スキル・副業',
      icon: Compass,
      title: '知的好奇心と独創性を活かす「新しい働き方」',
      description: '高い開放性（独創性・アイデア力）を持つあなたには、本業だけでなく個人のプロジェクトや副業でクリエイティビティを発揮する選択肢が適しています。',
      ctaText: '未経験から学べるスキルアップ講座を見る',
      url: 'https://example.com/skill-up',
    };
  } else if (e >= 5.0) {
    rec = {
      badge: '人脈・出会い',
      icon: HeartHandshake,
      title: '相性重視で気の合う仲間・パートナーを見つける',
      description: '社交性と人当たりの良さを持つあなただからこそ、価値観や性格の相性がぴったり合うコミュニティやパートナーとの出会いで日常がさらに充実します。',
      ctaText: '性格診断連動マッチングをチェック',
      url: 'https://example.com/matching',
    };
  }

  const Icon = rec.icon;

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 shadow-sm border border-slate-100 space-y-3">
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
          <Icon className="w-3.5 h-3.5" />
          <span>{rec.badge}</span>
        </div>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          PR / おすすめ
        </span>
      </div>

      <div className="space-y-1">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
          {rec.title}
        </h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          {rec.description}
        </p>
      </div>

      <div className="pt-1">
        <a
          href={rec.url}
          target="_blank"
          rel="noopener noreferrer nofollow"
          className="inline-flex items-center justify-center gap-1.5 w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm transition-all hover:scale-[1.01]"
        >
          <span>{rec.ctaText}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
