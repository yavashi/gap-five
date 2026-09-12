import { describe, it, expect } from 'vitest';
import { generatePremiumReport } from '../src/lib/core/premium';
import { TraitScores } from '../src/lib/core/types';

describe('Premium Report Generation (Stage 6)', () => {
  it('should generate complete deep career, romance, manual, and mental health sections', () => {
    const selfScores: TraitScores = {
      E: 6,
      A: 5,
      C: 6,
      S: 2,
      O: 6,
    };
    const peerScores: TraitScores = {
      E: 4,
      A: 6,
      C: 5,
      S: 3,
      O: 5,
    };

    const report = generatePremiumReport(selfScores, peerScores);

    expect(report).toBeDefined();

    // 1. Career
    expect(report.career.title.length).toBeGreaterThan(0);
    expect(report.career.idealEnvironment.length).toBeGreaterThan(0);
    expect(report.career.toxicEnvironment.length).toBeGreaterThan(0);
    expect(report.career.superPower.length).toBeGreaterThan(0);
    expect(report.career.growthAdvice.length).toBeGreaterThan(0);
    expect(report.career.bestRoles.length).toBe(5);
    expect(report.career.tactics.length).toBeGreaterThan(0);
    expect(report.career.bestPartnerType.length).toBeGreaterThan(0);

    // 2. Romance
    expect(report.romance.title.length).toBeGreaterThan(0);
    expect(report.romance.loveStyle.length).toBeGreaterThan(0);
    expect(report.romance.hiddenTrap.length).toBeGreaterThan(0);
    expect(report.romance.bestPartnerTrait.length).toBeGreaterThan(0);
    expect(report.romance.secretDesire.length).toBeGreaterThan(0);
    expect(report.romance.conflictResolution.length).toBeGreaterThan(0);
    expect(report.romance.idealConditions.length).toBe(3);

    // 3. Manual (取扱説明書 5箇条)
    expect(report.manual.rules.length).toBe(5);
    expect(report.manual.rules[0].title).toContain('第1条');
    expect(report.manual.rules[4].title).toContain('第5条');

    // 4. Mental
    expect(report.mental.title.length).toBeGreaterThan(0);
    expect(report.mental.stressTrigger.length).toBeGreaterThan(0);
    expect(report.mental.dangerSign.length).toBeGreaterThan(0);
    expect(report.mental.quickRecovery.length).toBeGreaterThan(0);
    expect(report.mental.rechargeRoutine.length).toBeGreaterThan(0);
    expect(report.mental.affirmation.length).toBeGreaterThan(0);
  });

  it('should generate custom career roles for innovator type', () => {
    const selfScores: TraitScores = {
      E: 3,
      A: 4,
      C: 2,
      S: 4,
      O: 6,
    };
    const peerScores: TraitScores = {
      E: 3,
      A: 4,
      C: 3,
      S: 4,
      O: 5.5,
    };

    const report = generatePremiumReport(selfScores, peerScores);
    expect(report.career.title).toContain('イノベーター');
    expect(report.career.bestRoles.some(r => r.includes('0→1') || r.includes('プロデューサー'))).toBe(true);
  });
});
