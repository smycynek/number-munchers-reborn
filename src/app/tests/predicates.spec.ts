import {
  isBetween,
  isFactor,
  isMultiple,
  isPerfectSquare,
  isOutsideExclusive,
} from '../predicates';
/*
This is a little bit of overkill, but if I'm making a game
for kids, I want to make sure output is correct.

Eventually, I'll add standalone unit tests that doesn't
require ng test
*/

describe('PseudoUnitTests-Predicates', () => {
  it('isBetween should accept and reject values properly ', () => {
    expect(isBetween(3, 2, 5, true)).toBe(true); // in range
    expect(isBetween(2, 2, 5, true)).toBe(true); // in range inc
    expect(isBetween(5, 2, 5, true)).toBe(true); // in range inc
    expect(isBetween(1, 2, 5, true)).toBe(false); // not in range inc
    expect(isBetween(6, 2, 5, true)).toBe(false); // not in range inc

    expect(isBetween(3, 2, 5, false)).toBe(true); // in range ni
    expect(isBetween(2, 2, 5, false)).toBe(false); // not in range ni
    expect(isBetween(5, 2, 5, false)).toBe(false); // not in range ni
    expect(isBetween(1, 2, 5, false)).toBe(false); // not in range ni
    expect(isBetween(6, 2, 5, false)).toBe(false); // not in range ni
  });

  it('isFactor should accept and reject values properly ', () => {
    expect(isFactor(3, 6)).toBe(true);
    expect(isFactor(3, 3)).toBe(true);
    expect(isFactor(3, 5)).toBe(false);
  });

  it('isMultiple should accept and reject values properly ', () => {
    expect(isMultiple(6, 3)).toBe(true);
    expect(isMultiple(6, 6)).toBe(true);
    expect(isMultiple(6, 4)).toBe(false);
  });

  it('isOutsideExclusive should accept and reject values properly ', () => {
    expect(isOutsideExclusive(3, 2, 5)).toBe(false); // clearly between
    expect(isOutsideExclusive(1, 2, 5)).toBe(true); // clearly not between
    expect(isOutsideExclusive(2, 2, 5)).toBe(false); // between inclusive
    expect(isOutsideExclusive(5, 2, 5)).toBe(false); // between inclusive
  });

  it('isPerfectSquare should accept and reject values properly ', () => {
    expect(isPerfectSquare(9)).toBe(true);
    expect(isPerfectSquare(1)).toBe(true);
    expect(isPerfectSquare(8)).toBe(false);
  });
});
