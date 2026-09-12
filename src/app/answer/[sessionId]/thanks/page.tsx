'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams, useParams } from 'next/navigation';
import { CheckCircle2, Sparkles, ArrowRight, Home, Heart, Zap, Award, Loader2 } from 'lucide-react';
import { getCompatibilityAction } from '@/lib/actions/peer';
import { CompatibilityResult } from '@/lib/core/compatibility';

function ThanksContent() {
  const searchParams = useSearchParams();
  const params = useParams();
  const sessionId = params?.sessionId as string;
  const aid = searchParams?.get('aid');
  const fallbackHost = searchParams?.get('host') || 'お友達';

  const [loading, setLoading] = useState(!!(sessionId && aid));
  const [data, setData] = useState<{
    compatibility: CompatibilityResult;
    peerNickname: string;
    hostNickname: string;
  } | null>(null);

  useEffect(() => {
    if (sessionId && aid) {
      getCompatibilityAction(sessionId, aid)
        .then((res) => {
          if (res) setData(res);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [sessionId, aid]);

  const hostName = data?.hostNickname || fallbackHost;
  const peerName = data?.peerNickname || 'あなた';

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-100 text-center space-y-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl font-black text-slate-900">
            回答ありがとうございました！
          </h1>
          <p className="text-xs text-slate-500">
            {hostName} さんの診断ルームに、あなたの評価が反映されました。
          </p>
        </div>

        {/* 相性診断カード */}
        {loading ? (
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-400">
            <Loader2 className="w-4 h-4 animate-spin text-rose-500" />
            <span>2人のギャップ相性を計算中...</span>
          </div>
        ) : data ? (
          <div className="p-6 rounded-3xl bg-gradient-to-br from-rose-500 via-pink-600 to-indigo-600 text-white shadow-xl text-left space-y-4 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-bold backdrop-blur-xs">
                <Heart className="w-3.5 h-3.5 fill-rose-200 text-rose-200" />
                <span>ギャップ相性診断</span>
              </div>
              <span className="text-[11px] font-bold text-pink-200">
                {peerName} × {hostName}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-white to-pink-200">
                  {data.compatibility.score}%
                </span>
                <span className="text-xs font-bold text-pink-200 uppercase tracking-widest">
                  相性度
                </span>
              </div>
              <h2 className="text-lg font-black text-yellow-300">
                『{data.compatibility.typeName}』
              </h2>
            </div>

            <p className="text-xs text-pink-100 leading-relaxed bg-white/10 p-3 rounded-2xl border border-white/15 backdrop-blur-xs">
              {data.compatibility.description}
            </p>

            <div className="flex items-start gap-2 text-xs text-white/95 bg-white/15 p-3 rounded-2xl font-medium">
              <Zap className="w-4 h-4 text-yellow-300 flex-shrink-0 mt-0.5" />
              <span>{data.compatibility.strongPoint}</span>
            </div>
          </div>
        ) : null}

        {/* お返し診断プロモーションカード（バイラル導線） */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white text-left space-y-3 shadow-md">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/30 text-indigo-300 text-xs font-bold border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>お返し診断（次はあなたの番！）</span>
          </div>

          <h3 className="text-base font-black text-slate-100">
            {hostName} さんから見たあなたは、一体どう見えている？
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            あなたも1分で自己診断を作成してURLを送れば、{hostName} さんにあなたの「自称と実態のギャップ」を採点してもらえます！
          </p>

          <Link
            href="/diagnose"
            className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold shadow-md shadow-blue-500/30 transition-all hover:scale-[1.01] active:scale-[0.99]"
          >
            <span>自分のギャップ診断をつくる（無料・1分）</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="pt-1">
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
