import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function LegalPage() {
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
          特定商取引法に基づく表記
        </h1>

        <div className="divide-y divide-slate-100 text-xs sm:text-sm">
          <div className="py-3 flex flex-col sm:flex-row sm:justify-between">
            <span className="font-bold text-slate-500 w-36">販売事業者名</span>
            <span className="text-slate-800 flex-1">GAP-FIVE 運営事務局</span>
          </div>

          <div className="py-3 flex flex-col sm:flex-row sm:justify-between">
            <span className="font-bold text-slate-500 w-36">運営責任者</span>
            <span className="text-slate-800 flex-1">請求があったら遅滞なく開示します</span>
          </div>

          <div className="py-3 flex flex-col sm:flex-row sm:justify-between">
            <span className="font-bold text-slate-500 w-36">所在地</span>
            <span className="text-slate-800 flex-1">請求があったら遅滞なく開示します</span>
          </div>

          <div className="py-3 flex flex-col sm:flex-row sm:justify-between">
            <span className="font-bold text-slate-500 w-36">お問い合わせ先</span>
            <span className="text-slate-800 flex-1">gapfive.contact@gmail.com</span>
          </div>

          <div className="py-3 flex flex-col sm:flex-row sm:justify-between">
            <span className="font-bold text-slate-500 w-36">販売価格</span>
            <span className="text-slate-800 flex-1">各商品ページに表示（深層心理トリセツ: 300円 税込）</span>
          </div>

          <div className="py-3 flex flex-col sm:flex-row sm:justify-between">
            <span className="font-bold text-slate-500 w-36">商品代金以外の必要料金</span>
            <span className="text-slate-800 flex-1">インターネット接続料金、通信料金等</span>
          </div>

          <div className="py-3 flex flex-col sm:flex-row sm:justify-between">
            <span className="font-bold text-slate-500 w-36">お支払い方法</span>
            <span className="text-slate-800 flex-1">クレジットカード、Apple Pay、Google Pay（Stripe決済）</span>
          </div>

          <div className="py-3 flex flex-col sm:flex-row sm:justify-between">
            <span className="font-bold text-slate-500 w-36">代金の支払時期</span>
            <span className="text-slate-800 flex-1">ご注文完了時にお支払いが確定します</span>
          </div>

          <div className="py-3 flex flex-col sm:flex-row sm:justify-between">
            <span className="font-bold text-slate-500 w-36">商品の引渡し時期</span>
            <span className="text-slate-800 flex-1">決済完了後、即時にWeb画面上で閲覧可能になります</span>
          </div>

          <div className="py-3 flex flex-col sm:flex-row sm:justify-between">
            <span className="font-bold text-slate-500 w-36">返品・キャンセルについて</span>
            <span className="text-slate-800 flex-1">デジタルコンテンツの性質上、購入完了後の返品・返金・キャンセルは原則としてお受けできません。</span>
          </div>
        </div>
      </div>
    </div>
  );
}
