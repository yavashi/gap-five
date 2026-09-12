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

  let totalDiff = 0;
  traits.forEach((t) => {
    totalDiff += Math.abs((hostScores[t] ?? 4.0) - (peerScores[t] ?? 4.0));
  });

  const avgDiff = totalDiff / 5;
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
      strongPoint: '普段は自由に行動しつつ、いざという時に最も頼りになる安心感があります。',
    };
  }

  if (score >= 80) {
    return {
      score,
      typeName: '知的好奇心を刺激し合うライバルタイプ',
      description: 'お互いに違う視点やアイデアを持ち寄り、切磋琢磨して成長できる刺激的な関係性です。',
      strongPoint: '会話を重ねるごとに新しい発見や気づきが生まれ、モチベーションが高まります。',
    };
  }

  return {
    score,
    typeName: '未知の可能性を秘めたケミストリータイプ',
    description: '自分にはない魅力や思考パターンを持つ相手だからこそ、深く知るほどに意外なシナジーが生まれます。',
    strongPoint: '違う世界を見せてくれる相手として、視野を大きく広げてくれる存在です。',
  };
}

// -------------------------------------------------------------
// 詳細版・個別ケミストリー相性カルテ（プレミアムレポート連携）
// -------------------------------------------------------------
export interface PairCompatibility {
  peerNickname: string;
  score: number;
  title: string;
  tagline: string;
  peerImpression: string;
  goodChemistry: string;
  blindSpot: string;
  advice: string;
  magicTopic: string;
}

export function calculatePairCompatibility(
  selfScores: TraitScores,
  peerScores: TraitScores,
  hostNickname: string,
  peerNickname: string
): PairCompatibility {
  const traits: (keyof TraitScores)[] = ['E', 'A', 'C', 'S', 'O'];
  
  let totalDiff = 0;
  traits.forEach((t) => {
    const s = selfScores[t] ?? 4.0;
    const p = peerScores[t] ?? 4.0;
    totalDiff += Math.abs(s - p);
  });

  const baseScore = Math.max(72, Math.min(98, Math.round(98 - totalDiff * 2.2)));

  const pE = peerScores.E ?? 4.0;
  const pA = peerScores.A ?? 4.0;
  const pC = peerScores.C ?? 4.0;
  const pS = peerScores.S ?? 4.0;
  const pO = peerScores.O ?? 4.0;

  const sE = selfScores.E ?? 4.0;
  const sO = selfScores.O ?? 4.0;

  let title = 'お互いの盲点を補い合う無敵バディ';
  let tagline = '違う視点を持っているからこそ、2人が揃うと死角がなくなる好相性';
  let peerImpression = `${peerNickname} さんは、あなたの柔軟な状況判断力と、飾らない人間味に強い安心感を感じています。`;
  let goodChemistry = '一方が見落としがちなリスクやチャンスを、もう一方が自然とフォローできる補完関係が成り立っています。';
  let blindSpot = 'お互いに「相手はどう思っているか」を気にしすぎて、本音の相談を遠慮してしまうことがあります。';
  let advice = '結論を急がず、「実は最近こんなこと考えてて…」と未完成のアイデアや悩みを雑談として共有すると、一気に距離が縮まります。';
  let magicTopic = '最近ハマっていること、お互いの人生のターニングポイントになった出来事';

  if (totalDiff <= 4.0) {
    title = '波長シンクロ率最高峰の以心伝心ペア';
    tagline = '言葉にしなくても空気感で通じ合える、奇跡的な理解者';
    peerImpression = `${peerNickname} さんは、あなたの内面や本質を極めて高い解像度で理解しています。「この人には嘘がつけない」と感じさせるほどのシンパシーを抱いています。`;
    goodChemistry = '価値観のチューニングが完璧に合っているため、一緒にいるだけで精神的な疲労が回復する稀有な関係性です。';
    blindSpot = '波長が合いすぎるあまり、2人の世界に閉じこもりがちになったり、相手のネガティブな感情にも過剰に共鳴してしまう点。';
    advice = 'あえて2人で新しい環境や未経験のアクティビティに飛び込んでみると、共通の思い出が一生モノの絆になります。';
    magicTopic = '深夜の深い人生観トーク、お互いが「本当に大切にしている価値観」';
  } else if (pE >= 5.0 && sE < 4.0) {
    title = '静寂と活気が心地よく調和する好対照コンビ';
    tagline = '一歩引いて全体を見るあなたと、場を前に進める相手のベストバランス';
    peerImpression = `${peerNickname} さんから見たあなたは、「周囲が気づかない重要なポイントに気づいている頼もしい存在」です。`;
    goodChemistry = '相手が推進力を生み出し、あなたが道筋を整えるという、ビジネスでもプライベートでも最強のタッグを組めます。';
    blindSpot = '相手のテンポが速すぎるとあなたがエネルギーを消耗し、相手はあなたの静けさを「怒ってるのかな？」と誤解するリスク。';
    advice = '疲れた時は無理に合わせず「ちょっと充電中！」とライトに伝えることで、相手も安心してペースを落としてくれます。';
    magicTopic = 'お互いの得意分野のレクチャー、美味しいお店やリラックスできる空間の開拓';
  } else if (pO >= 5.0) {
    title = '知的好奇心とインスピレーションを刺激し合うクリエイティブペア';
    tagline = '会話するたびに新しい発見とアイデアが湧き出る刺激的な関係';
    peerImpression = `${peerNickname} さんは、あなたのユニークな着眼点や感性に強い興味とリスペクトを持っています。`;
    goodChemistry = '常識にとらわれない発想を面白がれる2人なので、何かを一緒に企画したり創作すると爆発的なシナジーが生まれます。';
    blindSpot = 'アイデアや理想が盛り上がりすぎて、具体的な実行計画や日常のルーティンがおざなりになりやすい点。';
    advice = '「いつかやりたいね」で終わらせず、「まず今週末にこれだけ試してみよう」と小さな一歩を具体化すると現実が動きます。';
    magicTopic = '未来の妄想プラン、お互いが感動した本・映画・クリエイティブ';
  }

  return {
    peerNickname,
    score: baseScore,
    title,
    tagline,
    peerImpression,
    goodChemistry,
    blindSpot,
    advice,
    magicTopic,
  };
}
