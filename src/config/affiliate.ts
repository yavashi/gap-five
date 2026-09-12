export interface AffiliateItem {
  id: string;
  category: 'career' | 'skill' | 'matching' | 'general';
  badge: string;
  title: string;
  description: string;
  ctaText: string;
  url: string;
}

export const AFFILIATE_CONFIG: Record<string, AffiliateItem> = {
  career: {
    id: 'career',
    category: 'career',
    badge: 'キャリア・適職',
    title: 'あなたの強みが活きる「市場価値」を診断してみませんか？',
    description: 'GAP-FIVEで判明したあなたの隠れた才能や対人適性は、ビジネスや転職市場でも大きな武器になります。無料の適職診断で、あなたにフィットする環境をチェック。',
    ctaText: '無料で強み・適職診断を試す',
    url: process.env.NEXT_PUBLIC_AFFILIATE_CAREER_URL || 'https://example.com/career-check',
  },
  skill: {
    id: 'skill',
    category: 'skill',
    badge: 'スキル・副業',
    title: '知的好奇心と独創性を活かす「新しい働き方」',
    description: '高い開放性（独創性・アイデア力）を持つあなたには、本業だけでなく個人のプロジェクトや副業でクリエイティビティを発揮する選択肢が適しています。',
    ctaText: '未経験から学べるスキルアップ講座を見る',
    url: process.env.NEXT_PUBLIC_AFFILIATE_SKILL_URL || 'https://example.com/skill-up',
  },
  matching: {
    id: 'matching',
    category: 'matching',
    badge: '人脈・出会い',
    title: '相性重視で気の合う仲間・パートナーを見つける',
    description: '社交性と人当たりの良さを持つあなただからこそ、価値観や性格の相性がぴったり合うコミュニティやパートナーとの出会いで日常がさらに充実します。',
    ctaText: '性格診断連動マッチングをチェック',
    url: process.env.NEXT_PUBLIC_AFFILIATE_MATCHING_URL || 'https://example.com/matching',
  },
  book: {
    id: 'book',
    category: 'general',
    badge: '自己分析・書籍',
    title: '人間関係の悩みがゼロになる「他者理解の技術」',
    description: '自分の性格と周囲からの見え方のギャップを武器に変えるための心理学メソッド。通勤時間やスキマ時間に音声で学べるオーディオブックもおすすめ。',
    ctaText: '無料体験で自己分析本を聴く',
    url: process.env.NEXT_PUBLIC_AFFILIATE_BOOK_URL || 'https://example.com/audiobook',
  },
};
