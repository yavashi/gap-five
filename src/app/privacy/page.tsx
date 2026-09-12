import React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
          プライバシーポリシー
        </h1>

        <div className="space-y-4 text-xs sm:text-sm leading-relaxed text-slate-600">
          <p>
            GAP-FIVE（以下、「当サービス」といいます）は、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下、「本ポリシー」といいます）を定めます。
          </p>

          <h2 className="text-base font-bold text-slate-800 pt-2">1. 取得する情報</h2>
          <p>
            当サービスでは、サービスの提供および向上のため、以下の情報を取得する場合があります。
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>診断時にご入力いただくニックネームおよび回答スコア</li>
            <li>他者評価時に任意で入力される一言コメント</li>
            <li>アクセスログ、IPアドレス、ブラウザ種別、端末情報</li>
            <li>Cookie（クッキー）および類似のトラッキング技術により収集される閲覧履歴</li>
          </ul>

          <h2 className="text-base font-bold text-slate-800 pt-2">2. 利用目的</h2>
          <p>収集した情報は、以下の目的のために利用します。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>自己評価および他者評価に基づく性格ギャップ診断結果・相性診断の提供</li>
            <li>サービスの改善、新機能の開発、利用状況の分析</li>
            <li>不正アクセスの検知・防止</li>
            <li>提携広告・おすすめ情報の適切な配信</li>
          </ul>

          <h2 className="text-base font-bold text-slate-800 pt-2">3. アクセス解析・広告配信について</h2>
          <p>
            当サービスでは、利用状況を把握するために Vercel Analytics 等のアクセス解析ツールを使用しています。これらはトラフィックデータの収集のために Cookie を使用することがありますが、個人を特定する情報は含まれません。
          </p>

          <h2 className="text-base font-bold text-slate-800 pt-2">4. 個人情報の第三者提供</h2>
          <p>
            法令に基づく場合を除き、ユーザーの同意を得ることなく第三者に個人情報を提供することはありません。
          </p>

          <h2 className="text-base font-bold text-slate-800 pt-2">5. お問い合わせ</h2>
          <p>
            本ポリシーに関するお問い合わせは、当サービスの管理者宛てにご連絡ください。
          </p>

          <p className="text-right text-[11px] text-slate-400 pt-4">
            制定日: 2026年9月12日
          </p>
        </div>
      </div>
    </div>
  );
}
