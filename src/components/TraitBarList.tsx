'use client';

import React from 'react';
import { TraitScores, TraitKey, TRAIT_DEFINITIONS } from '@/lib/core/types';

interface TraitBarListProps {
  selfScores: TraitScores;
  peerScores: TraitScores;
}

const TRAITS: TraitKey[] = ['E', 'A', 'C', 'S', 'O'];

export const TraitBarList: React.FC<TraitBarListProps> = ({
  selfScores,
  peerScores,
}) => {
  return (
    <div className="space-y-4">
      {TRAITS.map((trait) => {
        const info = TRAIT_DEFINITIONS[trait];
        const selfVal = selfScores[trait] ?? 4.0;
        const peerVal = peerScores[trait] ?? 4.0;
        const delta = Math.round((selfVal - peerVal) * 10) / 10;
        const absDelta = Math.abs(delta);

        // 1〜7スケールを % (0〜100) に変換
        const selfPct = Math.max(0, Math.min(100, ((selfVal - 1) / 6) * 100));
        const peerPct = Math.max(0, Math.min(100, ((peerVal - 1) / 6) * 100));

        let badgeBg = 'bg-slate-100 text-slate-600';
        let deltaText = `±0.0`;

        if (delta > 0) {
          deltaText = `+${delta.toFixed(1)}`;
          badgeBg = absDelta >= 1.0 ? 'bg-blue-100 text-blue-700 font-black' : 'bg-blue-50 text-blue-600';
        } else if (delta < 0) {
          deltaText = `${delta.toFixed(1)}`;
          badgeBg = absDelta >= 1.0 ? 'bg-rose-100 text-rose-700 font-black' : 'bg-rose-50 text-rose-600';
        }

        return (
          <div
            key={trait}
            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2 text-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-800 text-sm">{info.name}</span>
                <span className="text-[11px] text-slate-400">（{info.shortDesc}）</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-400">ギャップ:</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${badgeBg}`}>
                  {deltaText}
                </span>
              </div>
            </div>

            {/* バー比較 */}
            <div className="space-y-1.5 pt-1">
              {/* 自己評価バー */}
              <div className="flex items-center gap-2">
                <span className="w-10 text-[11px] font-semibold text-blue-600">自分</span>
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${selfPct}%` }}
                  />
                </div>
                <span className="w-8 text-right font-bold text-blue-600">{selfVal.toFixed(1)}</span>
              </div>

              {/* 他者評価バー */}
              <div className="flex items-center gap-2">
                <span className="w-10 text-[11px] font-semibold text-rose-600">周囲</span>
                <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full transition-all duration-500"
                    style={{ width: `${peerPct}%` }}
                  />
                </div>
                <span className="w-8 text-right font-bold text-rose-600">{peerVal.toFixed(1)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};