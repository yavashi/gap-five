import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import { getSession } from '@/lib/actions/session';
import { getPeerAnswers } from '@/lib/actions/peer';
import { calculateAveragePeerScores } from '@/lib/core/tipi';
import { generateFinalResult } from '@/lib/core/gap';
import { TraitKey, TraitScores } from '@/lib/core/types';

export const runtime = 'nodejs';

const TRAITS: TraitKey[] = ['E', 'A', 'C', 'S', 'O'];
const TRAIT_NAMES: Record<TraitKey, string> = {
  E: '外向性',
  A: '協調性',
  C: '勤勉性',
  S: '情緒安定性',
  O: '開放性',
};

function getPolygonPoints(scores: TraitScores, cx: number, cy: number, radius: number): string {
  return TRAITS.map((trait, i) => {
    const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
    const score = scores[trait] ?? 4.0;
    const factor = Math.max(0, Math.min(1, (score - 1) / 6));
    const r = radius * (0.15 + 0.85 * factor);
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(' ');
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const { sessionId } = await params;
  const session = await getSession(sessionId);

  if (!session) {
    return new Response('Not found', { status: 404 });
  }

  const peerAnswers = await getPeerAnswers(sessionId);
  const answerCount = peerAnswers.length;

  const width = 1200;
  const height = 630;

  // 0人の場合（招待・回答リクエスト用カード）
  if (answerCount === 0) {
    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
            color: 'white',
            padding: '40px 60px',
            fontFamily: 'sans-serif',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(59, 130, 246, 0.2)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              borderRadius: '9999px',
              padding: '8px 24px',
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#60a5fa',
              marginBottom: '24px',
            }}
          >
            GAP-FIVE 性格ギャップ診断
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: '48px',
              fontWeight: 900,
              textAlign: 'center',
              color: '#f8fafc',
              marginBottom: '16px',
            }}
          >
            {session.host_nickname} さんの性格を教えてください！
          </div>

          <div
            style={{
              display: 'flex',
              fontSize: '24px',
              color: '#94a3b8',
              textAlign: 'center',
              maxWidth: '800px',
              lineHeight: 1.5,
              marginBottom: '32px',
            }}
          >
            あなたの目から見た{session.host_nickname}さんはどんな人？
            回答が集まると「自称と実態のギャップ二つ名」がアンロックされます。
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              background: '#2563eb',
              borderRadius: '20px',
              padding: '16px 40px',
              fontSize: '24px',
              fontWeight: 'bold',
              color: 'white',
              boxShadow: '0 10px 25px rgba(37, 99, 235, 0.4)',
            }}
          >
            1分で回答する（完全匿名）
          </div>
        </div>
      ),
      {
        width,
        height,
        headers: {
          'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        },
      }
    );
  }

  // 1人以上の場合（結果カード）
  const peerScoresArray = peerAnswers.map((a) => a.peer_scores);
  const averagePeerScores = calculateAveragePeerScores(peerScoresArray)!;
  const finalResult = generateFinalResult(session.self_scores, averagePeerScores);

  const cx = 220;
  const cy = 315;
  const radius = 170;

  const selfPoints = getPolygonPoints(session.self_scores, cx, cy, radius);
  const peerPoints = getPolygonPoints(averagePeerScores, cx, cy, radius);

  const gridLevels = [2.5, 4.0, 5.5, 7.0];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
          color: 'white',
          padding: '40px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* 左側：レーダーチャート */}
        <div
          style={{
            width: '460px',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div style={{ position: 'relative', width: '440px', height: '440px', display: 'flex' }}>
            <svg width="440" height="440" viewBox="0 0 440 440">
              {/* グリッド線 */}
              {gridLevels.map((level) => {
                const pts = getPolygonPoints(
                  { E: level, A: level, C: level, S: level, O: level },
                  220,
                  220,
                  radius
                );
                return (
                  <polygon
                    key={level}
                    points={pts}
                    fill="none"
                    stroke={level === 4.0 ? '#64748b' : '#334155'}
                    strokeWidth={level === 4.0 ? '2' : '1'}
                  />
                );
              })}

              {/* 自己ポリゴン（青） */}
              <polygon
                points={getPolygonPoints(session.self_scores, 220, 220, radius)}
                fill="rgba(59, 130, 246, 0.4)"
                stroke="#3b82f6"
                strokeWidth="4"
              />

              {/* 他者ポリゴン（赤） */}
              <polygon
                points={getPolygonPoints(averagePeerScores, 220, 220, radius)}
                fill="rgba(244, 63, 94, 0.4)"
                stroke="#f43f5e"
                strokeWidth="4"
              />
            </svg>

            {/* ラベル（SatoriではSVG内textが非対応のためHTMLで配置） */}
            {TRAITS.map((trait, i) => {
              const angle = (Math.PI * 2 / 5) * i - Math.PI / 2;
              const lx = 220 + (radius + 28) * Math.cos(angle);
              const ly = 220 + (radius + 28) * Math.sin(angle);
              return (
                <div
                  key={trait}
                  style={{
                    position: 'absolute',
                    left: `${lx - 45}px`,
                    top: `${ly - 12}px`,
                    width: '90px',
                    textAlign: 'center',
                    color: '#e2e8f0',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  {TRAIT_NAMES[trait]}
                </div>
              );
            })}
          </div>

          {/* 凡例 */}
          <div
            style={{
              display: 'flex',
              gap: '24px',
              fontSize: '15px',
              fontWeight: 'bold',
              marginTop: '4px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '14px', height: '14px', background: '#3b82f6', borderRadius: '4px' }} />
              <span style={{ color: '#93c5fd' }}>自分</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '14px', height: '14px', background: '#f43f5e', borderRadius: '4px' }} />
              <span style={{ color: '#fda4af' }}>周囲（{answerCount}名平均）</span>
            </div>
          </div>
        </div>

        {/* 右側：確定二つ名と自認・実態 */}
        <div
          style={{
            flex: 1,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            paddingLeft: '30px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '16px',
            }}
          >
            <span
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '6px 16px',
                borderRadius: '9999px',
                fontSize: '16px',
                fontWeight: 'bold',
                color: '#cbd5e1',
              }}
            >
              {session.host_nickname} さんの診断結果
            </span>
            <span
              style={{
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                border: '1px solid rgba(16, 185, 129, 0.4)',
                padding: '6px 16px',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            >
              回答 {answerCount}名
            </span>
          </div>

          <div
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#a5b4fc',
              marginBottom: '8px',
            }}
          >
            自称と実態の確定二つ名
          </div>

          <div
            style={{
              fontSize: '38px',
              fontWeight: 900,
              lineHeight: 1.25,
              color: '#fbbf24',
              marginBottom: '28px',
            }}
          >
            {finalResult.title}
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.07)',
                borderRadius: '16px',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 'bold' }}>本人の自認</span>
              <span style={{ fontSize: '20px', fontWeight: 900, color: '#93c5fd', marginTop: '4px' }}>
                {finalResult.selfLabel}
              </span>
            </div>

            <div
              style={{
                flex: 1,
                background: 'rgba(255, 255, 255, 0.07)',
                borderRadius: '16px',
                padding: '16px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <span style={{ fontSize: '14px', color: '#94a3b8', fontWeight: 'bold' }}>周囲から見た実態</span>
              <span style={{ fontSize: '20px', fontWeight: 900, color: '#fda4af', marginTop: '4px' }}>
                {finalResult.primaryGap ? finalResult.primaryGap.name : '等身大パーソン'}
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              marginTop: '36px',
              fontSize: '16px',
              color: '#64748b',
              fontWeight: 'bold',
            }}
          >
            GAP-FIVE ギャップ診断
          </div>
        </div>
      </div>
    ),
    {
      width,
      height,
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    }
  );
}
