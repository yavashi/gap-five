'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { CheckCircle2, Sparkles, ArrowRight, Home } from 'lucide-react';

function ThanksContent() {
  const searchParams = useSearchParams();
  const hostName = searchParams?.get('host') || 'お友達';

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900">
            回答ありがとうございました！
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            {hostName}さんの診断ルームに、あなたの貴重な評価が送信されました。
          </p>
        </div>

        {/* お返し診断プロモーションカード */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 text-left space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>お返し診断</span>
          </div>

          <h3 className="text-base font-bold text-slate-900">
            {hostName}さんから見たあなたはどう見えている？
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            あなたも自己診断を行ってURLを送れば、{hostName}さんにあなたの印象を採点してもらえます。
          </p>

          <Link
            href="/diagnose"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-md shadow-blue-500/25 transition-all hover:scale-[1.01]"
          >
            <span>自分の診断をはじめる（約1分）</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>GAP-FIVE トップへ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ThanksPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">読み込み中...</div>}>
      <ThanksContent />
    </Suspense>
  );
}