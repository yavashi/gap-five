import React from 'react';
import { RadarChart } from './RadarChart';
import { Sparkles, Users, ArrowRight, Heart } from 'lucide-react';
import Link from 'next/link';

export const SampleResultShowcase: React.FC = () => {
  // サンプルデータ（脳内フェス野郎：外向性の大きなギャップ）
  const sampleSelfScores = { E: 6.2, A: 5.0, C: 4.2, S: 5.5, O: 5.8 };
  const samplePeerScores = { E: 2.3, A: 5.2, C: 4.5, S: 4.8, O: 4.0 };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-xl border border-indigo-100 text-left space-y-6 relative overflow-hidden">
      {/* 背景の装飾光 */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-pink-100 to-indigo-100 rounded-full blur-3xl pointer-events-none -z-0 opacity-70" />

      {/* サンプルヘッダー */}
      <div className="space-y-2 relative z-10">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500/10 to-indigo-500/10 text-indigo-700 text-xs font-black border border-indigo-200">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>診断結果の見本サンプル</span>
          </span>
          <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-0.5 rounded-full">
            友達3名回答時の実例
          </span>
        </div>

        <div>
          <div className="text-xs text-slate-400 font-bold">
            確定した二つ名（ギャップ称号）
          </div>
          <h3 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 via-purple-600 to-indigo-600">
            『脳内フェス野郎』
          </h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            心の中では陽気なパーティー野郎のつもりだが、出力が控えめすぎて周囲にはクールな無口に見えているタイプ！
          </p>
        </div>
      </div>

      {/* 2枚のイラスト対比カード */}
      <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 relative z-10">
        {/* 左：自己評価 */}
        <div className="bg-amber-50/60 border-2 border-amber-300/80 rounded-2xl overflow-hidden flex flex-col shadow-xs">
          <div className="px-3 py-1.5 bg-amber-400/20 border-b border-amber-300/60 flex items-center justify-between">
            <span className="text-[11px] font-black text-amber-900 uppercase tracking-wider">
              本人の自認（MY VIEW）
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-200 text-amber-900 font-bold">
              自称ラベル
            </span>
          </div>

          <div className="aspect-square bg-slate-900 relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/gap-samples/foo_clean_self.jpg"
              alt="本人の自認イメージ"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 right-2.5 bg-white text-slate-900 px-2.5 py-1 rounded-xl rounded-tr-none shadow-lg border border-amber-400 font-black text-[11px] leading-tight">
              「みんな〜！<br />今日も乾杯しよ〜！🍹」
            </div>
          </div>

          <div className="p-3 bg-white/80 space-y-0.5">
            <div className="text-[10px] text-amber-700 font-bold">自称タイプ</div>
            <div className="text-xs font-black text-slate-900">情熱のインフルエンサー</div>
            <p className="text-[10px] text-slate-500">「自分は社交的で場を盛り上げる人気者！」</p>
          </div>
        </div>

        {/* 右：周囲から見た印象 */}
        <div className="bg-pink-50/60 border-2 border-pink-400/80 rounded-2xl overflow-hidden flex flex-col shadow-xs">
          <div className="px-3 py-1.5 bg-pink-500/20 border-b border-pink-400/60 flex items-center justify-between">
            <span className="text-[11px] font-black text-pink-900 uppercase tracking-wider">
              周囲から見た姿（THE GAP）
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-pink-200 text-pink-900 font-bold animate-pulse">
              確定二つ名
            </span>
          </div>

          <div className="aspect-square bg-slate-900 relative overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/gap-samples/foo_clean_gap.jpg"
              alt="周囲から見た姿"
              className="w-full h-full object-cover"
            />
            <div className="absolute top-2.5 right-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-2 py-0.5 rounded-lg font-black text-[10px] shadow-md border border-yellow-300 animate-bounce">
              「ウオオ！脳内フェス中🕺」
            </div>
            <div className="absolute bottom-2.5 left-2 bg-slate-900/95 text-pink-200 px-2.5 py-1 rounded-xl rounded-bl-none shadow-lg border border-pink-500 font-bold text-[10px] max-w-[170px] leading-tight">
              「……あの人一言も喋らずストロー吸ってない？」
            </div>
          </div>

          <div className="p-3 bg-white/80 space-y-0.5">
            <div className="text-[10px] text-pink-700 font-bold">暴かれた実態</div>
            <div className="text-xs font-black text-slate-900">脳内フェス野郎</div>
            <p className="text-[10px] text-slate-500">「頭の中は大爆音、見た目は冷静沈着！」</p>
          </div>
        </div>
      </div>

      {/* レーダーチャートによる科学的ギャップ可視化 */}
      <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3 relative z-10">
        <div className="text-center space-y-0.5">
          <div className="inline-block text-[11px] font-extrabold text-blue-700 bg-blue-100/70 px-2.5 py-0.5 rounded-full">
            ビッグファイブ性格特性の比較
          </div>
          <p className="text-xs text-slate-600 font-bold">
            自己評価（青）と他者平均（赤）のズレがひと目でわかる！
          </p>
        </div>

        <div className="py-1">
          <RadarChart
            selfScores={sampleSelfScores}
            peerScores={samplePeerScores}
            className="max-w-[280px]"
          />
        </div>

        {/* ズレの要約 */}
        <div className="grid grid-cols-2 gap-2 text-center pt-1 border-t border-slate-200/60">
          <div className="p-2 bg-white rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 block">外向性（社交性）のズレ</span>
            <span className="text-sm font-black text-pink-600">-3.9 pt（大ギャップ💥）</span>
          </div>
          <div className="p-2 bg-white rounded-xl border border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 block">友人との波長シンクロ度</span>
            <span className="text-sm font-black text-indigo-600">62%（伸びしろあり✨）</span>
          </div>
        </div>
      </div>

      {/* サンプルフッター誘導 */}
      <div className="text-center space-y-2 relative z-10 pt-1">
        <p className="text-xs text-slate-500">
          あなたと友達の間にはどんなギャップが潜んでいるでしょうか？
        </p>
        <Link
          href="/style-preview"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
        >
          <span>他のキャラクター見本（全10タイプ）を見る</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
};
