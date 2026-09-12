import React from 'react';

interface GapVisualCardProps {
  hostNickname: string;
  selfLabel: string;
  gapName: string;
  gapTrait?: string;
  gapType?: 'over' | 'under';
}

interface GapVisualData {
  selfImg: string;
  gapImg: string;
  selfBubble: string;
  gapBubble: string;
  gapSubBubble?: string;
  selfThought: string;
  gapReality: string;
}

const GAP_VISUAL_MAP: Record<string, GapVisualData> = {
  // E_over: 脳内フェス野郎
  '脳内フェス野郎': {
    selfImg: '/gap-samples/foo_clean_self.jpg',
    gapImg: '/gap-samples/foo_clean_gap.jpg',
    selfBubble: '「みんな〜！\n今日も乾杯しよ〜！🍹✨」',
    gapBubble: '「……あの人、さっきから一言も喋らずストロー吸ってない？」',
    gapSubBubble: '「ウオオオ！フェス最高ー！！🕺🎶」',
    selfThought: '「自分は社交的で明るいムードメーカーだな〜」',
    gapReality: '周囲には無言・無表情でタピオカを吸うおとなしい人に見えているが、頭の中では星型サングラスで爆音レーザーのフェスを開催中。',
  },
  // E_under: ステルス社交モンスター
  'ステルス社交モンスター': {
    selfImg: '/gap-samples/stealth_clean_self.jpg',
    gapImg: '/gap-samples/stealth_gap_monster.jpg',
    selfBubble: '「週末は家で読書と猫…\nこれが最高の幸せ☕️📖」',
    gapBubble: '「コミュ力高すぎ！\nマジで場の神じゃん！🍻」',
    gapSubBubble: '「残HP 1%…もう限界…😇」',
    selfThought: '「私は一人が大好きな根っからのインドア派」',
    gapReality: '居酒屋で営業スマイルとお酌を完璧にこなして場を制圧しているが、頭上のバッテリーは1%で黒煙噴出。目はグルグル限界寸前。',
  },
  // A_under: ツンデレ無自覚マザーテレサ
  'ツンデレ無自覚マザーテレサ': {
    selfImg: '/gap-samples/tsundere_clean_self.jpg',
    gapImg: '/gap-samples/tsundere_clean_gap.jpg',
    selfBubble: '「数字と論理しか信じない。\n情に流されるのは非効率📊」',
    gapBubble: '「べ、別に心配してないわよ！\n肉まんが余ってただけだから！😤」',
    gapSubBubble: '後輩：「先輩…神様ですか…😭」',
    selfThought: '「私は損得勘定とロジックで動く冷徹な合理主義者」',
    gapReality: '雨の中、捨て猫に傘を差し出し、泣いてる後輩に肉まんとホット缶を渡しつつ、顔だけは頑なに「フン！」とそっぽを向いている。',
  },
};

export const GapVisualCard: React.FC<GapVisualCardProps> = ({
  hostNickname,
  selfLabel,
  gapName,
}) => {
  const visualData = GAP_VISUAL_MAP[gapName];

  // 画像が用意されているタイプの場合、2枚の対比カードを表示
  if (visualData) {
    return (
      <div className="bg-slate-900 rounded-3xl p-5 sm:p-7 text-white shadow-xl border border-slate-800 space-y-5">
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 text-xs font-bold border border-pink-500/30">
            <span>🎭</span>
            <span>自認と周囲の目のギャップ可視化</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-pink-300 to-indigo-300">
            {hostNickname}さんの「自認」vs「暴かれたズレ」
          </h2>
          <p className="text-xs text-slate-400">
            あなたが思い込んでいた自分と、他者評価が集まって暴かれた実態の落差です。
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          {/* 左：自己認識（フリ） */}
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
                src={visualData.selfImg}
                alt={`${hostNickname}さんの自認`}
                className="w-full h-full object-cover"
              />
              {/* 日本語ふきだしオーバーレイ */}
              <div className="absolute top-4 right-3 bg-white text-slate-900 px-3 py-1.5 rounded-2xl rounded-tr-none shadow-xl border-2 border-amber-400 font-black text-xs drop-shadow-md whitespace-pre-line leading-tight">
                {visualData.selfBubble}
              </div>
            </div>

            <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-black text-amber-300">
                  「{selfLabel}」
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  {visualData.selfThought}
                </p>
              </div>
            </div>
          </div>

          {/* 右：暴かれたズレ（オチ） */}
          <div className="bg-slate-950/80 border-2 border-pink-500/60 rounded-2xl overflow-hidden flex flex-col shadow-lg">
            <div className="px-3.5 py-2 bg-pink-500/20 border-b border-pink-500/30 flex items-center justify-between">
              <span className="text-[11px] font-black text-pink-300 uppercase tracking-wider">
                暴かれた実態（THE GAP）
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-pink-500/30 text-pink-200 font-bold animate-pulse">
                確定二つ名
              </span>
            </div>

            <div className="aspect-square bg-slate-950 relative overflow-hidden group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={visualData.gapImg}
                alt={`${hostNickname}さんのズレ`}
                className="w-full h-full object-cover"
              />
              {/* サブふきだし（本音/叫び） */}
              {visualData.gapSubBubble && (
                <div className="absolute top-3 right-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-2.5 py-1 rounded-xl rounded-tr-none shadow-xl border border-yellow-300 font-black text-[11px] animate-bounce drop-shadow-md">
                  {visualData.gapSubBubble}
                </div>
              )}
              {/* 周囲のツッコミふきだし */}
              <div className="absolute bottom-12 left-3 bg-slate-900/95 text-pink-200 px-3 py-1.5 rounded-2xl rounded-bl-none shadow-xl border border-pink-500 font-bold text-xs backdrop-blur-sm max-w-[200px] leading-tight drop-shadow-md whitespace-pre-line">
                {visualData.gapBubble}
              </div>
            </div>

            <div className="p-3.5 space-y-1.5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-300">
                  「{gapName}」
                </h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {visualData.gapReality}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // まだイラストが未生成のタイプ向け（スタイリッシュな対比カードプレースホルダー）
  return (
    <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-6 text-white shadow-xl border border-slate-800 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider">
          自認と他者評価の摩擦
        </span>
        <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold">
          ギャップ分析
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3 text-center">
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
          <span className="text-xs text-slate-400 block">本人の自己自認</span>
          <span className="font-black text-sm text-amber-300 block">「{selfLabel}」</span>
        </div>
        <div className="p-4 rounded-2xl bg-pink-500/10 border border-pink-500/20 space-y-1">
          <span className="text-xs text-pink-300 block">暴かれた実態</span>
          <span className="font-black text-sm text-pink-400 block">「{gapName}」</span>
        </div>
      </div>
    </div>
  );
};
