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
            自己診断（フリ）と、他者評価によって暴かれた【認知のズレ（オチ）】の対比カードです。<br />
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
                {/* 左：自己認識（フリ） */}
                <div className="bg-slate-900 border-2 border-amber-500/40 rounded-3xl overflow-hidden flex flex-col shadow-2xl relative">
                  <div className="p-4 bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-b border-amber-500/30 flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-amber-300">
                      Step 1：自己診断時（フリ）
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

                {/* 右：他者評価で暴かれたズレ（オチ） */}
                <div className="bg-slate-900 border-2 border-pink-500/50 rounded-3xl overflow-hidden flex flex-col shadow-2xl relative">
                  <div className="p-4 bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-b border-pink-500/30 flex items-center justify-between">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-pink-300">
                      Step 2：他者評価集約後（オチ）
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-pink-500/20 text-pink-300 font-bold animate-pulse">
                      THE GAP（暴かれたズレ）
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
