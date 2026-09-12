import { describe, it, expect } from 'vitest';
import { getSelfLabel, generateFinalResult } from '../src/lib/core/gap';
import { TraitScores } from '../src/lib/core/types';

describe('Gap Title Synthesis Logic', () => {
  it('4.0からの乖離が最大の軸に基づいて自認ラベルが正しく決定されること', () => {
    const highC: TraitScores = { E: 4.0, A: 4.0, C: 6.5, S: 4.0, O: 4.0 };
    expect(getSelfLabel(highC)).toBe('緻密なグランドデザイナー');

    const lowE: TraitScores = { E: 1.5, A: 4.0, C: 4.0, S: 4.0, O: 4.0 };
    expect(getSelfLabel(lowE)).toBe('静寂を愛する孤高の観察者');
  });

  it('全軸が中央値4.0付近の場合はバランサーとなること', () => {
    const neutral: TraitScores = { E: 4.1, A: 3.9, C: 4.0, S: 4.0, O: 4.1 };
    expect(getSelfLabel(neutral)).toBe('変幻自在のバランサー');
  });

  it('自己と他者の乖離が1.0未満の場合は等身大パーソンとなること', () => {
    const self: TraitScores = { E: 5.0, A: 4.0, C: 6.0, S: 3.0, O: 4.0 };
    const peer: TraitScores = { E: 5.2, A: 4.1, C: 5.8, S: 3.5, O: 4.0 };

    const result = generateFinalResult(self, peer);
    expect(result.isConcordant).toBe(true);
    expect(result.title).toContain('等身大パーソン');
    expect(result.primaryGap).toBeNull();
  });

  it('主ギャップ（差が1.0以上）が正しく称号に反映されること', () => {
    // self E: 6.0, peer E: 2.0 -> E_over: 脳内フェス野郎
    const self: TraitScores = { E: 6.0, A: 4.0, C: 4.0, S: 4.0, O: 4.0 };
    const peer: TraitScores = { E: 2.0, A: 4.0, C: 4.0, S: 4.0, O: 4.0 };

    const result = generateFinalResult(self, peer);
    expect(result.isConcordant).toBe(false);
    expect(result.primaryGap?.name).toBe('脳内フェス野郎');
    expect(result.title).toContain('脳内フェス野郎');
  });

  it('副ギャップ（第2の差が0.8以上）が存在する場合、複合称号が生成されること', () => {
    // 1位: E_over (6.0 - 2.0 = 4.0) -> 脳内フェス野郎
    // 2位: C_under (2.0 - 5.0 = -3.0) -> 崖っぷちの神業アクロバット
    const self: TraitScores = { E: 6.0, A: 4.0, C: 2.0, S: 4.0, O: 4.0 };
    const peer: TraitScores = { E: 2.0, A: 4.0, C: 5.0, S: 4.0, O: 4.0 };

    const result = generateFinalResult(self, peer);
    expect(result.primaryGap?.name).toBe('脳内フェス野郎');
    expect(result.secondaryGap?.name).toBe('崖っぷちの神業アクロバット');
    expect(result.title).toContain('自称・情熱のインフルエンサー');
    expect(result.title).toContain('「崖っぷちの神業アクロバット」を宿した「脳内フェス野郎」');
  });

  it('3つ以上の軸で6.0以上の場合はSSS級レア称号が発動すること', () => {
    const self: TraitScores = { E: 6.5, A: 6.0, C: 6.2, S: 4.0, O: 4.0 };
    const peer: TraitScores = { E: 4.0, A: 4.0, C: 4.0, S: 4.0, O: 4.0 };

    const result = generateFinalResult(self, peer);
    expect(result.isRare).toBe(true);
    expect(result.rarityBadge).toBe('SSS級レア');
    expect(result.title).toContain('【SSS級レア】全方位無敵のハッピーオーラ・エンターテイナー');
  });

  it('最大乖離が4.5以上の場合はURレア称号が発動すること', () => {
    // 自己 E: 1.0 vs 他者 E: 6.5 -> delta: -5.5 (absDelta >= 4.5)
    const self: TraitScores = { E: 1.0, A: 4.0, C: 4.0, S: 4.0, O: 4.0 };
    const peer: TraitScores = { E: 6.5, A: 4.0, C: 4.0, S: 4.0, O: 4.0 };

    const result = generateFinalResult(self, peer);
    expect(result.isRare).toBe(true);
    expect(result.rarityBadge).toBe('URレア');
    expect(result.title).toContain('ステルス国家機密級インフルエンサー');
  });

  it('勤勉性低×開放性高の場合はSSRレア（アドリブ神業）が発動すること', () => {
    const self: TraitScores = { E: 4.0, A: 4.0, C: 1.5, S: 4.0, O: 6.5 };
    const peer: TraitScores = { E: 4.0, A: 4.0, C: 3.0, S: 4.0, O: 4.0 };

    const result = generateFinalResult(self, peer);
    expect(result.isRare).toBe(true);
    expect(result.rarityBadge).toBe('SSRレア');
    expect(result.title).toContain('アドリブの神業イノベーター');
  });
});
