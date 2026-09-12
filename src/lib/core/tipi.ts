import { TraitKey, TraitScores, TIPIItem } from './types';

// TIPI-J 10問の定義（正問・逆転問、自己評価用テキスト、他者評価用テンプレート）
export const TIPI_ITEMS: TIPIItem[] = [
  {
    id: 1,
    trait: 'E',
    isReverse: false,
    selfText: '活発で、外向的だと思う',
    peerTextTemplate: (name: string) => `${name}さんは、活発で外向的だと思う`,
  },
  {
    id: 2,
    trait: 'A',
    isReverse: true,
    selfText: '他人に不満を持ちやすく、批判的だと思う',
    peerTextTemplate: (name: string) => `${name}さんは、他人に批判的なところがあると思う`,
  },
  {
    id: 3,
    trait: 'C',
    isReverse: false,
    selfText: 'しっかりしていて、自分に厳しいと思う',
    peerTextTemplate: (name: string) => `${name}さんは、几帳面でしっかりしていると思う`,
  },
  {
    id: 4,
    trait: 'S',
    isReverse: true,
    selfText: '心配性で、動揺しやすいと思う',
    peerTextTemplate: (name: string) => `${name}さんは、心配性で動揺しやすいと思う`,
  },
  {
    id: 5,
    trait: 'O',
    isReverse: false,
    selfText: '新しい体験やアイデアを好むと思う',
    peerTextTemplate: (name: string) => `${name}さんは、新しい発想や珍しい体験を好むと思う`,
  },
  {
    id: 6,
    trait: 'E',
    isReverse: true,
    selfText: '控えめで、物静かだと思う',
    peerTextTemplate: (name: string) => `${name}さんは、物静かで控えめだと思う`,
  },
  {
    id: 7,
    trait: 'A',
    isReverse: false,
    selfText: '他人に思いやりがあり、親切だと思う',
    peerTextTemplate: (name: string) => `${name}さんは、思いやりがあり親切だと思う`,
  },
  {
    id: 8,
    trait: 'C',
    isReverse: true,
    selfText: 'だらしなく、物事を投げ出しやすいと思う',
    peerTextTemplate: (name: string) => `${name}さんは、大雑把でマイペースなところがあると思う`,
  },
  {
    id: 9,
    trait: 'S',
    isReverse: false,
    selfText: '冷静で、気分が安定していると思う',
    peerTextTemplate: (name: string) => `${name}さんは、いつも冷静で落ち着いていると思う`,
  },
  {
    id: 10,
    trait: 'O',
    isReverse: true,
    selfText: '伝統や型通りのやり方を好むと思う',
    peerTextTemplate: (name: string) => `${name}さんは、常識や既存の型を大切にすると思う`,
  },
];

/**
 * 10問の回答配列（1〜7の整数）から TIPI-J 5因子のスコアを算出
 * @param answers 設問1〜10に対する回答配列（インデックス0〜9、値は1〜7）
 * @returns 5因子のスコア（1.0〜7.0）
 */
export function calculateScores(answers: number[]): TraitScores {
  if (!answers || answers.length !== 10) {
    throw new Error('TIPI-Jの算出には10個の回答が必要です。');
  }

  // 回答値が1〜7の範囲内にあるか検証
  answers.forEach((val, idx) => {
    if (typeof val !== 'number' || val < 1 || val > 7) {
      throw new Error(`設問${idx + 1}の回答は1〜7の範囲である必要があります（受取値: ${val}）。`);
    }
  });

  const round = (num: number) => Math.round(num * 100) / 100;

  return {
    E: round((answers[0] + (8 - answers[5])) / 2), // Q1正, Q6逆
    A: round(((8 - answers[1]) + answers[6]) / 2), // Q2逆, Q7正
    C: round((answers[2] + (8 - answers[7])) / 2), // Q3正, Q8逆
    S: round(((8 - answers[3]) + answers[8]) / 2), // Q4逆, Q9正
    O: round((answers[4] + (8 - answers[9])) / 2), // Q5正, Q10逆
  };
}

/**
 * 複数の他者回答スコアから平均値を算出
 * @param peers ゲストによるスコア配列
 * @returns 平均スコア（データが0件の場合はnull）
 */
export function calculateAveragePeerScores(peers: TraitScores[]): TraitScores | null {
  if (!peers || peers.length === 0) return null;

  const traits: TraitKey[] = ['E', 'A', 'C', 'S', 'O'];
  const avg = {} as TraitScores;

  traits.forEach((trait) => {
    const sum = peers.reduce((acc, cur) => acc + (cur[trait] || 0), 0);
    avg[trait] = Math.round((sum / peers.length) * 100) / 100;
  });

  return avg;
}
