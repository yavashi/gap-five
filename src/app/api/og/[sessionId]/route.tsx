import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import { getSession } from '@/lib/actions/session';
import { getPeerAnswers } from '@/lib/actions/peer';
import { calculateAveragePeerScores } from '@/lib/core/tipi';
import { generateFinalResult } from '@/lib/core/gap';
import { TraitKey, TraitScores } from '@/lib/core/types';

export const runtime = 'nodejs';

const SELF_IMAGE_MAP: Record<string, { file: string; desc: string; bubble: string }> = {
  '情熱のインフルエンサー': {
    file: 'foo_clean_self.jpg',
    desc: 'みんなと太陽のように乾杯して盛り上げる人気者',
    bubble: '「みんな〜！今日も乾杯しよ〜！🍹」',
  },
  '静寂を愛する孤高の観察者': {
    file: 'stealth_clean_self.jpg',
    desc: '日だまりの部屋で本と猫とコーヒーを愛する内向的人間',
    bubble: '「週末は家で読書と猫…これが至福☕️」',
  },
  '慈悲深きガーディアン': {
    file: 'scalpel_clean_self.jpg',
    desc: '温かいスープを差し出し愛と善意で支える守護者',
    bubble: '「みんなの役に立ちたい…愛で支えるわ🍲」',
  },
  '冷徹なるリアリスト': {
    file: 'tsundere_clean_self.jpg',
    desc: '感情を排してデータとロジックを信じる合理主義者',
    bubble: '「私は数字と論理しか信じない📊」',
  },
  '緻密なグランドデザイナー': {
    file: 'blueprint_clean_self.jpg',
    desc: '知的な眼鏡を光らせ完璧な計画を計算する策士',
    bubble: '「緻密な計画こそが成功の鍵📐」',
  },
  '型破りなインプロバイザー': {
    file: 'acrobat_clean_self.jpg',
    desc: '気ままなアドリブと直感で生きる自由人',
    bubble: '「計画なんて縛られたくない。アドリブだ🎸」',
  },
  '泰然自若のアイアンハート': {
    file: 'armor_clean_self.jpg',
    desc: '嵐の中でも泰然と仁王立ちする不屈の騎士',
    bubble: '「何があっても動じない。鋼の心なり🛡️」',
  },
  '繊細なるクリスタルセンサー': {
    file: 'swan_clean_self.jpg',
    desc: '平穏を保ち何事にも動じない瞑想的人物',
    bubble: '「心静かに瞑想中…何事にも動じない🧘」',
  },
  '未踏を拓くヴィジョナリー': {
    file: 'secret_base_clean_self.jpg',
    desc: 'サイバーパンクな夜景を見下ろし新世界を描く先駆者',
    bubble: '「世界を変えるヴィジョンが見える🚀」',
  },
  '質実剛健のリアリズムアンカー': {
    file: 'innovator_clean_self.jpg',
    desc: '誰よりも真面目に目の前の修理をこなす普通の職人',
    bubble: '「普通が一番。堅実な職人です🌱」',
  },
  '変幻自在のバランサー': {
    file: 'balancer_clean_self.jpg',
    desc: 'あらゆる環境と柔軟に調和するスマートな調整役',
    bubble: '「柔軟にスマートに行こう☕️💻」',
  },
};

function getSelfImageBase64(selfLabel: string): string | null {
  try {
    const info = SELF_IMAGE_MAP[selfLabel] || SELF_IMAGE_MAP['変幻自在のバランサー'];
    if (!info) return null;
    const filePath = path.join(process.cwd(), 'public', 'gap-samples', info.file);
    if (fs.existsSync(filePath)) {
      const buffer = fs.readFileSync(filePath);
      return `data:image/jpeg;base64,${buffer.toString('base64')}`;
    }
  } catch (err) {
    console.warn('Failed to load self image for OG:', err);
  }
  return null;
}

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
  try {
    const { sessionId } = await params;
    const session = await getSession(sessionId);

    if (!session) {
      return new Response('Not found', { status: 404 });
    }

    const peerAnswers = await getPeerAnswers(sessionId);
    const answerCount = peerAnswers.length;

    const width = 1200;
    const height = 630;
    const origin = request.nextUrl.origin || 'https://gap-five-nine.vercel.app';

    // 0人の場合（自認イラスト入りの招待・回答リクエスト用カード）
    if (answerCount === 0) {
      const selfInfo = SELF_IMAGE_MAP[session.self_label] || SELF_IMAGE_MAP['変幻自在のバランサー'];
      const imgUrl = `${origin}/gap-samples/${selfInfo.file}`;

      return new ImageResponse(
        (
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#0f172a',
              color: 'white',
              padding: '50px 60px',
              fontFamily: 'sans-serif',
            }}
          >
            {/* 左：自認イラストカード */}
            <div
              style={{
                width: '430px',
                height: '520px',
                display: 'flex',
                flexDirection: 'column',
                backgroundColor: '#1e293b',
                borderRadius: '24px',
                border: '3px solid #fbbf24',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              {/* ヘッダーバッジ */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px 20px',
                  backgroundColor: 'rgba(245, 158, 11, 0.2)',
                  borderBottom: '1px solid rgba(245, 158, 11, 0.4)',
                }}
              >
                <span style={{ fontSize: '15px', fontWeight: 900, color: '#fbbf24' }}>
                  本人の自認（MY VIEW）
                </span>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#fef3c7', backgroundColor: 'rgba(245, 158, 11, 0.3)', padding: '2px 10px', borderRadius: '12px' }}>
                  自称ラベル
                </span>
              </div>

              {/* イラスト画像 */}
              <div
                style={{
                  width: '430px',
                  height: '350px',
                  display: 'flex',
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: '#020617',
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imgUrl}
                  alt={session.self_label}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
                {/* ふきだし */}
                <div
                  style={{
                    position: 'absolute',
                    top: '16px',
                    right: '16px',
                    backgroundColor: '#ffffff',
                    color: '#0f172a',
                    padding: '8px 16px',
                    borderRadius: '16px',
                    fontSize: '14px',
                    fontWeight: 900,
                    border: '2px solid #fbbf24',
                    maxWidth: '300px',
                    display: 'flex',
                  }}
                >
                  {selfInfo.bubble}
                </div>
              </div>

              {/* フッター解説 */}
              <div
                style={{
                  padding: '12px 20px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  flex: 1,
                  backgroundColor: '#0f172a',
                }}
              >
                <div style={{ fontSize: '19px', fontWeight: 900, color: '#fbbf24', marginBottom: '3px' }}>
                  「{session.self_label}」
                </div>
                <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.3 }}>
                  {selfInfo.desc}
                </div>
              </div>
            </div>

            {/* 右：メッセージ ＆ 回答リクエスト */}
            <div
              style={{
                width: '610px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                paddingLeft: '36px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  backgroundColor: 'rgba(59, 130, 246, 0.2)',
                  border: '1px solid rgba(59, 130, 246, 0.4)',
                  borderRadius: '9999px',
                  padding: '6px 20px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  color: '#60a5fa',
                  marginBottom: '20px',
                  alignSelf: 'flex-start',
                }}
              >
                ✨ GAP-FIVE 性格ギャップ診断
              </div>

              <div
                style={{
                  fontSize: '42px',
                  fontWeight: 900,
                  color: '#ffffff',
                  lineHeight: 1.25,
                  marginBottom: '16px',
                }}
              >
                {session.host_nickname} さんの性格を教えてください！
              </div>

              <div
                style={{
                  fontSize: '20px',
                  color: '#94a3b8',
                  lineHeight: 1.5,
                  marginBottom: '28px',
                }}
              >
                本人は<span style={{ color: '#fbbf24', fontWeight: 'bold' }}>「{session.self_label}」</span>だと思い込んでいますが、あなたから見たら本当はどう見えていますか…？
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: '#2563eb',
                    borderRadius: '16px',
                    padding: '16px 36px',
                    fontSize: '22px',
                    fontWeight: 900,
                    color: 'white',
                  }}
                >
                  1分で匿名採点する ➔
                </div>
                <div
                  style={{
                    fontSize: '15px',
                    color: '#94a3b8',
                    fontWeight: 'bold',
                  }}
                >
                  ※登録不要・完全匿名
                </div>
              </div>

              <div
                style={{
                  marginTop: '20px',
                  fontSize: '15px',
                  color: '#ec4899',
                  fontWeight: 'bold',
                }}
              >
                🎁 回答すると、あなたと{session.host_nickname}さんの相性診断もすぐ見られます！
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
  } catch (err: any) {
    console.error('OG Image Generation Error:', err);
    return new Response(err?.message || 'Internal Server Error', { status: 500 });
  }
}