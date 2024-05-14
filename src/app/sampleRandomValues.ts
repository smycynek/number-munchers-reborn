import {
  dataUpperBound,
  boundoffsetMin,
  boundOffsetMax,
  multipleLowerBound,
  multipleUpperBound
}
  from "./constants";
import { getFactorTargets, getNaturalNumberSet } from "./sampleValidValues";

// A narrower range used for > and <
export function getRandomBetweenBounds() {
  const bound1 = getRandomNumberWithinRange(0, dataUpperBound);
  const bound2 = bound1 + getRandomNumberWithinRange(boundoffsetMin, boundOffsetMax);
  return [bound1, bound2];
}

// A wider range used for < or >
export function getRandomBetweenBoundsWide() {
  const bound1 = getRandomNumberWithinRange(0, dataUpperBound - 20);
  const bound2 = bound1 + getRandomNumberWithinRange(boundoffsetMin + 15, boundOffsetMax + 15);
  return [bound1, bound2];
}

export function getRandomFactorTarget(): number {
  return getRandomItemFromSetAndRemove(getFactorTargets());
}

export function getRandomItemFromSetAndRemove(numberSet: Set<number>): number {
  const numbers = [...numberSet];
  const number = numbers[Math.floor(Math.random() * numbers.length)];
  numberSet.delete(number);
  return number;
}

export function getRandomNaturalNumberSet(upperBound: number, total: number): Set<number> {
  if (total > upperBound) {
    throw Error("upper bound too low");
  }
  const numberSet = getNaturalNumberSet(upperBound);
  const collection: Set<number> = new Set();
  for (let idx = 0; idx != total; idx++) {
    collection.add(getRandomItemFromSetAndRemove(numberSet));
  }
  return collection;
}

export function getRandomNumberWithinRangeFromSeed(seed: number, lower: number, upper: number): number {
  const range = upper - lower;
  const initial = Math.floor(seed * (range + 1));
  return initial + lower;
}

export function getRandomNumberWithinRange(lower: number, upper: number): number {
  return getRandomNumberWithinRangeFromSeed(Math.random(), lower, upper);
}

export function getRandomMultipleBase(): number {
  return getRandomNumberWithinRange(multipleLowerBound, multipleUpperBound);
}

