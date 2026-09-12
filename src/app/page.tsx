import Link from 'next/link';
import { Sparkles, Users, ArrowRight } from 'lucide-react';
import { RecentSessionCard } from '@/components/RecentSessionCard';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-medium border border-blue-200">
          <Sparkles className="w-4 h-4" />
          <span>ビッグファイブ × ジョハリの窓</span>
        </div>

        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
          GAP-FIVE
        </h1>
        <p className="text-lg font-semibold text-slate-600">
          自称と実態の「ズレ」を可視化するギャップ診断
        </p>

        <p className="text-sm text-slate-500 leading-relaxed">
          あなたは自分をどう思っていて、周囲はあなたをどう見ているのか？
          10問の自己診断と、友人たちからの他者評価であなたの「真の二つ名」を解き明かします。
        </p>

        {/* 前回の診断復帰カード */}
        <RecentSessionCard />

        <div className="pt-2">
          <Link
            href="/diagnose"
            className="inline-flex items-center justify-center gap-2 w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <span>新しい診断をはじめる（約1分）</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="flex items-center justify-center gap-6 pt-4 text-xs text-slate-400">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>完全匿名・登録不要</span>
          </div>
          <div>10問・7段階評価</div>
        </div>
      </div>
    </main>
  );
}
