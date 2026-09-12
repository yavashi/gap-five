import { TraitKey, TraitScores } from './types';

export interface CompatibilityResult {
  score: number; // 72 ~ 99%
  typeName: string;
  description: string;
  strongPoint: string;
}

export function calculateCompatibility(
  hostScores: TraitScores,
  peerScores: TraitScores
): CompatibilityResult {
  const traits: TraitKey[] = ['E', 'A', 'C', 'S', 'O'];

  // 各軸の絶対乖離合計
  let totalDiff = 0;
  traits.forEach((t) => {
    totalDiff += Math.abs((hostScores[t] ?? 4.0) - (peerScores[t] ?? 4.0));
  });

  // 平均差分（0〜6の範囲）
  const avgDiff = totalDiff / 5;

  // 基本相性計算: 最大99%、最小72%でポジティブに調整
  const rawScore = Math.round(99 - avgDiff * 8.5);
  const score = Math.max(72, Math.min(99, rawScore));

  if (score >= 95) {
    return {
      score,
      typeName: '奇跡のソウルメイト・完全共鳴タイプ',
      description: '初対面から波長が合い、言葉にしなくてもお互いの気持ちや考えを察し合える奇跡的な相性です。',
      strongPoint: '一緒にいるだけで不思議と心が落ち着き、お互いの長所が自然と引き出されます。',
    };
  }

  if (score >= 90) {
    return {
      score,
      typeName: '凸凹パズルの最強名コンビ',
      description: 'お互いの得意と苦手が絶妙に噛み合う関係。2人で力を合わせればどんな難題も突破できるベストパートナーです。',
      strongPoint: '一方が直感で動き、もう一方が冷静にサポートするような阿吽の呼吸が生まれます。',
    };
  }

  if (score >= 85) {
    return {
      score,
      typeName: '心地よい距離感の戦友タイプ',
      description: 'お互いの個性やテリトリーを自然にリスペクトできる関係。過度な気遣いがいらず、長く安定して付き合えます。',
      strongPoint: '普段は自由に行動しつつ、いざという時に最も頼りになる深い信頼関係を築けます。',
    };
  }

  if (score >= 80) {
    return {
      score,
      typeName: 'お互いを刺激する化学反応タイプ',
      description: '着眼点やテンポが異なるからこそ、会話のたびに新しい発見と笑いが絶えない刺激的な間柄です。',
      strongPoint: '自分にはない発想や視点をくれる相手として、お互いの世界をどんどん広げてくれます。',
    };
  }

  return {
    score,
    typeName: '異文化交流のミステリアス・ペア',
    description: 'お互いに「コイツ何考えてるんだろう？」と興味が尽きない、奥深い魅力と面白さがある関係性です。',
    strongPoint: '知れば知るほど意外な一面が見つかり、飽きることなく楽しめる魅力的な間柄です。',
  };
}
