import { TraitScores, TraitKey } from './types';

export interface PremiumReport {
  career: {
    title: string;
    superPower: string;
    idealEnvironment: string;
    toxicEnvironment: string;
    bestRoles: string[];
    tactics: string;
    growthAdvice: string;
    bestPartnerType: string;
    interviewTemplate: string;
    weaknessReframe: string;
    workplaceCommunicationTip: string;
  };
  romance: {
    title: string;
    loveStyle: string;
    hiddenTrap: string;
    bestPartnerTrait: string;
    secretDesire: string;
    conflictResolution: string;
    idealConditions: string[];
  };
  manual: {
    title: string;
    rules: {
      title: string;
      description: string;
    }[];
  };
  mental: {
    title: string;
    stressTrigger: string;
    dangerSign: string;
    quickRecovery: string;
    rechargeRoutine: string;
    affirmation: string;
  };
}

export function generatePremiumReport(self: TraitScores, peer: TraitScores): PremiumReport {
  const e = peer.E ?? self.E ?? 4.0;
  const a = peer.A ?? self.A ?? 4.0;
  const c = peer.C ?? self.C ?? 4.0;
  const s = peer.S ?? self.S ?? 4.0;
  const o = peer.O ?? self.O ?? 4.0;

  // 1. 仕事・キャリア編
  let careerTitle = '変幻自在のマルチロール・スペシャリスト';
  let superPower = '全体最適を見極め、状況に応じて柔軟に役割を変えられる天性の適応力。混沌とした現場でも即座に空気を読み、チームの潤滑油として機能します。';
  let idealEnvironment = '裁量権があり、固定された定型マニュアルよりも臨機応変な判断が歓迎される環境。フラットで風通しの良い組織。';
  let toxicEnvironment = 'マイクロマネジメントが厳しく、些細な手続きや承認に膨大な時間がかかる縦割り・減点主義の組織。';
  let bestRoles = [
    'プロジェクトマネージャー・進行管理',
    '新規事業企画・アライアンス担当',
    'カスタマーサクセス・コンサルタント',
    'チームリーダー・プロダクトオーナー',
    'フリーランス・独立プロデューサー'
  ];
  let tactics = '会議では最初に発言せず、議論が一巡した後に「要するに課題はここですよね」と要約して着地点を提示すると、圧倒的な信頼感を獲得できます。';
  let growthAdvice = '「何でもそつなくこなせる人」で終わらないよう、ここぞという得意領域を1つ定めて旗を立てると市場価値が跳ね上がります。';
  let bestPartnerType = '細部の数字やスケジュール管理を徹底してくれる几帳面な実務家（C高タイプ）と組むと無敵になります。';
  let interviewTemplate = '「自分では慎重に状況を観察するタイプだと自認していますが、友人や周囲からは『どんな状況でも冷静に全体を俯瞰し、チームのバランスを整えてくれる安心感がある』と評価されます。自己認識の慎重さを、チーム全体の安定感へと還元できるよう努めています。」';
  let weaknessReframe = '「こだわりが強く見えたり優柔不断に見える」短所は、ビジネスでは「多角的な視野を持ち、軽率な失敗を未然に防ぐリスクヘッジ能力」と言い換えられます。';
  let workplaceCommunicationTip = '1on1では「現状どう？」と漠然と聞くより、「〇〇の進捗で、私のフォローが必要なボトルネックはある？」と役割に焦点を当てて尋ねると、本音と具体的な相談を引き出せます。';

  if (o >= 5.0 && c < 4.0) {
    careerTitle = 'ゼロイチ突破のイノベーター＆アイデア起爆剤';
    superPower = '前例のない難題に直面した時の突破力と、常識や枠組みに囚われない独自の発想センス。直感で本質を見抜く力。';
    idealEnvironment = '新規事業立ち上げ、企画開発、クリエイティブ制作、自由度の高いスタートアップや研究開発チーム。';
    toxicEnvironment = '前例踏襲を何より重んじ、定型ルーティンワークを1ミリも違わずこなすことを求められる職場。';
    bestRoles = [
      '事業開発・0→1プロデューサー',
      'クリエイティブディレクター・企画立案者',
      'UXデザイナー・リサーチャー',
      'マーケティングストラテジスト',
      'スタートアップ創業者・起業家'
    ];
    tactics = 'アイデア出しの場では誰よりも多くの奇策を投げ込み、実務や細部の詰めは得意な人に任せる分業体制を公言すると最も輝きます。';
    growthAdvice = '「思いつき」で終わらせないため、アイデアを実行・管理してくれる几帳面な相棒を味方につける交渉力を磨きましょう。';
    bestPartnerType = 'あなたの突飛なアイデアを否定せず、実現可能なロードマップに落とし込んでくれる論理的な実務家。';
    interviewTemplate = '「自分自身では思いつきや直感で動いている感覚がありますが、周囲からは『前例のない課題にも臆せず飛び込み、新しい視点や突破口をもたらしてくれる』と言われます。柔軟な発想力を組織の課題解決に直結させられる点が私の強みです。」';
    weaknessReframe = '「飽きっぽさ・ルーティンが苦手」な短所は、「新しい変化への適応速度が圧倒的に早く、停滞したプロジェクトに風穴を開ける推進力」と言い換えられます。';
    workplaceCommunicationTip = '1on1では「細かい業務の進捗確認」を詰めすぎず、「今何に一番ワクワクしているか」「どんな新しいアイデアを試してみたいか」を質問することで爆発的な熱量を引き出せます。';
  } else if (c >= 5.0) {
    careerTitle = '堅牢無比のプロジェクト・アンカー＆エグゼキューター';
    superPower = '混乱した状況を整理し、確実に期限と品質を守り切る圧倒的な遂行力と信頼感。妥協を許さないプロ意識。';
    idealEnvironment = '目標と納期が明確で、プロフェッショナリズムと成果が公正に評価される組織。規律と敬意がある職場。';
    toxicEnvironment = '朝令暮改が日常茶飯事で、方針がコロコロ変わり計画が無駄になる無秩序・無責任な環境。';
    bestRoles = [
      'プロジェクトディレクター・PMO',
      '経営企画・財務・オペレーション統括',
      'エンジニアリングマネージャー・品質保証',
      '戦略コンサルタント・アナリスト',
      '専門職スペシャリスト（士業・研究員）'
    ];
    tactics = '事前の綿密な準備とデータ・根拠に基づいたロジカルな提案を行うことで、上層部やクライアントの意思決定を瞬時に導きます。';
    growthAdvice = '完璧を目指しすぎて自分や周囲を追い詰めないよう、「まずは80点でスピード重視で出す」勇気を持つと生産性が倍増します。';
    bestPartnerType = '大枠のビジョンや新しい市場機会をどんどん見つけてきてくれる行動派の開拓者。';
    interviewTemplate = '「自分では当たり前の義務として行動しているつもりですが、周囲からは『どんな突発的な事態でも最後までやり遂げてくれる責任感と遂行力がある』と信頼されます。細部の品質管理と納期意識の高さを組織の土台作りに活かします。」';
    weaknessReframe = '「融通が利かない・頑固」に見える短所は、「ルールや品質基準を徹底的に守り抜き、組織のリスクや手戻りを最小化する堅実性」と言い換えられます。';
    workplaceCommunicationTip = '1on1では抽象的な雑談だけでなく、「次回までに達成すべきKPIや期限」「責任範囲」を明文化してすり合わせることで、抜群の安心感と成果を引き出せます。';
  } else if (e >= 5.0) {
    careerTitle = '周囲を巻き込むカリスマ・ムードメーカー＆エバンジェリスト';
    superPower = '初対面でも一瞬で心の壁を取り払う圧倒的な人脈形成力と、周囲を熱狂させるプレゼンス。ポジティブな感染力。';
    idealEnvironment = '人と接する機会が多く、チームで大きな目標を追いかける活気ある組織。営業・PR・広報など外向きの現場。';
    toxicEnvironment = '終日誰とも話さず、個人のデスクで黙々と単純作業を繰り返すことを強制される閉鎖的な環境。';
    bestRoles = [
      '広報・PRマネージャー・渉外担当',
      'ソリューション営業・ビジネスマッチング',
      'コミュニティマネージャー・イベント統括',
      '採用人事・タレントアクイジション',
      'セミナー講師・ブランドエバンジェリスト'
    ];
    tactics = '社内外のキーマン同士を積極的に繋げ、「ハブ（結節点）」としてのポジションを確立すると組織内で不可欠な存在になります。';
    growthAdvice = '勢いだけで押し切らず、重要な合意形成は必ず文書（テキスト）に残して証跡を作る習慣をつけると無敵です。';
    bestPartnerType = '契約書の確認や詳細な数字の分析など、バックオフィス実務を冷徹にこなしてくれる堅実な番頭役。';
    interviewTemplate = '「自分では単に人と話すのが好きなだけですが、周囲からは『場にいるだけで空気が明るくなり、初対面のチームでもすぐ結束を作ってくれる推進役』と言われます。人を巻き込み前進させる求心力を発揮します。」';
    weaknessReframe = '「おしゃべり・軽率」に見える短所は、「心理的安全性を瞬時に高め、チーム全体のコミュニケーション量を爆発的に増やす発火点」と言い換えられます。';
    workplaceCommunicationTip = '1on1では「最近どんな人と会って面白かった？」「チームの雰囲気をどう感じている？」と人間関係や感情面から入ると、生き生きと本音を語ってくれます。';
  }

  // 2. 恋愛・パートナーシップ編
  let romanceTitle = '自然体で深まる安らぎのソウルメイト';
  let loveStyle = 'お互いの自由とプライベートを尊重しつつ、静かに深い信頼を積み重ねていく大人のパートナーシップ。';
  let hiddenTrap = '不満や要望があっても「波風を立てたくない」と我慢してしまい、ある日突然限界を迎えて冷めてしまうこと。';
  let bestPartnerTrait = '言葉にしなくてもこちらの些細な変化に気づいてくれ、決して感情的にならず対話ができる落ち着いた人。';
  let secretDesire = '「言葉にしなくても察してほしい」「弱音を吐いた時に無条件で全肯定してほしい」という密かな甘え。';
  let conflictResolution = '感情が高ぶった時はその場で結論を出さず、「一晩置かせて」と伝えてクールダウンしてから本音を伝えましょう。';
  let idealConditions = [
    'お互いに一人の時間を楽しむ趣味を持っている',
    '察してちゃんにならず、感謝や要望をちゃんと言葉で口に出せる',
    '感情的にならず、トラブル時に対等に話し合いができる'
  ];

  if (a >= 5.0) {
    romanceTitle = '無条件の包容力を持つ献身のガーディアン';
    loveStyle = '相手が喜ぶ姿を見ることが自分の至上の幸せ。相手の好みに自然と合わせてしまう深い愛情と気遣い。';
    hiddenTrap = '相手に尽くしすぎて「都合のいい人」になってしまったり、対等なパートナーシップが崩れやすい点。';
    bestPartnerTrait = 'あなたの気遣いや優しさを当たり前と思わず、同じ熱量で大切に気遣いを返してくれる人。';
    secretDesire = 'たまには自分がすべてを委ねて、強引にエスコートされたいという密かな憧れ。';
    conflictResolution = '「ごめんね」から入らずに、まず「私はこう感じて寂しかった」と自分の感情を素直に主語にして伝えてみましょう。';
    idealConditions = [
      'あなたの尽くしすぎを制止し、自分を大切にするよう促してくれる',
      '愛情表現を行動と言葉の両方で惜しみなく伝えてくれる',
      'あなたの家族や友人も同じように大切にしてくれる'
    ];
  } else if (s < 4.0) {
    romanceTitle = '繊細で一途なピュアロマンチスト';
    loveStyle = '一度心を開いた相手には深い愛情と誠実さを注ぐ、魂の深い繋がりを重んじるスタイル。';
    hiddenTrap = '相手のちょっとした返信の遅れや表情の曇りを「嫌われたかも？」と深読みして、過剰に不安になってしまうこと。';
    bestPartnerTrait = '情緒が常に安定していて、何があってもドンと構えて揺るがない安心感を与えてくれるタフな人。';
    secretDesire = '「世界中が敵になっても、絶対に味方でいてくれる」という絶対的な確信と無償の愛が欲しい。';
    conflictResolution = '不安になった時は「推測で悩む」のをやめ、「今ちょっと不安になっちゃった」と可愛く素直に打ち明けるのが最善です。';
    idealConditions = [
      '連絡頻度や愛情表現が一定で、安心感を常に与えてくれる',
      'あなたの繊細な感情を「面倒くさい」と否定せず包み込んでくれる',
      '機嫌の浮き沈みがなく、いつでもフラットに接してくれる'
    ];
  }

  // 3. あなたの公式取扱説明書（周囲・パートナー用5箇条）
  let manualRules = [
    {
      title: '第1条：突然の予定変更や急な詰め込みはNG',
      description: '自分のペースで準備を整えたいタイプです。予定の変更やタスクの依頼は、できるだけ前もって伝えてもらえると最大のパフォーマンスを発揮します。'
    },
    {
      title: '第2条：落ち込んでいる時は「正論のアドバイス」より「共感と温かい飲み物」',
      description: '解決策は本人が一番よく分かっています。弱っている時はアドバイスではなく「大変だったね」「頑張ってるの見てるよ」と受け止めてもらえると即座に回復します。'
    },
    {
      title: '第3条：褒める時は具体的にプロセスを評価してほしい',
      description: '適当なお世辞は見抜いてしまいます。「あの時のあの配慮が助かった」「あの分析のおかげでうまくいった」と具体的に褒められると心の中でガッツポーズします。'
    },
    {
      title: '第4条：静かに黙り込んだ時は「放置」が最大の優しさ',
      description: '怒っているのではなく、頭の中で情報をフル回転で整理しているかHPが切れている状態です。そっとしておいてあげると、勝手に充電完了して戻ってきます。'
    },
    {
      title: '第5条：信頼を寄せてくれる人には10倍にして恩を返す',
      description: '一度信頼した仲間やパートナーには、裏表のない圧倒的な誠実さで尽くします。敬意を持って接してくれる人こそが、人生の最重要人物です。'
    }
  ];

  if (s < 4.0) {
    manualRules[1] = {
      title: '第2条：強い口調や感情的な物言いには敏感に反応します',
      description: '怒鳴り声やピリピリした空気は自分のせいでなくてもHPを激しく削られます。落ち着いたトーンで対話してくれる人に絶大な信頼を寄せます。'
    };
  }

  // 4. メンタル＆エナジー処方箋
  let mentalTitle = '知らず知らずにHPを削る「ステルス消耗型」';
  let stressTrigger = '理不尽なルール、感情的な口論、あるいは自分のペースを強制的に乱されること。無駄な社内調整。';
  let dangerSign = '普段より口数が減る、SNSを見るのが億劫になる、または逆に夜更かしで動画や漫画を暴食する。';
  let quickRecovery = 'スマホの通知を完全に切り、ぬるめのお風呂に長めに浸かる。温かいハーブティーを飲みながらボーッとする。';
  let rechargeRoutine = '誰にも気を遣わない「完全な孤立デイ」を月に1日作り、好きな作品や趣味に没頭すること。';
  let affirmation = '「他人の期待に応えるために生きているわけではない。今日も自分のペースで十分に素晴らしい。」';

  if (s < 4.0) {
    mentalTitle = 'センサーが高感度すぎる「クリスタルハート型」';
    stressTrigger = '周囲のネガティブな感情のぶつかり合い、批判的な視線、急な予定変更、過密スケジュール。';
    dangerSign = '眠りが浅くなる、小さなミスを寝る前に何度も脳内反省会してしまう、胃腸の調子を崩す。';
    quickRecovery = '思考を紙に書き殴って頭の外に出す（ブレインダンプ）。緑の多い公園や神社を15分散歩する。';
    rechargeRoutine = '「他人の機嫌は他人の責任」と言い聞かせ、ネガティブな人やニュースから物理的に距離を置く。';
    affirmation = '「私は繊細だからこそ、人の痛みが分かり美しいものに感動できる。この感性は私の誇りだ。」';
  } else if (c >= 5.0) {
    mentalTitle = '責任感が強すぎる「燃料切れ無自覚型」';
    stressTrigger = '期日に間に合わないリスク、中途半端なクオリティの妥協、指示待ち人間の尻拭い。';
    dangerSign = '肩こりや頭痛など身体症状が出るまで、自分が疲れていることに気づかない。休日も仕事のタスクを考えてしまう。';
    quickRecovery = '「今日はもう何も生産的なことをしない」と決めて、ベッドにダイブして強制シャットダウンする。';
    rechargeRoutine = 'タスク管理アプリから完全に離れ、計画性のないアドリブの散歩や買い物を楽しむ。';
    affirmation = '「完璧でなくても世界は回る。80点の手放しこそが、長く走り続けるための知恵である。」';
  }

  return {
    career: {
      title: careerTitle,
      superPower,
      idealEnvironment,
      toxicEnvironment,
      bestRoles,
      tactics,
      growthAdvice,
      bestPartnerType,
      interviewTemplate,
      weaknessReframe,
      workplaceCommunicationTip,
    },
    romance: {
      title: romanceTitle,
      loveStyle,
      hiddenTrap,
      bestPartnerTrait,
      secretDesire,
      conflictResolution,
      idealConditions,
    },
    manual: {
      title: '公式取扱説明書（周囲・パートナー用5箇条）',
      rules: manualRules,
    },
    mental: {
      title: mentalTitle,
      stressTrigger,
      dangerSign,
      quickRecovery,
      rechargeRoutine,
      affirmation,
    },
  };
}
