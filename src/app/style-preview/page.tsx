import React from 'react';

export default function StylePreviewPage() {
  const characters = [
    {
      id: 'foo',
      title: '① 脳内フェス野郎（E_over）',
      hostName: 'ふーさん',
      self: {
        label: '情熱のインフルエンサー',
        img: '/gap-samples/foo_clean_self.jpg',
        bubble: '「みんな〜！\n今日も乾杯しよ〜！🍹✨」',
        bubblePos: 'top-6 right-4',
        bubbleStyle: 'bg-white text-slate-900 border-amber-400',
        thought: '「自分は社交的で明るいムードメーカーだな〜」',
        desc: '本人の自認：パーティーの主役として、みんなと太陽のように乾杯して盛り上げている陽気な人気者。',
      },
      gap: {
        label: '脳内フェス野郎',
        img: '/gap-samples/foo_clean_gap.jpg',
        bubble: '「……あの人、さっきから一言も喋らずストロー吸ってない？」',
        bubblePos: 'bottom-16 left-3',
        bubbleStyle: 'bg-slate-900/95 text-pink-200 border-pink-500',
        subBubble: '「ウオオオ！フェス最高ー！！🕺🎶」',
        witness: '周囲の証言：「心の中では全員と乾杯してるらしいが、出力ポートが狭すぎて周囲にはクールに見えている」',
        desc: '暴かれた実態：周囲には無言・無表情でタピオカを吸い続けるおとなしい人に見えているが、頭の中では星型サングラスをかけて爆音レーザーのフェスを開催中。',
      },
    },
    {
      id: 'stealth',
      title: '② ステルス社交モンスター（E_under）',
      hostName: 'レンさん',
      self: {
        label: '静寂を愛する孤高の観察者',
        img: '/gap-samples/stealth_clean_self.jpg',
        bubble: '「週末は家で読書と猫…\nこれが最高の幸せ☕️📖」',
        bubblePos: 'top-6 right-4',
        bubbleStyle: 'bg-white text-slate-900 border-emerald-400',
        thought: '「私は一人が大好きな根っからの内向型だな〜」',
        desc: '本人の自認：日だまりの部屋で猫と本とコーヒーを愛する、静かで穏やかな内向的人間。',
      },
      gap: {
        label: 'ステルス社交モンスター',
        img: '/gap-samples/stealth_gap_monster.jpg',
        bubble: '「レンくんコミュ力高すぎ！\nマジで場の神じゃん！🍻」',
        bubblePos: 'bottom-14 left-3',
        bubbleStyle: 'bg-slate-900/95 text-emerald-200 border-emerald-500',
        subBubble: '「残HP 1%…もう限界…😇」',
        witness: '周囲の証言：「内面ではHPを激しく消耗しているが、社会性フィルターが優秀すぎて周囲からはコミュ力お化けに見えている」',
        desc: '暴かれた実態：居酒屋で神業のような営業スマイルとお酌を繰り出し場を制覇しているが、頭上のバッテリーは1%で黒煙を噴出。目はグルグル限界寸前。',
      },
    },
    {
      id: 'tsundere',
      title: '③ ツンデレ無自覚マザーテレサ（A_under）',
      hostName: 'アスカさん',
      self: {
        label: '冷徹なるリアリスト',
        img: '/gap-samples/tsundere_clean_self.jpg',
        bubble: '「私は数字と論理しか信じない。\n情に流されるのは非効率よ📊」',
        bubblePos: 'top-6 right-4',
        bubbleStyle: 'bg-white text-slate-900 border-blue-400',
        thought: '「私は損得勘定とロジックで動く冷徹な合理主義者」',
        desc: '本人の自認：夜景オフィスでデータを冷静に分析する、感情を排除したクールな客観主義者。',
      },
      gap: {
        label: 'ツンデレ無自覚マザーテレサ',
        img: '/gap-samples/tsundere_clean_gap.jpg',
        bubble: '「べ、別に心配してないわよ！\n肉まんが余ってただけだから！😤」',
        bubblePos: 'top-8 right-3',
        bubbleStyle: 'bg-white text-slate-900 border-rose-400',
        subBubble: '後輩：「先輩…神様ですか…😭」',
        witness: '周囲の証言：「『損得で動いている』と本人は嘯くが、行動の端々に面倒見の良さがダダ漏れている」',
        desc: '暴かれた実態：雨の中、捨て猫に傘を差し出し、泣いてる後輩にアツアツの肉まんと温かい缶コーヒーを渡しつつ、顔だけは頑なに「フン！」とそっぽを向いている。',
      },
    },
    {
      id: 'acrobat',
      title: '④ 崖っぷちの神業アクロバット（C_under）',
      hostName: 'ショウタさん',
      self: {
        label: '型破りなインプロバイザー',
        img: '/gap-samples/acrobat_clean_self.jpg',
        bubble: '「計画なんて縛られたくない。\n直感とアドリブが俺の流儀🎸」',
        bubblePos: 'top-6 right-4',
        bubbleStyle: 'bg-white text-slate-900 border-amber-400',
        thought: '「自分はいつも行き当たりばったりの自由人」',
        desc: '本人の自認：ギターとデザインスケッチに囲まれてペンを回し、気ままなアドリブで生きる自由人。',
      },
      gap: {
        label: '崖っぷちの神業アクロバット',
        img: '/gap-samples/acrobat_clean_gap.jpg',
        bubble: '「奇跡の神プレゼンだ…！\n全米が泣いた完璧な仕事…！😭👏」',
        bubblePos: 'bottom-16 left-3',
        bubbleStyle: 'bg-slate-900/95 text-yellow-200 border-yellow-500',
        subBubble: '「えっ…通っちゃった…？（白目）」',
        witness: '周囲の証言：「本人の体感はいつも泥縄だが、土壇場の帳尻合わせが完璧すぎて周囲からは超有能に見えている」',
        desc: '暴かれた実態：本人は締め切り23:59:59に命からがら提出して煙を吹きながら呆然としているが、スクリーンには金賞の完璧な仕事が表示され、役員たちが感涙のスタンディングオベーション。',
      },
    },
    {
      id: 'scalpel',
      title: '⑤ 切れ味抜群の善意のメス（A_over）',
      hostName: 'マサトさん',
      self: {
        label: '慈悲深きガーディアン',
        img: '/gap-samples/scalpel_clean_self.jpg',
        bubble: '「みんなの役に立ちたい…\n愛と善意で支えるわ🍲✨」',
        bubblePos: 'top-6 right-4',
        bubbleStyle: 'bg-white text-slate-900 border-rose-400',
        thought: '「私は誰にでも優しく尽くす博愛主義者」',
        desc: '本人の自認：温かいスープを差し出し、慈悲深い聖母のような笑顔で誰かを守りたい心優しきガーディアン。',
      },
      gap: {
        label: '切れ味抜群の善意のメス',
        img: '/gap-samples/scalpel_clean_gap.jpg',
        bubble: '「正論すぎて刺さりまくる…！\n切れ味エグい…！😱🩸」',
        bubblePos: 'bottom-14 left-3',
        bubbleStyle: 'bg-slate-900/95 text-rose-200 border-rose-500',
        subBubble: '「純度100%の善意です✨（巨大メス）」',
        witness: '周囲の証言：「相手を想っての正論だが、オブラートを省くため周囲からは切れ者として恐れられている」',
        desc: '暴かれた実態：本人は心からの善意と慈悲のキラキラ笑顔だが、オブラートを削ぎ落とした正論のメスが巨大すぎて、周囲は失血死寸前の戦慄状態。',
      },
    },
    {
      id: 'blueprint',
      title: '⑥ 白紙の設計図マスター（C_over）',
      hostName: 'タクミさん',
      self: {
        label: '緻密なグランドデザイナー',
        img: '/gap-samples/blueprint_clean_self.jpg',
        bubble: '「緻密な計画こそが成功の鍵。\n全ては計算通りだ📐✨」',
        bubblePos: 'top-6 right-4',
        bubbleStyle: 'bg-white text-slate-900 border-blue-400',
        thought: '「自分は抜け目なく計画を練るグランドデザイナー」',
        desc: '本人の自認：未来的で精密な設計図の前で知的な眼鏡を光らせ、完璧なタイムラインを計算する策士。',
      },
      gap: {
        label: '白紙の設計図マスター',
        img: '/gap-samples/blueprint_clean_gap.jpg',
        bubble: '「白紙じゃねえかーーっ！！\n全部アドリブかよ！？😱💥」',
        bubblePos: 'bottom-16 left-3',
        bubbleStyle: 'bg-slate-900/95 text-cyan-200 border-cyan-500',
        subBubble: '「頭の中にはあるから（😊）」',
        witness: '周囲の証言：「頭の中では完璧な計画があるが、アドリブで動きすぎて周囲からは自由人に見えている」',
        desc: '暴かれた実態：完璧な青写真を持っていると豪語していたが、広げた設計図はまさかの完全白紙（ニコちゃんマーク付）。同僚たちの阿鼻叫喚をよそに本人は涼しい顔。',
      },
    },
    {
      id: 'armor',
      title: '⑦ ガラスの防弾チョッキ（S_over）',
      hostName: 'リュウジさん',
      self: {
        label: '泰然自若のアイアンハート',
        img: '/gap-samples/armor_clean_self.jpg',
        bubble: '「何があっても動じない。\n我が心は鋼の鎧なり🛡️⚡️」',
        bubblePos: 'top-6 right-4',
        bubbleStyle: 'bg-white text-slate-900 border-amber-400',
        thought: '「自分はタフでメンタル強靭なアイアンハート」',
        desc: '本人の自認：頑丈なチタンの鎧に身を包み、嵐の中でも泰然と仁王立ちする不屈の騎士。',
      },
      gap: {
        label: 'ガラスの防弾チョッキ',
        img: '/gap-samples/armor_clean_gap.jpg',
        bubble: '「お願い誰も刺激しないで…！\nヒビ入っちゃうから…！😭💦」',
        bubblePos: 'bottom-16 left-3',
        bubbleStyle: 'bg-slate-900/95 text-amber-200 border-amber-500',
        subBubble: '「胃が痛い…胃薬どこ…💊」',
        witness: '周囲の証言：「『全然平気』と強がっているが、周囲は微小な動揺を察知して気を遣っている」',
        desc: '暴かれた実態：重厚な鎧を着てドヤ顔しているが、胸部だけ極薄のガラス製。雨粒1滴でピキッと亀裂が入り、周囲はクッションを抱えて腫れ物を触るように過保護介護中。',
      },
    },
    {
      id: 'swan',
      title: '⑧ 水面の白鳥（脚は激突中）（S_under）',
      hostName: 'ハヤトさん',
      self: {
        label: '繊細なるクリスタルセンサー',
        img: '/gap-samples/swan_clean_self.jpg',
        bubble: '「心静かに瞑想中…\n私は何事にも動じない🧘‍♂️」',
        bubblePos: 'top-6 right-4',
        bubbleStyle: 'bg-white text-slate-900 border-purple-400',
        thought: '「私は落ち着き払ったポーカーフェイスを保てている」',
        desc: '本人の自認：池のほとりで静かに目を閉じ、風のそよぎにも平穏を保つ瞑想的で冷静な人物。',
      },
      gap: {
        label: '水面の白鳥（脚は激突中）',
        img: '/gap-samples/swan_clean_gap.jpg?v=2',
        bubble: '「顔は澄ましてるけど…\n足の激漕ぎバレバレだよ！！😂💥」',
        bubblePos: 'bottom-16 left-3',
        bubbleStyle: 'bg-slate-900/95 text-indigo-200 border-indigo-500',
        subBubble: '「必死漕ぎで音速爆走中🦢💨」',
        witness: '周囲の証言：「クールを装っているつもりらしいが、焦りと必死さが周囲には完全にダダ漏れている」',
        desc: '暴かれた実態：本人は腕組みして悟りを開いたようにクールを装っているが、顔には冷や汗、スワンボートのペダルを音速で激漕ぎして水煙を噴き上げており、必死の焦りが周囲に丸見えで大爆笑されている。',
      },
    },
    {
      id: 'secret_base',
      title: '⑨ 秘密基地の空想科学者（O_over）',
      hostName: 'ヒロシさん',
      self: {
        label: '未踏を拓くヴィジョナリー',
        img: '/gap-samples/secret_base_clean_self.jpg',
        bubble: '「未来を創るヴィジョンが見える。\n世界を変えるのは私だ🚀🌌」',
        bubblePos: 'top-6 right-4',
        bubbleStyle: 'bg-white text-slate-900 border-indigo-400',
        thought: '「自分は時代を先取るハイテック・ヴィジョナリー」',
        desc: '本人の自認：サイバーパンクな夜景を見下ろし、タブレットで世界を変える新コンセプトを描く先駆者。',
      },
      gap: {
        label: '秘密基地の空想科学者',
        img: '/gap-samples/secret_base_clean_gap.jpg?v=2',
        bubble: '「……あいつ、さっきから机の下で\nペットボトル銃構えて何と戦ってんの…？😨」',
        bubblePos: 'bottom-16 left-3',
        bubbleStyle: 'bg-slate-900/95 text-emerald-200 border-emerald-500',
        subBubble: '「最終兵器、起動まであと3分…（真顔）」',
        witness: '周囲の証言：「頭の中は奇想天外なアイデアで溢れているが、普段は常識人の仮面を被っている」',
        desc: '暴かれた実態：頭の中ではサイバーパンクの天才ヴィジョナリーだが、実態はオフィスの引き出しにガラクタとアルミホイルで作った「秘密兵器」を隠し持ち、真顔で世界を救う妄想をしている永遠の厨二病。',
      },
    },
    {
      id: 'innovator',
      title: '⑩ 天然記念物級イノベーター（O_under）',
      hostName: 'アオイさん',
      self: {
        label: '質実剛健のリアリズムアンカー',
        img: '/gap-samples/innovator_clean_self.jpg',
        bubble: '「普通が一番。私はどこにでもいる\n真面目で堅実な整備士です🌱」',
        bubblePos: 'top-6 right-4',
        bubbleStyle: 'bg-white text-slate-900 border-emerald-400',
        thought: '「自分は地に足のついた堅実な常識人」',
        desc: '本人の自認：作業場で工具を几帳面に整理し、誰よりも真面目に目の前の修理をこなす普通の職人。',
      },
      gap: {
        label: '天然記念物級イノベーター',
        img: '/gap-samples/innovator_clean_gap.jpg?v=2',
        bubble: '「パンク修理頼んだのに…\nなんで空飛んでんのーーっ！？😱🚀」',
        bubblePos: 'bottom-16 left-3',
        bubbleStyle: 'bg-slate-900/95 text-amber-200 border-amber-500',
        subBubble: '「え？普通に直しただけだけど…？🔧」',
        witness: '周囲の証言：「本人は至って普通だと思っているが、作ったものと発想が人外レベルの異次元イノベーター」',
        desc: '暴かれた実態：「ちょっとパンク直しただけ」と言いながら反重力ホバーバイクを爆誕させてキョトン顔。依頼主や近所の客が腰を抜かして絶叫しており、本人だけが自分の異次元さに気づいていない。',
      },
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-16">
        {/* ヘッダー */}
        <div className="text-center space-y-3">
          <div className="inline-block px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-bold border border-emerald-500/30">
            完全テキストフリー ＆ 漫画ふきだし重ね（本番仕様ギャラリー）
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-400 to-indigo-400">
            GAP-FIVE ギャップ対比ギャラリー
          </h1>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
            自己評価（MY VIEW）と、他者評価によって見えてきた【客観的な実態（THE GAP）】の対比カードです。<br />
            イラストから不要な文字を完全排除し、Web側で日本語ふきだしをオーバーレイしています。
          </p>
        </div>

        {/* キャラクター対比カード一覧 */}
        <div className="space-y-16">
          {characters.map((char) => (
            <div key={char.id} className="space-y-4 pt-4 border-t border-slate-800">
              <h2 className="text-2xl font-black text-white flex items-center gap-2">
                <span>🎭</span> {char.title}
                <span className="text-xs font-normal text-slate-400 ml-2">（被診断者：{char.hostName}）</span>
              </h2>

              <div className="grid md:grid-cols-2 gap-8 items-stretch">
                {/* 左：自己認識（MY VIEW） */}
                <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl overflow-hidden flex flex-col shadow-2xl relative">
                  <div className="p-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-b border-amber-500/30 flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-amber-300">
                      Step 1：自己評価（MY VIEW）
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 font-bold">
                      MY VIEW（本人の自認）
                    </span>
                  </div>

                  <div className="aspect-square bg-slate-950 relative overflow-hidden group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={char.self.img}
                      alt={`${char.hostName}の自認`}
                      className="w-full h-full object-cover"
                    />

                    {/* Web側で重ねた鮮明な日本語ふきだし */}
                    <div className={`absolute ${char.self.bubblePos} ${char.self.bubbleStyle} px-3.5 py-2 rounded-2xl rounded-tr-none shadow-2xl border-2 font-black text-xs sm:text-sm drop-shadow-lg whitespace-pre-line`}>
                      {char.self.bubble}
                    </div>
                  </div>

                  <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xs text-amber-400 font-semibold mb-1">自称ラベル</div>
                      <h3 className="text-xl font-black text-white">「{char.self.label}」</h3>
                      <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                        {char.self.desc}
                      </p>
                    </div>
                    <div className="text-xs bg-slate-800/80 text-amber-300/80 p-3 rounded-xl border border-amber-500/20">
                      💭 {char.self.thought}
                    </div>
                  </div>
                </div>

                {/* 右：他者評価で明らかになった客観視点 */}
                <div className="bg-slate-900 border-2 border-pink-500/50 rounded-3xl overflow-hidden flex flex-col shadow-2xl relative">
                  <div className="p-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-b border-pink-500/30 flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-pink-300">
                      Step 2：他者評価（OTHERS' VIEW）
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-bold animate-pulse">
                      THE GAP（周囲から見た実態）
                    </span>
                  </div>

                  <div className="aspect-square bg-slate-950 relative overflow-hidden group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={char.gap.img}
                      alt={`${char.hostName}のズレ`}
                      className="w-full h-full object-cover"
                    />

                    {/* サブふきだし（本人の本音／叫び） */}
                    {char.gap.subBubble && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-3 py-1.5 rounded-2xl rounded-tr-none shadow-2xl border-2 border-yellow-300 font-black text-xs sm:text-sm animate-bounce drop-shadow-md">
                        {char.gap.subBubble}
                      </div>
                    )}

                    {/* 周囲のツッコミふきだし */}
                    <div className={`absolute ${char.gap.bubblePos} ${char.gap.bubbleStyle} px-3 py-2 rounded-2xl rounded-bl-none shadow-2xl border-2 font-bold text-xs sm:text-sm backdrop-blur-sm max-w-[220px] leading-tight drop-shadow-lg whitespace-pre-line`}>
                      {char.gap.bubble}
                    </div>
                  </div>

                  <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xs text-pink-400 font-semibold mb-1">確定二つ名（ズレ）</div>
                      <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-300">
                        「{char.gap.label}」
                      </h3>
                      <p className="text-sm text-slate-300 mt-2 leading-relaxed">
                        {char.gap.desc}
                      </p>
                    </div>
                    <div className="text-xs bg-pink-950/40 text-pink-300 p-3 rounded-xl border border-pink-500/30 font-medium">
                      💥 {char.gap.witness}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
