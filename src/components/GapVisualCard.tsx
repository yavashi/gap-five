import React from 'react';

// ==========================================
// 1. 自認ラベル辞書（全11タイプ完全網羅）
// ==========================================
export interface SelfVisualData {
  img: string;
  bubble: string;
  thought: string;
  desc: string;
}

export const SELF_VISUAL_MAP: Record<string, SelfVisualData> = {
  // E_high
  '情熱のインフルエンサー': {
    img: '/gap-samples/foo_clean_self.jpg',
    bubble: '「みんな〜！\n今日も乾杯しよ〜！🍹✨」',
    thought: '「自分は社交的で明るいムードメーカーだな〜」',
    desc: 'パーティーの主役として、みんなと太陽のように乾杯して盛り上げている陽気な人気者。',
  },
  // E_low
  '静寂を愛する孤高の観察者': {
    img: '/gap-samples/stealth_clean_self.jpg',
    bubble: '「週末は家で読書と猫…\nこれが最高の幸せ☕️📖」',
    thought: '「私は一人が大好きな根っからの内向型だな〜」',
    desc: '日だまりの部屋で猫と本とコーヒーを愛する、静かで穏やかな内向的人間。',
  },
  // A_high
  '慈悲深きガーディアン': {
    img: '/gap-samples/scalpel_clean_self.jpg',
    bubble: '「みんなの役に立ちたい…\n愛と善意で支えるわ🍲✨」',
    thought: '「私は誰にでも優しく尽くす博愛主義者」',
    desc: '温かいスープを差し出し、慈悲深い笑顔で誰かを守りたい心優しきガーディアン。',
  },
  // A_low
  '冷徹なるリアリスト': {
    img: '/gap-samples/tsundere_clean_self.jpg',
    bubble: '「私は数字と論理しか信じない。\n情に流されるのは非効率📊」',
    thought: '「私は損得勘定とロジックで動く冷徹な合理主義者」',
    desc: '夜景オフィスでデータを冷静に分析する、感情を排除したクールな客観主義者。',
  },
  // C_high
  '緻密なグランドデザイナー': {
    img: '/gap-samples/blueprint_clean_self.jpg',
    bubble: '「緻密な計画こそが成功の鍵。\n全ては計算通りだ📐✨」',
    thought: '「自分は抜け目なく計画を練るグランドデザイナー」',
    desc: '未来的で精密な設計図の前で知的な眼鏡を光らせ、完璧なタイムラインを計算する策士。',
  },
  // C_low
  '型破りなインプロバイザー': {
    img: '/gap-samples/acrobat_clean_self.jpg',
    bubble: '「計画なんて縛られたくない。\n直感とアドリブが俺の流儀🎸」',
    thought: '「自分はいつも行き当たりばったりの自由人」',
    desc: 'ギターとデザインスケッチに囲まれてペンを回し、気ままなアドリブで生きる自由人。',
  },
  // S_high
  '泰然自若のアイアンハート': {
    img: '/gap-samples/armor_clean_self.jpg',
    bubble: '「何があっても動じない。\n我が心は鋼の鎧なり🛡️⚡️」',
    thought: '「自分はタフでメンタル強靭なアイアンハート」',
    desc: '頑丈なチタンの鎧に身を包み、嵐の中でも泰然と仁王立ちする不屈の騎士。',
  },
  // S_low
  '繊細なるクリスタルセンサー': {
    img: '/gap-samples/swan_clean_self.jpg',
    bubble: '「心静かに瞑想中…\n私は何事にも動じない🧘‍♂️」',
    thought: '「私は落ち着き払ったポーカーフェイスを保てている」',
    desc: '池のほとりで静かに目を閉じ、風のそよぎにも平穏を保つ瞑想的で冷静な人物。',
  },
  // O_high
  '未踏を拓くヴィジョナリー': {
    img: '/gap-samples/secret_base_clean_self.jpg',
    bubble: '「未来を創るヴィジョンが見える。\n世界を変えるのは私だ🚀🌌」',
    thought: '「自分は時代を先取るハイテック・ヴィジョナリー」',
    desc: 'サイバーパンクな夜景を見下ろし、タブレットで世界を変える新コンセプトを描く先駆者。',
  },
  // O_low
  '質実剛健のリアリズムアンカー': {
    img: '/gap-samples/innovator_clean_self.jpg',
    bubble: '「普通が一番。私はどこにでもいる\n真面目で堅実な整備士です🌱」',
    thought: '「自分は地に足のついた堅実な常識人」',
    desc: '作業場で工具を几帳面に整理し、誰よりも真面目に目の前の修理をこなす普通の職人。',
  },
  // NEUTRAL
  '変幻自在のバランサー': {
    img: '/gap-samples/balancer_clean_self.jpg',
    bubble: '「どんな環境・人とも自然に調和。\n柔軟にスマートに行こう☕️💻」',
    thought: '「自分はバランス感覚に優れた柔軟なタイプ」',
    desc: '明るいカフェで周囲と和やかに調和しながら、あらゆるタスクを軽やかにこなすスマートなバランサー。',
  },
};

// ==========================================
// 2. ギャップオチ辞書（全10タイプ完全網羅）
// ==========================================
export interface GapVisualData {
  img: string;
  bubble: string;
  subBubble?: string;
  witness: string;
  reality: string;
}

export const GAP_VISUAL_MAP: Record<string, GapVisualData> = {
  // E_over: 脳内フェス野郎
  '脳内フェス野郎': {
    img: '/gap-samples/foo_clean_gap.jpg',
    bubble: '「……あの人、さっきから一言も喋らずストロー吸ってない？」',
    subBubble: '「ウオオオ！フェス最高ー！！🕺🎶」',
    witness: '心の中では全員と乾杯しているつもりだが、出力ポートが狭すぎて周囲にはクールに見えている',
    reality: '周囲には無言・無表情でタピオカを吸うおとなしい人に見えているが、頭の中では星型サングラスで爆音レーザーのフェスを開催中。',
  },
  // E_under: ステルス社交モンスター
  'ステルス社交モンスター': {
    img: '/gap-samples/stealth_gap_monster.jpg',
    bubble: '「コミュ力高すぎ！\nマジで場の神じゃん！🍻」',
    subBubble: '「残HP 1%…もう限界…😇」',
    witness: '内面ではHPを激しく消耗しているが、社会性フィルターが優秀すぎて周囲からはコミュ力お化けに見えている',
    reality: '居酒屋で営業スマイルとお酌を完璧にこなして場を制圧しているが、頭上のバッテリーは1%で黒煙噴出。目はグルグル限界寸前。',
  },
  // A_under: ツンデレ無自覚マザーテレサ
  'ツンデレ無自覚マザーテレサ': {
    img: '/gap-samples/tsundere_clean_gap.jpg',
    bubble: '「べ、別に心配してないわよ！\n肉まんが余ってただけだから！😤」',
    subBubble: '後輩：「先輩…神様ですか…😭」',
    witness: '「損得で動いている」と本人は嘯くが、行動の端々に面倒見の良さがダダ漏れている',
    reality: '雨の中、捨て猫に傘を差し出し、泣いてる後輩に肉まんとホット缶を渡しつつ、顔だけは頑なに「フン！」とそっぽを向いている。',
  },
  // C_under: 崖っぷちの神業アクロバット
  '崖っぷちの神業アクロバット': {
    img: '/gap-samples/acrobat_clean_gap.jpg',
    bubble: '「奇跡の神プレゼンだ…！\n全米が泣いた完璧な仕事…！😭👏」',
    subBubble: '「えっ…通っちゃった…？（白目）」',
    witness: '本人の体感はいつも泥縄だが、土壇場の帳尻合わせが完璧すぎて周囲からは超有能に見えている',
    reality: '本人の体感はいつも泥縄のパニックだが、締め切り23:59:59に提出した土壇場の帳尻合わせが完璧すぎて、役員たちが感涙のスタンディングオベーション。',
  },
  // A_over: 切れ味抜群の善意のメス
  '切れ味抜群の善意のメス': {
    img: '/gap-samples/scalpel_clean_gap.jpg',
    bubble: '「正論すぎて刺さりまくる…！\n切れ味エグい…！😱🩸」',
    subBubble: '「純度100%の善意です✨（巨大メス）」',
    witness: '相手を想っての正論だが、オブラートを省くため周囲からは切れ者として恐れられている',
    reality: '本人は心からの善意と慈悲の笑顔だが、オブラートを削ぎ落とした正論のメスが巨大すぎて、周囲は失血死寸前の戦慄状態。',
  },
  // C_over: 白紙の設計図マスター
  '白紙の設計図マスター': {
    img: '/gap-samples/blueprint_clean_gap.jpg',
    bubble: '「白紙じゃねえかーーっ！！\n全部アドリブかよ！？😱💥」',
    subBubble: '「頭の中にはあるから（😊）」',
    witness: '頭の中では完璧な計画があるが、アドリブで動きすぎて周囲からは自由人に見えている',
    reality: '完璧な青写真を持っていると豪語していたが、広げた設計図はまさかの完全白紙（ニコちゃんマーク付）。同僚たちの阿鼻叫喚をよそに本人は涼しい顔。',
  },
  // S_over: ガラスの防弾チョッキ
  'ガラスの防弾チョッキ': {
    img: '/gap-samples/armor_clean_gap.jpg',
    bubble: '「お願い誰も刺激しないで…！\nヒビ入っちゃうから…！😭💦」',
    subBubble: '「胃が痛い…胃薬どこ…💊」',
    witness: '「全然平気」と強がっているが、周囲は微小な動揺を察知して気を遣っている',
    reality: '重厚な鎧を着てドヤ顔しているが、胸部だけ極薄のガラス製。雨粒1滴でピキッと亀裂が入り、周囲はクッションを抱えて腫れ物を触るように過保護介護中。',
  },
  // S_under: 水面の白鳥（脚は激突中）
  '水面の白鳥（脚は激突中）': {
    img: '/gap-samples/swan_clean_gap.jpg?v=2',
    bubble: '「顔は澄ましてるけど…\n足の激漕ぎバレバレだよ！！😂💥」',
    subBubble: '「必死漕ぎで音速爆走中🦢💨」',
    witness: 'クールを装っているつもりらしいが、焦りと必死さが周囲には完全にダダ漏れている',
    reality: '本人は腕組みして悟りを開いたようにクールを装っているが、顔には冷や汗、スワンボートのペダルを音速で激漕ぎして白煙を噴き上げており、必死の焦りが周囲に丸見えで大爆笑されている。',
  },
  '水面の白鳥': {
    img: '/gap-samples/swan_clean_gap.jpg?v=2',
    bubble: '「顔は澄ましてるけど…\n足の激漕ぎバレバレだよ！！😂💥」',
    subBubble: '「必死漕ぎで音速爆走中🦢💨」',
    witness: 'クールを装っているつもりらしいが、焦りと必死さが周囲には完全にダダ漏れている',
    reality: '本人は腕組みして悟りを開いたようにクールを装っているが、顔には冷や汗、スワンボートのペダルを音速で激漕ぎして白煙を噴き上げており、必死の焦りが周囲に丸見えで大爆笑されている。',
  },
  // O_over: 秘密基地の空想科学者
  '秘密基地の空想科学者': {
    img: '/gap-samples/secret_base_clean_gap.jpg?v=2',
    bubble: '「……あいつ、さっきから机の下で\nペットボトル銃構えて何と戦ってんの…？😨」',
    subBubble: '「最終兵器、起動まであと3分…（真顔）」',
    witness: '頭の中は奇想天外なアイデアで溢れているが、普段は常識人の仮面を被っている',
    reality: '頭の中ではサイバーパンクの天才ヴィジョナリーだが、実態はオフィスの引き出しにガラクタとアルミホイルで作った「秘密兵器」を隠し持ち、真顔で世界を救う妄想をしている永遠の厨二病。',
  },
  // O_under: 天然記念物級イノベーター
  '天然記念物級イノベーター': {
    img: '/gap-samples/innovator_clean_gap.jpg?v=2',
    bubble: '「パンク修理頼んだのに…\nなんで空飛んでんのーーっ！？😱🚀」',
    subBubble: '「え？普通に直しただけだけど…？🔧」',
    witness: '本人は至って普通だと思っているが、作ったものと発想が人外レベルの異次元イノベーター',
    reality: '「ちょっとパンク直しただけ」と言いながら反重力ホバーバイクを爆誕させてキョトン顔。依頼主や近所の客が腰を抜かして絶叫しており、本人だけが自分の異次元さに気づいていない。',
  },
};

// ==========================================
// 3. メインコンポーネント
// ==========================================
interface GapVisualCardProps {
  hostNickname: string;
  selfLabel: string;
  gapName?: string | null;
  gapTrait?: string;
  gapType?: 'over' | 'under';
  isConcordant?: boolean;
}

export const GapVisualCard: React.FC<GapVisualCardProps> = ({
  hostNickname,
  selfLabel,
  gapName,
  isConcordant,
}) => {
  // 自認データの取得（フォールバックあり）
  const selfData = SELF_VISUAL_MAP[selfLabel] || SELF_VISUAL_MAP['変幻自在のバランサー'];
  
  // オチデータの取得
  const gapData = gapName ? GAP_VISUAL_MAP[gapName] : null;

  return (
    <div className="bg-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl border border-slate-800 space-y-5">
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold border border-pink-500/30">
          <span>🎭</span>
          <span>自己認識と周囲の目のギャップ可視化</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-indigo-300">
          {hostNickname}さんの【自己認識】vs【周囲から見た印象】
        </h2>
        <p className="text-xs text-slate-400">
          自分自身で捉えている性格と、周囲の仲間から見えている客観的な姿の対比です。
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
        {/* 左：自己認識 */}
        <div className="bg-slate-950/80 border border-amber-500/40 rounded-2xl overflow-hidden flex flex-col shadow-md">
          <div className="px-3.5 py-2 bg-amber-500/15 border-b border-amber-500/30 flex items-center justify-between">
            <span className="text-[11px] font-black text-amber-300 uppercase tracking-wider">
              本人の自認（MY VIEW）
            </span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-200 font-bold">
              自称ラベル
            </span>
          </div>

          <div className="aspect-square bg-slate-950 relative overflow-hidden group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={selfData.img}
              alt={`${hostNickname}さんの自認`}
              className="w-full h-full object-cover"
            />
            {/* 日本語ふきだしオーバーレイ */}
            <div className="absolute top-4 right-3 bg-white text-slate-900 px-3 py-1.5 rounded-2xl rounded-tr-none shadow-xl border-2 border-amber-400 font-black text-xs drop-shadow-md whitespace-pre-line leading-tight">
              {selfData.bubble}
            </div>
          </div>

          <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-sm font-black text-amber-300">
                「{selfLabel}」
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                {selfData.thought}
              </p>
            </div>
          </div>
        </div>

        {/* 右：周囲から見た印象または等身大パーソン */}
        {gapData ? (
          <div className="bg-slate-950/80 border-2 border-pink-500/60 rounded-2xl overflow-hidden flex flex-col shadow-lg">
            <div className="px-3.5 py-2 bg-pink-500/20 border-b border-pink-500/30 flex items-center justify-between">
              <span className="text-[11px] font-black text-pink-300 uppercase tracking-wider">
                周囲から見た印象（THE GAP）
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-pink-500/30 text-pink-200 font-bold animate-pulse">
                確定二つ名
              </span>
            </div>

            <div className="aspect-square bg-slate-950 relative overflow-hidden group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={gapData.img}
                alt={`${hostNickname}さんのギャップ`}
                className="w-full h-full object-cover"
              />
              {/* サブふきだし（本音/叫び） */}
              {gapData.subBubble && (
                <div className="absolute top-3 right-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-2.5 py-1 rounded-xl rounded-tr-none shadow-xl border border-yellow-300 font-black text-[11px] animate-bounce drop-shadow-md">
                  {gapData.subBubble}
                </div>
              )}
              {/* 周囲のツッコミふきだし */}
              <div className="absolute bottom-12 left-3 bg-slate-900/95 text-pink-200 px-3 py-1.5 rounded-2xl rounded-bl-none shadow-xl border border-pink-500 font-bold text-xs backdrop-blur-sm max-w-[200px] leading-tight drop-shadow-md whitespace-pre-line">
                {gapData.bubble}
              </div>
            </div>

            <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-black text-pink-400">
                  「{gapName}」
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {gapData.reality}
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* 等身大パーソン（一致型） */
          <div className="bg-slate-950/80 border-2 border-emerald-500/60 rounded-2xl overflow-hidden flex flex-col shadow-lg">
            <div className="px-3.5 py-2 bg-emerald-500/20 border-b border-emerald-500/30 flex items-center justify-between">
              <span className="text-[11px] font-black text-emerald-300 uppercase tracking-wider">
                周囲の評価（THE TRUTH）
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/30 text-emerald-200 font-bold">
                裏表ゼロ認定
              </span>
            </div>

            <div className="aspect-square bg-slate-950 relative overflow-hidden flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950">
              <div className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-5xl mb-4 shadow-[0_0_30px_rgba(16,185,129,0.3)] animate-pulse">
                👑
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-emerald-400/10 text-emerald-300 text-xs font-black border border-emerald-400/30 mb-2">
                ギャップなし・完全一致
              </div>
              <h4 className="text-lg font-black text-emerald-200">
                等身大パーソン
              </h4>
              <p className="text-xs text-slate-400 mt-2 max-w-[220px]">
                あなたの自認と、周囲から見えている姿は100%シンクロ！偽りのない自然体です。
              </p>
            </div>

            <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-black text-emerald-400">
                  「{selfLabel}」そのままのあなた
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  周囲の友達も、あなたをまさに「{selfLabel}」として信頼しています。隠された裏の顔のない、稀有なピュアタイプです。
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ==========================================
// 4. 自己診断直後用（回答待ち画面で表示する単体カード）
// ==========================================
export const SelfVisualWaitingCard: React.FC<{
  hostNickname: string;
  selfLabel: string;
}> = ({ hostNickname, selfLabel }) => {
  const selfData = SELF_VISUAL_MAP[selfLabel] || SELF_VISUAL_MAP['変幻自在のバランサー'];

  return (
    <div className="bg-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl border border-slate-800 space-y-4">
      <div className="text-center space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
          <span>🎭</span>
          <span>STEP 1：あなたの自己認識</span>
        </div>
        <h3 className="text-lg sm:text-xl font-black text-amber-300">
          {hostNickname}さんの自称ラベル「{selfLabel}」
        </h3>
        <p className="text-xs text-slate-400">
          これがあなたが思っている自分です。でも、友達から見たらどう見えているでしょうか…？
        </p>
      </div>

      <div className="max-w-md mx-auto bg-slate-950 border border-amber-500/40 rounded-2xl overflow-hidden shadow-lg">
        <div className="aspect-square bg-slate-950 relative overflow-hidden group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={selfData.img}
            alt={`${hostNickname}さんの自認`}
            className="w-full h-full object-cover"
          />
          {/* ふきだし */}
          <div className="absolute top-4 right-3 bg-white text-slate-900 px-3 py-1.5 rounded-2xl rounded-tr-none shadow-xl border-2 border-amber-400 font-black text-xs drop-shadow-md whitespace-pre-line leading-tight">
            {selfData.bubble}
          </div>
        </div>

        <div className="p-4 bg-slate-950/90 text-center space-y-1">
          <p className="text-xs font-bold text-amber-300">
            {selfData.thought}
          </p>
          <p className="text-[11px] text-slate-400">
            {selfData.desc}
          </p>
        </div>
      </div>

      <div className="text-center p-3 bg-pink-500/10 border border-pink-500/30 rounded-2xl">
        <p className="text-xs font-bold text-pink-300">
          🔒 友達が回答すると、右側に「周囲から見たあなたの姿」がアンロックされます！
        </p>
      </div>
    </div>
  );
};
