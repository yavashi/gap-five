// ビッグファイブ 5因子のキー
// E: Extraversion (外向性)
// A: Agreeableness (協調性)
// C: Conscientiousness (勤勉性・誠実性)
// S: Emotional Stability (情緒安定性 / 神経症傾向の反転)
// O: Openness to Experience (開放性)
export type TraitKey = 'E' | 'A' | 'C' | 'S' | 'O';

export type TraitScores = Record<TraitKey, number>;

export interface TraitInfo {
  key: TraitKey;
  name: string;
  shortDesc: string;
  lowTrait: string;
  highTrait: string;
}

export const TRAIT_DEFINITIONS: Record<TraitKey, TraitInfo> = {
  E: { key: 'E', name: '外向性', shortDesc: '社交性・活動性・エネルギッシュさ', lowTrait: '内向的・思慮深い', highTrait: '社交的・活動的' },
  A: { key: 'A', name: '協調性', shortDesc: '共感力・利他性・親切さ', lowTrait: '独立的・批判的', highTrait: '利他的・温厚' },
  C: { key: 'C', name: '勤勉性', shortDesc: '自己統制・責任感・計画性', lowTrait: '柔軟・マイペース', highTrait: '几帳面・計画的' },
  S: { key: 'S', name: '情緒安定性', shortDesc: 'ストレス耐性・冷静さ', lowTrait: '繊細・敏感', highTrait: '冷静沈着・タフ' },
  O: { key: 'O', name: '開放性', shortDesc: '知的好奇心・創造性・独創性', lowTrait: '現実的・堅実', highTrait: '独創的・探求心旺盛' },
};

// TIPI-J 設問定義
export interface TIPIItem {
  id: number;
  trait: TraitKey;
  isReverse: boolean;
  selfText: string;
  peerTextTemplate: (name: string) => string;
}

// ギャップパーツ（二つ名モジュール）
export interface GapPart {
  trait: TraitKey;
  type: 'over' | 'under';
  name: string;
  desc: string;
}

// 確定診断結果
export interface FinalResult {
  title: string;
  description: string;
  selfLabel: string;
  isConcordant: boolean; // 等身大かどうか（自己と他者の乖離が小さい）
  primaryGap: GapPart | null;
  secondaryGap: GapPart | null;
  deltas: { trait: TraitKey; delta: number; absDelta: number }[];
  isRare?: boolean;
  rarityBadge?: string;
}

// セッション型
export interface SessionData {
  id: string;
  secret_key?: string;
  host_nickname: string;
  self_scores: TraitScores;
  self_label?: string;
  created_at?: string;
  updated_at?: string;
}

// 他者回答型
export interface PeerAnswerData {
  id: string;
  session_id: string;
  peer_nickname: string;
  peer_scores: TraitScores;
  comment?: string;
  is_excluded: boolean;
  created_at: string;
}
