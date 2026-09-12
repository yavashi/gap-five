import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 text-slate-800">
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-sm border border-slate-100 space-y-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>トップページに戻る</span>
        </Link>

        <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
          利用規約
        </h1>

        <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-600">
          <p>
            この利用規約（以下、「本規約」といいます）は、GAP-FIVE（以下、「当サービス」といいます）の利用条件を定めるものです。ユーザーの皆様には、本規約に同意の上で当サービスをご利用いただきます。
          </p>

          <h2 className="text-base font-bold text-slate-800 pt-2">1. サービスの内容</h2>
          <p>
            当サービスは、ビッグファイブ理論に基づく性格診断および他者評価との認識ギャップ分析、相性診断を提供するエンターテインメントサービスです。学術的・心理学的知見を参考にしていますが、医学的・臨床的な診断を行うものではありません。
          </p>

          <h2 className="text-base font-bold text-slate-800 pt-2">2. 禁止事項</h2>
          <p>ユーザーは、当サービスの利用にあたり、以下の行為をしてはなりません。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>法令または公序良俗に反する行為</li>
            <li>他人への嫌がらせ、誹謗中傷、脅迫的なコメントの投稿</li>
            <li>当サービスのサーバーまたはネットワークの機能を破壊・妨害する行為</li>
            <li>不正アクセスを試みる行為</li>
          </ul>

          <h2 className="text-base font-bold text-slate-800 pt-2">3. 免責事項</h2>
          <p>
            当サービスに起因してユーザーに生じた損害について、当サービス管理者の故意または重過失による場合を除き、一切の責任を負いません。
          </p>

          <h2 className="text-base font-bold text-slate-800 pt-2">4. 規約の変更</h2>
          <p>
            当サービスは、必要と判断した場合には、ユーザーへの通知なく本規約を変更できるものとします。
          </p>

          <p className="text-right text-[11px] text-slate-400 pt-4">
            制定日: 2026年9月12日
          </p>
        </div>
      </div>
    </div>
  );
}
