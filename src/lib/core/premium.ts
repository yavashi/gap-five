import { TraitScores, TraitKey } from './types';

export interface PremiumReport {
  career: {
    title: string;
    superPower: string;
    idealEnvironment: string;
    toxicEnvironment: string;
    growthAdvice: string;
  };
  romance: {
    title: string;
    loveStyle: string;
    hiddenTrap: string;
    bestPartnerTrait: string;
    secretDesire: string;
  };
  mental: {
    title: string;
    stressTrigger: string;
    dangerSign: string;
    quickRecovery: string;
    rechargeRoutine: string;
  };
}

export function generatePremiumReport(self: TraitScores, peer: TraitScores): PremiumReport {
  const e = peer.E ?? self.E ?? 4.0;
  const a = peer.A ?? self.A ?? 4.0;
  const c = peer.C ?? self.C ?? 4.0;
  const s = peer.S ?? self.S ?? 4.0;
  const o = peer.O ?? self.O ?? 4.0;

  // 1. 仕事・キャリア分析
  let careerTitle = '変幻自在のマルチロール・スペシャリスト';
  let superPower = '全体最適を見極め、状況に応じて柔軟に役割を変えられる適応力。';
  let idealEnvironment = '裁量権があり、固定されたマニュアルよりも臨機応変な判断が歓迎される環境。';
  let toxicEnvironment = 'マイクロマネジメントが厳しく、些細な手続きの承認に時間がかかる縦割り組織。';
  let growthAdvice = '「何でもできる人」で終わらないよう、ここぞという得意領域を1つ定めて旗を立てると無双できます。';

  if (o >= 5.0 && c < 4.0) {
    careerTitle = 'ゼロイチ突破のイノベーター＆アイデア起爆剤';
    superPower = '前例のない難題に直面した時の突破力と、常識に囚われない独自の発想センス。';
    idealEnvironment = '新規事業立ち上げ、企画開発、自由度の高いクリエイティブ現場。';
    toxicEnvironment = '減点主義で定型ルーティンワークを1ミリも違わずこなすことを求められる職場。';
    growthAdvice = 'アイデアを実行・管理してくれる几帳面な相棒（C高タイプ）と組むことで爆発的成果を出せます。';
  } else if (c >= 5.0) {
    careerTitle = '堅牢無比のプロジェクト・アンカー＆エグゼキューター';
    superPower = '混乱した状況を整理し、確実に期限と品質を守り切る圧倒的な遂行力と信頼感。';
    idealEnvironment = '目標と納期が明確で、プロフェッショナリズムと成果が公正に評価される組織。';
    toxicEnvironment = '朝令暮改が日常茶飯事で、方針がコロコロ変わり計画が無駄になる無秩序な職場。';
    growthAdvice = '完璧を目指しすぎて自分を追い詰めないよう、「80点でまず出す」勇気を持つとスピードが2倍になります。';
  } else if (e >= 5.0 && a >= 4.5) {
    careerTitle = '求心力抜群のモチベーター＆チームビルダー';
    superPower = '周囲の空気感を明るくし、チームの心理的安全性を高めて一体感を生み出す天性のコミュ力。';
    idealEnvironment = '人と関わる機会が多く、チームプレイや顧客との信頼構築が重視される職場。';
    toxicEnvironment = '一日中誰とも話さず黙々とデータ入力だけを行うような孤立した環境。';
    growthAdvice = '他者の顔色や期待に応えすぎて疲弊しないよう、意識的に「ひとりのオフ時間」を確保しましょう。';
  }

  // 2. 恋愛・パートナーシップ分析
  let romanceTitle = '自然体で深まる信頼の絆タイプ';
  let loveStyle = 'お互いのテリトリーを尊重しつつ、いざという時に最も頼れる精神的支柱を求めるスタイル。';
  let hiddenTrap = '「言わなくても分かってくれるはず」と本音を飲み込み、限界まで溜め込んでしまうこと。';
  let bestPartnerTrait = '過度な束縛をせず、言葉で愛情と感謝をストレートに伝えてくれる誠実な人。';
  let secretDesire = '外ではしっかりしている分、2人きりの空間ではとことん甘えさせてほしいという隠れた願望。';

  if (a >= 5.0) {
    romanceTitle = '無条件の包容力を持つ献身のガーディアン';
    loveStyle = '相手が喜ぶ姿を見ることが自分の幸せ。相手の好みに自然と合わせてしまう深い愛情。';
    hiddenTrap = '相手に尽くしすぎて「都合のいい人」になってしまったり、対等な関係が崩れやすい点。';
    bestPartnerTrait = 'あなたの気遣いや優しさを当たり前と思わず、同じ熱量で大切に返してくれる人。';
    secretDesire = 'たまには自分がすべてを委ねて、強引にリードされたいという密かな憧れ。';
  } else if (s < 4.0) {
    romanceTitle = '繊細で一途なピュアロマンチスト';
    loveStyle = '一度心を開いた相手には深い愛情と誠実さを注ぐ、深い絆を重んじるスタイル。';
    hiddenTrap = '相手のちょっとした返信の遅れや表情の変化を「嫌われたかも？」と深読みして不安になること。';
    bestPartnerTrait = '情緒が安定していて、何があってもドンと構えて安心感を与えてくれるタフな人。';
    secretDesire = '「世界中が敵になっても、絶対に味方でいてくれる」という絶対的な確信が欲しい。';
  }

  // 3. ストレス・メンタル処方箋
  let mentalTitle = '知らず知らずにHPを削る「ステルス消耗型」';
  let stressTrigger = '理不尽なルール、感情的な口論、あるいは自分のペースを強制的に乱されること。';
  let dangerSign = '普段より口数が減る、SNSを見るのが億劫になる、または逆に夜更かしで動画を暴食する。';
  let quickRecovery = 'スマホの通知を完全に切り、ぬるめのお風呂に長めに浸かる。温かい飲み物をゆっくり飲む。';
  let rechargeRoutine = '誰にも気を遣わない「完全な孤立デイ」を月に1日作り、好きな作品や趣味に没頭すること。';

  if (s < 4.0) {
    mentalTitle = 'センサーが高感度すぎる「クリスタルハート型」';
    stressTrigger = '周囲のネガティブな感情のぶつかり合い、批判的な視線、急な予定変更。';
    dangerSign = '眠りが浅くなる、小さなミスを寝る前に何度も脳内反省会してしまう。';
    quickRecovery = '思考を紙に書き殴って頭の外に出す（ブレインダンプ）。自然の多い場所を15分散歩する。';
    rechargeRoutine = '「他人の機嫌は他人の責任」と言い聞かせ、ネガティブな人やニュースから物理的に距離を置く。';
  } else if (c >= 5.0) {
    mentalTitle = '責任感が強すぎる「燃料切れ無自覚型」';
    stressTrigger = '期日に間に合わないリスク、中途半端なクオリティの妥協、指示待ち人間の尻拭い。';
    dangerSign = '肩こりや頭痛など身体症状が出るまで、自分が疲れていることに気づかない。';
    quickRecovery = '「今日はもう何も生産的なことをしない」と決めて、ベッドにダイブして強制終了する。';
    rechargeRoutine = 'タスク管理から離れ、計画性のないアドリブの散歩や買い物を楽しむ。';
  }

  return {\n    career: {\n      title: careerTitle,\n      superPower,\n      idealEnvironment,\n      toxicEnvironment,\n      growthAdvice,\n    },\n    romance: {\n      title: romanceTitle,\n      loveStyle,\n      hiddenTrap,\n      bestPartnerTrait,\n      secretDesire,\n    },\n    mental: {\n      title: mentalTitle,\n      stressTrigger,\n      dangerSign,\n      quickRecovery,\n      rechargeRoutine,\n    },\n  };\n}
