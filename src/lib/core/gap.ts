import { TraitKey, TraitScores, GapPart, FinalResult } from './types';

// 自認二つ名辞書（各軸の high / low）
export const SELF_LABELS: Record<string, string> = {
  E_high: '情熱のインフルエンサー',
  E_low: '静寂を愛する孤高の観察者',
  A_high: '慈悲深きガーディアン',
  A_low: '冷徹なるリアリスト',
  C_high: '緻密なグランドデザイナー',
  C_low: '型破りなインプロバイザー',
  S_high: '泰然自若のアイアンハート',
  S_low: '繊細なるクリスタルセンサー',
  O_high: '未踏を拓くヴィジョナリー',
  O_low: '質実剛健のリアリズムアンカー',
  NEUTRAL: '変幻自在のバランサー',
};

// ギャップパーツ辞書（over: 自己 > 他者, under: 自己 < 他者）
export const GAP_PARTS: Record<string, GapPart> = {
  E_over: {
    trait: 'E',
    type: 'over',
    name: '脳内フェス野郎',
    desc: '心の中では全員と乾杯しているつもりだが、出力ポートが狭すぎて周囲にはクールに見えている',
  },
  E_under: {
    trait: 'E',
    type: 'under',
    name: 'ステルス社交モンスター',
    desc: '内面ではHPを激しく消耗しているが、社会性フィルターが優秀すぎて周囲からはコミュ力お化けに見えている',
  },
  A_over: {
    trait: 'A',
    type: 'over',
    name: '切れ味抜群の善意のメス',
    desc: '相手を想っての正論だが、オブラートを省くため周囲からは切れ者として恐れられている',
  },
  A_under: {
    trait: 'A',
    type: 'under',
    name: 'ツンデレ無自覚マザーテレサ',
    desc: '「損得で動いている」と本人は嘯くが、行動の端々に面倒見の良さがダダ漏れている',
  },
  C_over: {
    trait: 'C',
    type: 'over',
    name: '白紙の設計図マスター',
    desc: '頭の中では完璧な計画があるが、アドリブで動きすぎて周囲からは自由人に見えている',
  },
  C_under: {
    trait: 'C',
    type: 'under',
    name: '崖っぷちの神業アクロバット',
    desc: '本人の体感はいつも泥縄だが、土壇場の帳尻合わせが完璧すぎて周囲からは超有能に見えている',
  },
  S_over: {
    trait: 'S',
    type: 'over',
    name: 'ガラスの防弾チョッキ',
    desc: '「全然平気」と強がっているが、周囲は微小な動揺を察知して気を遣っている',
  },
  S_under: {
    trait: 'S',
    type: 'under',
    name: '水面の白鳥（脚は激突中）',
    desc: '水面下では必死に焦っているのに、表情が動かないため周囲からは何があっても動じない大物に見えている',
  },
  O_over: {
    trait: 'O',
    type: 'over',
    name: '秘密基地の空想科学者',
    desc: '頭の中は奇想天外なアイデアで溢れているが、普段は常識人の仮面を被っている',
  },
  O_under: {
    trait: 'O',
    type: 'under',
    name: '天然記念物級イノベーター',
    desc: '本人は至って普通だと思っているが、発想と着眼点が独特すぎて周囲からは異能の変人枠で見られている',
  },
};

/**
 * 自己評価スコアから自認ラベルを判定
 * 4.0（中央値）からの乖離が最も大きい軸を主たる特徴として採用
 */
export function getSelfLabel(self: TraitScores): string {
  const traitOrder: TraitKey[] = ['E', 'A', 'C', 'S', 'O'];

  const sorted = [...traitOrder].sort((a, b) => {
    const diffB = Math.abs((self[b] ?? 4.0) - 4.0);
    const diffA = Math.abs((self[a] ?? 4.0) - 4.0);
    if (diffB !== diffA) {
      return diffB - diffA;
    }
    // 同点の場合は配列の順序（安定ソート）
    return traitOrder.indexOf(a) - traitOrder.indexOf(b);
  });

  const topTrait = sorted[0];
  const score = self[topTrait] ?? 4.0;
  const deviation = Math.abs(score - 4.0);

  // すべての軸が4.0ちょうど（または極めて差がない）場合
  if (deviation < 0.25) {
    return SELF_LABELS.NEUTRAL;
  }

  const isHigh = score >= 4.0;
  return SELF_LABELS[`${topTrait}_${isHigh ? 'high' : 'low'}`] || SELF_LABELS.NEUTRAL;
}

/**
 * 自己評価と他者平均評価のギャップから確定称号・解説文を合成
 * @param self ホスト本人の自己評価スコア
 * @param peer ゲスト（他者）の平均評価スコア
 */
export function generateFinalResult(self: TraitScores, peer: TraitScores): FinalResult {
  const selfLabel = getSelfLabel(self);
  const traitOrder: TraitKey[] = ['E', 'A', 'C', 'S', 'O'];

  // 各軸の差分 Δ = self - peer を計算
  const deltas = traitOrder.map((trait) => {
    const selfVal = self[trait] ?? 4.0;
    const peerVal = peer[trait] ?? 4.0;
    const delta = Math.round((selfVal - peerVal) * 100) / 100;
    return {
      trait,
      delta,
      absDelta: Math.abs(delta),
    };
  }).sort((a, b) => {
    if (b.absDelta !== a.absDelta) {
      return b.absDelta - a.absDelta;
    }
    return traitOrder.indexOf(a.trait) - traitOrder.indexOf(b.trait);
  });

  // 最大乖離が 1.0 未満の場合は「等身大パーソン」
  if (deltas[0].absDelta < 1.0) {
    return {
      title: `「${selfLabel}」そのままの等身大パーソン`,
      description: '自分に対する認識と、周囲から見えている姿がほぼ完全に一致しています。偽りなく自然体で生きられている稀有な状態です。',
      selfLabel,
      isConcordant: true,
      primaryGap: null,
      secondaryGap: null,
      deltas,
    };
  }

  // 主ギャップ（第1位）
  const top1 = deltas[0];
  const key1 = `${top1.trait}_${top1.delta > 0 ? 'over' : 'under'}`;
  const primaryPart = GAP_PARTS[key1] || null;

  // 副ギャップ（第2位の乖離が0.8以上の場合に付与）
  let secondaryPart: GapPart | null = null;
  if (deltas[1] && deltas[1].absDelta >= 0.8) {
    const top2 = deltas[1];
    const key2 = `${top2.trait}_${top2.delta > 0 ? 'over' : 'under'}`;
    secondaryPart = GAP_PARTS[key2] || null;
  }

  // タイトル構築とレア称号判定
  let title = '';
  let description = '';
  let isRare = false;
  let rarityBadge: string | undefined = undefined;

  // 1. 全開無双型（SSS級レア）: 3つ以上の軸で自己or他者平均が6.0以上
  const highTraitsSelf = traitOrder.filter((t) => (self[t] ?? 4.0) >= 6.0);
  const highTraitsPeer = traitOrder.filter((t) => (peer[t] ?? 4.0) >= 6.0);

  if (highTraitsSelf.length >= 3 || highTraitsPeer.length >= 3) {
    isRare = true;
    rarityBadge = 'SSS級レア';
    title = '【SSS級レア】全方位無敵のハッピーオーラ・エンターテイナー';
    description =
      '常人の枠に収まらない圧倒的バイタリティの持ち主。行く先々で空気を支配し、周囲を前向きに巻き込んで前進する天性のカリスマです。';
  } else if (deltas[0].absDelta >= 4.5) {
    // 2. 完全逆転型（URレア）: 最大乖離が4.5以上という圧倒的な二面性
    isRare = true;
    rarityBadge = 'URレア';
    const top = deltas[0];
    if (top.trait === 'E' && top.delta < 0) {
      title = '【URレア】自称・陰キャを偽る「ステルス国家機密級インフルエンサー」';
      description =
        '本人は部屋の隅でじっとしていたいと本気で信じていますが、周囲から見ると存在自体が台風の目。天性の人たらしオーラが全開で漏れ出しています。';
    } else if (top.trait === 'E' && top.delta > 0) {
      title = '【URレア】脳内超新星爆発「沈黙の孤高哲学者」';
      description =
        '頭の中では全員とハイタッチしているつもりですが、外見は静寂を極めすぎて周囲からミステリアスな賢者として崇められています。';
    } else if (top.trait === 'A' && top.delta < 0) {
      title = '【URレア】無自覚聖母「ツンデレ救済アンカー」';
      description =
        '「別にアンタのためじゃない」と嘯きながら、全員の面倒を完璧に見てしまう隠れマザーテレサです。';
    } else if (top.trait === 'A' && top.delta > 0) {
      title = '【URレア】笑顔の奥に刃を隠す「冷徹なる敏腕軍師」';
      description =
        '本人は気遣いMAXのつもりですが、放つ一言が核心を突きすぎて周囲からは切れ者として畏怖されています。';
    } else if (top.trait === 'C' && top.delta < 0) {
      title = '【URレア】土壇場の大逆転劇「崖っぷちの奇跡召喚士」';
      description =
        '本人はいつも泥縄で焦っていますが、土壇場の帳尻合わせが完璧すぎて周囲からは超有能な仕事人に見えています。';
    } else if (top.trait === 'C' && top.delta > 0) {
      title = '【URレア】空前絶後の「白紙の超完璧主義者」';
      description =
        '頭の中には壮大な設計図があるものの、自由奔放に振る舞いすぎて周囲からは野生のアーティスト枠で見られています。';
    } else if (top.trait === 'S' && top.delta < 0) {
      title = '【URレア】水面の白鳥「絶対防壁のアイアンポーカーフェイス」';
      description =
        '内心はジェットコースターのように焦っているのに、表情が1ミリも動かないため周囲からは何があっても動じない大物と信じ切られています。';
    } else if (top.trait === 'S' && top.delta > 0) {
      title = '【URレア】ガラスの甲冑を纏った「超敏感バロメーター」';
      description =
        '「全然平気！」と笑顔で強がっていますが、周囲は微細な動揺を察知して全力で守ってあげたくなっています。';
    } else if (top.trait === 'O' && top.delta < 0) {
      title = '【URレア】常識人のフリをした「天然記念物級異次元イノベーター」';
      description =
        '本人は極めて平凡に生きているつもりですが、繰り出す発想とセンスが異次元すぎて周囲からは宇宙人枠として愛されています。';
    } else {
      title = '【URレア】秘密基地の「空想科学マッドサイエンティスト」';
      description =
        '脳内は銀河系レベルの妄想とアイデアで溢れ返っているのに、普段は真面目な社会人の仮面を完璧に被っています。';
    }
  } else if (
    ((self.C ?? 4) <= 2.5 || (peer.C ?? 4) <= 2.5) &&
    ((self.O ?? 4) >= 6.0 || (peer.O ?? 4) >= 6.0)
  ) {
    // 3. アドリブの神業型（SSRレア）
    isRare = true;
    rarityBadge = 'SSRレア';
    title = '【SSRレア】計画性ゼロから勝つ「アドリブの神業イノベーター」';
    description =
      'スケジュール帳は真っ白ですが、土壇場のアドリブと天才的なひらめきだけであらゆる困難をクリアしていく愛され主人公です。';
  } else {
    // 通常の称号構築
    if (primaryPart && secondaryPart) {
      title = `自称・${selfLabel}、実態は「${secondaryPart.name}」を宿した「${primaryPart.name}」`;
    } else if (primaryPart) {
      title = `「${selfLabel}」の皮を被った「${primaryPart.name}」`;
    } else {
      title = `「${selfLabel}」の探求者`;
    }

    description = `本人は自分を「${selfLabel}」だと思っていますが、周囲の目は誤魔化せません。`;
    if (primaryPart) {
      description += `実態は、${primaryPart.desc}状態です。`;
    }
    if (secondaryPart) {
      description += `さらに、${secondaryPart.desc}という一面も周囲に見抜かれています。`;
    }
  }

  return {
    title,
    description,
    selfLabel,
    isConcordant: false,
    primaryGap: primaryPart,
    secondaryGap: secondaryPart,
    deltas,
    isRare,
    rarityBadge,
  };
}
