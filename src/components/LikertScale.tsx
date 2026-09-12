'use client';

import React from 'react';

interface LikertScaleProps {
  questionNumber: number;
  questionText: string;
  value: number | null;
  onChange: (value: number) => void;
}

const SCALE_LABELS: Record<number, string> = {
  1: '全く当てはまらない',
  2: 'ほとんど当てはまらない',
  3: 'あまり当てはまらない',
  4: 'どちらでもない',
  5: 'やや当てはまる',
  6: 'かなり当てはまる',
  7: '非常に当てはまる',
};

export const LikertScale: React.FC<LikertScaleProps> = ({
  questionNumber,
  questionText,
  value,
  onChange,
}) => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 transition-all hover:border-slate-200">
      <div className="flex items-start gap-3 mb-4">
        <span className="flex-shrink-0 flex items-center justify-center w-7 h-7 rounded-full bg-blue-100 text-blue-700 font-bold text-xs">
          Q{questionNumber}
        </span>
        <h3 className="text-base font-bold text-slate-800 leading-snug pt-0.5">
          {questionText}
        </h3>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((num) => {
            const isSelected = value === num;
            return (
              <button
                key={num}
                type="button"
                onClick={() => onChange(num)}
                className={`flex flex-col items-center justify-center py-3 rounded-xl font-bold transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-105 ring-2 ring-blue-500 ring-offset-2'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <span className="text-base sm:text-lg">{num}</span>
              </button>
            );
          })}
        </div>

        <div className="flex justify-between items-center text-[11px] text-slate-400 px-1">
          <span>全く当てはまらない</span>
          <span>どちらでもない</span>
          <span>非常に当てはまる</span>
        </div>

        {value && (
          <div className="text-center pt-1">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
              選択中: {value}（{SCALE_LABELS[value]}）
            </span>
          </div>
        )}
      </div>
    </div>
  );
};