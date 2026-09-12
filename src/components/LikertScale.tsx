'use client';

import React, { useState, useEffect } from 'react';

interface LikertScaleProps {
  questionNumber: number;
  totalQuestions?: number;
  questionText: string;
  value: number | null;
  onChange: (value: number) => void;
  onSelectAndAdvance?: (value: number) => void;
  onPrev?: () => void;
  canPrev?: boolean;
  themeColor?: 'blue' | 'rose';
  subjectName?: string;
}

const SCALE_OPTIONS: { num: number; label: string; short: string }[] = [
  { num: 1, label: '全く当てはまらない', short: '全く違う' },
  { num: 2, label: 'ほとんど当てはまらない', short: '違う' },
  { num: 3, label: 'あまり当てはまらない', short: 'やや違う' },
  { num: 4, label: 'どちらでもない', short: 'どちらでも' },
  { num: 5, label: 'やや当てはまる', short: 'ややそう' },
  { num: 6, label: 'かなり当てはまる', short: 'そう思う' },
  { num: 7, label: '非常に当てはまる', short: 'めっちゃそう' },
];

export const LikertScale: React.FC<LikertScaleProps> = ({
  questionNumber,
  totalQuestions = 10,
  questionText,
  value,
  onChange,
  onSelectAndAdvance,
  onPrev,
  canPrev = false,
  themeColor = 'blue',
  subjectName,
}) => {
  const [activeNum, setActiveNum] = useState<number | null>(value);

  useEffect(() => {
    setActiveNum(value);
  }, [value, questionNumber]);

  const isRose = themeColor === 'rose';
  const activeBg = isRose ? 'bg-rose-500 text-white' : 'bg-indigo-600 text-white';
  const ringColor = isRose ? 'ring-rose-400' : 'ring-indigo-400';
  const badgeColor = isRose
    ? 'bg-rose-50 text-rose-700 border-rose-200'
    : 'bg-indigo-50 text-indigo-700 border-indigo-200';

  const handleSelect = (num: number) => {
    setActiveNum(num);
    onChange(num);

    if (onSelectAndAdvance) {
      setTimeout(() => {
        onSelectAndAdvance(num);
      }, 200);
    }
  };

  const currentOption = SCALE_OPTIONS.find((o) => o.num === (activeNum ?? value));

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 shadow-sm border border-slate-200/80 transition-all space-y-6 animate-fadeIn">
      {/* 設問ヘッダー */}
      <div className="flex items-center justify-between">
        <span
          className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-black tracking-wide border ${badgeColor}`}
        >
          QUESTION {questionNumber} / {totalQuestions}
        </span>
        {canPrev && onPrev && (
          <button
            type="button"
            onClick={onPrev}
            className="text-xs font-bold text-slate-400 hover:text-slate-700 transition-colors py-1 px-2.5 rounded-lg hover:bg-slate-100"
          >
            ← 前の質問に戻る
          </button>
        )}
      </div>

      {/* 設問テキスト */}
      <div className="space-y-1.5 min-h-[70px] flex flex-col justify-center">
        {subjectName && (
          <span className="text-xs font-bold text-slate-400">
            {subjectName} さんについて
          </span>
        )}
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">
          {questionText}
        </h3>
      </div>

      {/* 選択肢（7段階ボタン） */}
      <div className="space-y-3">
        {/* ボタン列 */}
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {SCALE_OPTIONS.map((opt) => {
            const isSelected = (activeNum ?? value) === opt.num;
            return (
              <button
                key={opt.num}
                type="button"
                onClick={() => handleSelect(opt.num)}
                className={`relative flex flex-col items-center justify-center h-16 sm:h-20 rounded-2xl font-black transition-all active:scale-95 ${
                  isSelected
                    ? `${activeBg} shadow-lg ring-4 ${ringColor} ring-offset-2 scale-105 z-10`
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200/90'
                }`}
              >
                <span className="text-lg sm:text-2xl">{opt.num}</span>
                <span className="text-[9px] sm:text-[10px] font-bold opacity-80 line-clamp-1 px-0.5">
                  {opt.short}
                </span>
              </button>
            );
          })}
        </div>

        {/* ガイドラベル */}
        <div className="flex justify-between items-center text-[11px] font-bold text-slate-400 px-1 pt-1">
          <span className="text-slate-500">1: 全く違う</span>
          <span className="text-slate-400">4: どちらでも</span>
          <span className="text-slate-500">7: めっちゃそう</span>
        </div>

        {/* 選択中フィードバック（高さ固定でレイアウトシフト防止） */}
        <div className="h-7 flex items-center justify-center pt-1">
          {currentOption ? (
            <span
              className={`inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold ${
                isRose ? 'bg-rose-50 text-rose-700' : 'bg-indigo-50 text-indigo-700'
              } animate-fadeIn`}
            >
              <span>選択: {currentOption.num}</span>
              <span className="opacity-60">•</span>
              <span>{currentOption.label}</span>
            </span>
          ) : (
            <span className="text-[11px] text-slate-400 font-medium">
              直感で 1〜7 の数字を選んでください
            </span>
          )}
        </div>
      </div>
    </div>
  );
};