'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { History, ArrowRight, X, Sparkles } from 'lucide-react';

interface RecentSession {
  sessionId: string;
  nickname: string;
}

export const RecentSessionCard: React.FC = () => {
  const [session, setSession] = useState<RecentSession | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('gap_recent_session');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.sessionId && parsed.nickname) {
          setSession(parsed);
        }
      }
    } catch {}
  }, []);

  if (!session || dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
  };

  return (
    <div className="relative bg-white/95 backdrop-blur-sm rounded-2xl p-4 border border-blue-200 shadow-md shadow-blue-500/5 text-left space-y-3">
      <button
        type="button"
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 p-1 rounded-lg"
        aria-label="非表示"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-2 text-xs font-bold text-blue-700">
        <History className="w-4 h-4 text-blue-600" />
        <span>前回の診断が見つかりました</span>
      </div>

      <div className="pr-6">
        <p className="text-sm text-slate-800 font-bold flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <span>{session.nickname} さんの診断</span>
        </p>
        <p className="text-xs text-slate-500 mt-0.5">
          知人からの回答状況や、確定したギャップ結果をいつでも確認できます。
        </p>
      </div>

      <div className="flex gap-2 pt-1">
        <Link
          href={`/result/${session.sessionId}`}
          className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs shadow-sm transition-all hover:scale-[1.01]"
        >
          <span>確定結果を見る</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <Link
          href={`/me/${session.sessionId}`}
          className="inline-flex items-center justify-center py-2.5 px-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
        >
          <span>管理画面</span>
        </Link>
      </div>
    </div>
  );
};
