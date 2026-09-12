import { describe, it, expect } from 'vitest';
import { calculateCompatibility, calculatePairCompatibility } from '../src/lib/core/compatibility';
import { TraitScores } from '../src/lib/core/types';

describe('Compatibility Logic', () => {
  it('calculateCompatibility should return a valid result with score between 72 and 99', () => {
    const host: TraitScores = { E: 5, A: 5, C: 5, S: 5, O: 5 };
    const peer: TraitScores = { E: 5, A: 5, C: 5, S: 5, O: 5 };

    const result = calculateCompatibility(host, peer);
    expect(result.score).toBeGreaterThanOrEqual(72);
    expect(result.score).toBeLessThanOrEqual(99);
    expect(result.typeName.length).toBeGreaterThan(0);
    expect(result.description.length).toBeGreaterThan(0);
    expect(result.strongPoint.length).toBeGreaterThan(0);
  });

  it('calculatePairCompatibility should generate detailed pair chemistry for host and peer', () => {
    const self: TraitScores = { E: 2, A: 4, C: 5, S: 4, O: 6 };
    const peer: TraitScores = { E: 6, A: 5, C: 4, S: 5, O: 5 };

    const result = calculatePairCompatibility(self, peer, 'けー', '田中');

    expect(result.peerNickname).toBe('田中');
    expect(result.score).toBeGreaterThanOrEqual(70);
    expect(result.score).toBeLessThanOrEqual(100);
    expect(result.title.length).toBeGreaterThan(0);
    expect(result.tagline.length).toBeGreaterThan(0);
    expect(result.peerImpression).toContain('田中');
    expect(result.goodChemistry.length).toBeGreaterThan(0);
    expect(result.blindSpot.length).toBeGreaterThan(0);
    expect(result.advice.length).toBeGreaterThan(0);
    expect(result.magicTopic.length).toBeGreaterThan(0);
  });
});
