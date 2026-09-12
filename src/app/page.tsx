import Link from 'next/link';
import { Sparkles, Users, ArrowRight, Heart, ShieldCheck, Zap, HelpCircle } from 'lucide-react';
import { RecentSessionCard } from '@/components/RecentSessionCard';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-slate-50 via-indigo-50/20 to-slate-100">
      <div className="max-w-md w-full text-center space-y-6 py-6">
        {/* バッジ */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-200 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-500" />
          <span>科学的ビッグファイブ × 周囲の目</span>
        </div>

        {/* メインコピー */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
            GAP-FIVE
          </h1>
          <p className="text-base sm:text-lg font-bold text-slate-700">
            自称と実態の「ズレ」を暴く性格ギャップ診断
          </p>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
            あなたは自分をどう思っていて、友達からはどう見えている？
            自己診断と他者評価を重ね合わせ、あなたの「真の二つ名」を解き明かします。
          </p>
        </div>

        {/* 診断結果サンプルカード（直感的にイメージが湧くモックアップ） */}
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-5 text-white shadow-xl text-left space-y-3.5 border border-indigo-500/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-amber-300 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
              診断結果サンプル
            </span>
            <span className="text-[10px] text-slate-400">友達3名の評価で確定</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold text-slate-400 block">確定した二つ名</span>
            <div className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-400">
              『隠れ熱血の慎重バランサー』
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
              <span className="text-[10px] text-blue-300 font-bold block">本人の自認</span>
              <span className="font-bold text-slate-200 text-xs">控えめなサポート役</span>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 space-y-0.5">
              <span className="text-[10px] text-rose-300 font-bold block">周囲の実態</span>
              <span className="font-bold text-slate-200 text-xs">頼れる切り込み隊長</span>
            </div>
          </div>

          <div className="pt-1 flex items-center justify-between text-[11px] bg-white/5 p-2.5 rounded-xl border border-white/5">
            <div className="flex items-center gap-1.5 font-bold text-rose-300">
              <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
              <span>友人との波長シンクロ度</span>
            </div>
            <span className="font-black text-amber-300 text-sm">88% (最強タッグ)</span>
          </div>
        </div>

        {/* 前回の診断復帰カード */}
        <RecentSessionCard />

        {/* 診断開始ボタン */}
        <div className="pt-1 space-y-2">
          <Link
            href="/diagnose"
            className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-base sm:text-lg shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>無料で診断をはじめる（約2分）</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-[11px] text-slate-400">
            ※面倒な会員登録やメールアドレスの入力は一切不要です
          </p>
        </div>

        {/* 3つの安心ポイント */}
        <div className="grid grid-cols-3 gap-2 pt-2 text-center">
          <div className="p-2.5 rounded-2xl bg-white border border-slate-100 shadow-2xs space-y-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500 mx-auto" />
            <span className="block text-[11px] font-bold text-slate-700">登録不要</span>
            <span className="block text-[9px] text-slate-400">個人情報の入力なし</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-white border border-slate-100 shadow-2xs space-y-1">
            <Zap className="w-4 h-4 text-amber-500 mx-auto" />
            <span className="block text-[11px] font-bold text-slate-700">10問・2分</span>
            <span className="block text-[9px] text-slate-400">直感タップですぐ完了</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-white border border-slate-100 shadow-2xs space-y-1">
            <Users className="w-4 h-4 text-blue-500 mx-auto" />
            <span className="block text-[11px] font-bold text-slate-700">完全匿名集計</span>
            <span className="block text-[9px] text-slate-400">誰の点数かは非公開</span>
          </div>
        </div>

        <footer className="pt-6 pb-2 text-center text-xs text-slate-400 space-x-3">
          <Link href="/privacy" className="hover:text-slate-600 hover:underline">
            プライバシーポリシー
          </Link>
          <span>•</span>
          <Link href="/terms" className="hover:text-slate-600 hover:underline">
            利用規約
          </Link>
          <span>•</span>
          <Link href="/legal" className="hover:text-slate-600 hover:underline">
            特定商取引法に基づく表記
          </Link>
          <p className="pt-2 text-[11px] text-slate-300">
            © {new Date().getFullYear()} GAP-FIVE. All rights reserved.
          </p>
        </footer>
      </div>
    </main>
  );
}
