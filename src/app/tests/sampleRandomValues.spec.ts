import {
  getRandomNaturalNumberSet,
  getRandomNumberWithinRange,
  getRandomNumberWithinRangeFromSeed,
} from '../puzzles/sampleRandomValues';
import { getNaturalNumberSet } from '../puzzles/sampleValidValues';
import { getRandomItemFromSetAndRemove } from '../utility';

/*
This is a little bit of overkill, but if I'm making a game
for kids, I want to make sure output is correct.

Eventualy, I'll add standalone unit tests that doesn't
require ng test
*/

describe('PseudoUnitTests-SampleRandomValues', () => {
  it('getRandomNaturalNumberSet gives a valid range set', () => {
    const randomNaturals = getRandomNaturalNumberSet(99, 99);
    expect(randomNaturals.size).toEqual(99);
    expect([...randomNaturals].every((val) => val >= 1 && val <= 99)).toBe(
      true,
    );
  });

  it('getRandomNumberWithinRange gives a number within a range', () => {
    const diceRoll = getRandomNumberWithinRange(1, 6);
    expect(diceRoll <= 6 && diceRoll >= 1).toBe(true);
    const lowRoll = getRandomNumberWithinRangeFromSeed(0, 1, 6);
    const highRoll = getRandomNumberWithinRangeFromSeed(0.9999, 1, 6);
    expect(lowRoll).toBe(1);
    expect(highRoll).toBe(6);
  });

  it('getRandomItemFromSetAndRemove removes a random number from a set', () => {
    const set = getNaturalNumberSet(5);
    expect(set.size).toEqual(5);
    const val = getRandomItemFromSetAndRemove(set);
    expect(set.size).toEqual(4);
    expect(set.has(val)).toEqual(false);
  });
});
