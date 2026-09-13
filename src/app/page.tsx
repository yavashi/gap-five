import Link from 'next/link';
import { Sparkles, Users, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { RecentSessionCard } from '@/components/RecentSessionCard';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 bg-gradient-to-b from-slate-50 via-indigo-50/20 to-slate-100">
      <div className="max-w-xl w-full text-center space-y-6 py-6">
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
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
            あなたは自分をどう思っていて、友達からはどう見えている？
            自己診断と他者評価を重ね合わせ、あなたの「真の二つ名」を解き明かします。
          </p>
        </div>

        {/* 診断開始ボタン（ファーストビュー直結） */}
        <div className="pt-2 space-y-2">
          <Link
            href="/diagnose"
            className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-black text-base sm:text-lg shadow-xl shadow-blue-500/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>無料で診断をはじめる（約1分）</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-[11px] text-slate-400">
            ※面倒な会員登録やメールアドレスの入力は一切不要です
          </p>
        </div>

        {/* 3つの安心ポイント */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
            <ShieldCheck className="w-4 h-4 text-emerald-500 mx-auto" />
            <span className="block text-[11px] font-bold text-slate-700">登録不要</span>
            <span className="block text-[9px] text-slate-400">個人情報の入力なし</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
            <Zap className="w-4 h-4 text-amber-500 mx-auto" />
            <span className="block text-[11px] font-bold text-slate-700">10問・1分</span>
            <span className="block text-[9px] text-slate-400">直感タップですぐ完了</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-1">
            <Users className="w-4 h-4 text-blue-500 mx-auto" />
            <span className="block text-[11px] font-bold text-slate-700">完全匿名集計</span>
            <span className="block text-[9px] text-slate-400">誰の点数かは非公開</span>
          </div>
        </div>

        {/* 前回の診断復帰カード */}
        <RecentSessionCard />

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
