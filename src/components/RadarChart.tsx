'use client';

import React from 'react';
import { TraitScores, TraitKey, TRAIT_DEFINITIONS } from '@/lib/core/types';

interface RadarChartProps {
  selfScores: TraitScores;
  peerScores: TraitScores | null;
  selfLabel?: string;
  className?: string;
}

const TRAITS: TraitKey[] = ['E', 'A', 'C', 'S', 'O'];

export const RadarChart: React.FC<RadarChartProps> = ({
  selfScores,
  peerScores,
  className = '',
}) => {
  const cx = 200;
  const cy = 200;
  const radius = 125;

  // 角度の計算（上から時計回り）
  const getAngle = (index: number) => {
    return (Math.PI * 2 / 5) * index - Math.PI / 2;
  };

  // スコア (1.0〜7.0) を座標に変換
  const getPoint = (score: number, index: number) => {
    const angle = getAngle(index);
    // 1〜7を0〜1に正規化（中心は1点相当、外枠は7点相当）
    const factor = Math.max(0, Math.min(1, (score - 1) / 6));
    const r = radius * (0.15 + 0.85 * factor);
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return { x, y };
  };

  // ポリゴン用の points 文字列を生成
  const getPolygonPoints = (scores: TraitScores) => {
    return TRAITS.map((trait, i) => {
      const pt = getPoint(scores[trait] ?? 4.0, i);
      return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
    }).join(' ');
  };

  // グリッド線の生成（1〜7点）
  const gridLevels = [2.5, 4.0, 5.5, 7.0];

  return (
    <div className={`w-full max-w-sm mx-auto select-none ${className}`}>
      <svg viewBox="0 0 400 400" className="w-full h-auto drop-shadow-sm">
        {/* 背景グリッド（同心5角形） */}
        {gridLevels.map((level) => {
          const points = TRAITS.map((_, i) => {
            const pt = getPoint(level, i);
            return `${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
          }).join(' ');
          const isCenter = level === 4.0;
          return (
            <polygon
              key={level}
              points={points}
              fill="none"
              stroke={isCenter ? '#94a3b8' : '#e2e8f0'}
              strokeWidth={isCenter ? '1.5' : '1'}
              strokeDasharray={isCenter ? '3 3' : undefined}
            />
          );
        })}

        {/* 中心から外側への軸線 */}
        {TRAITS.map((_, i) => {
          const outerPt = getPoint(7.0, i);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={outerPt.x}
              y2={outerPt.y}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          );
        })}

        {/* 自己評価ポリゴン（青） */}
        <polygon
          points={getPolygonPoints(selfScores)}
          fill="rgba(59, 130, 246, 0.35)"
          stroke="#2563eb"
          strokeWidth="3"
        />

        {/* 他者平均ポリゴン（赤/ピンク） */}
        {peerScores && (
          <polygon
            points={getPolygonPoints(peerScores)}
            fill="rgba(244, 63, 94, 0.35)"
            stroke="#e11d48"
            strokeWidth="3"
          />
        )}

        {/* 軸ごとの頂点ドット（自己） */}
        {TRAITS.map((trait, i) => {
          const pt = getPoint(selfScores[trait] ?? 4.0, i);
          return (
            <circle
              key={`self-${trait}`}
              cx={pt.x}
              cy={pt.y}
              r="4.5"
              fill="#2563eb"
              stroke="#ffffff"
              strokeWidth="2"
            />
          );
        })}

        {/* 軸ごとの頂点ドット（他者） */}
        {peerScores &&
          TRAITS.map((trait, i) => {
            const pt = getPoint(peerScores[trait] ?? 4.0, i);
            return (
              <circle
                key={`peer-${trait}`}
                cx={pt.x}
                cy={pt.y}
                r="4.5"
                fill="#e11d48"
                stroke="#ffffff"
                strokeWidth="2"
              />
            );
          })}

        {/* ラベル */}
        {TRAITS.map((trait, i) => {
          const angle = getAngle(i);
          const labelDist = radius + 38;
          const lx = cx + labelDist * Math.cos(angle);
          const ly = cy + labelDist * Math.sin(angle);
          const info = TRAIT_DEFINITIONS[trait];

          const selfScore = (selfScores[trait] ?? 4.0).toFixed(1);
          const peerScore = peerScores ? (peerScores[trait] ?? 4.0).toFixed(1) : null;

          return (
            <g key={`label-${trait}`} transform={`translate(${lx}, ${ly})`}>
              <text
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[13px] font-extrabold fill-slate-800"
              >
                {info.name}
              </text>
              <text
                y="16"
                textAnchor="middle"
                dominantBaseline="middle"
                className="text-[11px] font-bold"
              >
                <tspan fill="#2563eb">{selfScore}</tspan>
                {peerScore && (
                  <>
                    <tspan fill="#94a3b8"> / </tspan>
                    <tspan fill="#e11d48">{peerScore}</tspan>
                  </>
                )}
              </text>
            </g>
          );
        })}
      </svg>

      {/* 凡例 */}
      <div className="flex items-center justify-center gap-6 mt-2 text-xs font-bold">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded-full bg-blue-600 ring-2 ring-blue-200" />
          <span className="text-slate-700">自己評価（自分）</span>
        </div>
        {peerScores && (
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded-full bg-rose-600 ring-2 ring-rose-200" />
            <span className="text-slate-700">他者評価（周囲の平均）</span>
          </div>
        )}
      </div>
    </div>
  );
};