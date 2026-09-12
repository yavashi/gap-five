'use client';

import React, { useState } from 'react';
import { Sparkles, Award, MessageSquare, ArrowRight } from 'lucide-react';

interface ResultTabContainerProps {
  gapContent: React.ReactNode;
  scienceContent: React.ReactNode;
  friendsContent: React.ReactNode;
  commentsCount: number;
  pairCount: number;
}

export const ResultTabContainer: React.FC<ResultTabContainerProps> = ({
  gapContent,
  scienceContent,
  friendsContent,
  commentsCount,
  pairCount,
}) => {
  const [activeTab, setActiveTab] = useState<'gap' | 'science' | 'friends'>('gap');

  return (
    <div className="space-y-6">
      {/* 3大スマートタブバー */}
      <div className="sticky top-3 z-30 bg-slate-900/95 backdrop-blur-md p-1.5 rounded-2xl border border-slate-700 shadow-xl">
        <div className="grid grid-cols-3 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('gap')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === 'gap'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>ギャップ</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('science')}
            className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === 'science'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Award className="w-4 h-4 text-blue-400" />
            <span>科学分析</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('friends')}
            className={`relative flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
              activeTab === 'friends'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-pink-400" />
            <span>友人・相性</span>
            {commentsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-black text-white">
                {commentsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* タブコンテンツ */}
      {activeTab === 'gap' && (
        <div className="space-y-6 animate-fadeIn">
          {gapContent}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('science');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm border border-indigo-200 flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <span>詳しい科学分析（レーダーチャート・5因子）を見る</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {activeTab === 'science' && (
        <div className="space-y-6 animate-fadeIn">
          {scienceContent}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('friends');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-sm border border-indigo-200 flex items-center justify-center gap-2 transition-all shadow-xs"
            >
              <span>友人からのコメントと相性カルテを見る</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {activeTab === 'friends' && (
        <div className="space-y-6 animate-fadeIn">
          {friendsContent}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('gap');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm flex items-center justify-center gap-2 transition-all"
            >
              <span>← 確定二つ名・イラストに戻る</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
