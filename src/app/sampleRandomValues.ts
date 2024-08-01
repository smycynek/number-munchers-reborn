

import {  getNaturalNumberSet } from './sampleValidValues';




export function getRandomItemFromSetAndRemove<T>(numberSet: Set<T>): T {
  const numbers = [...numberSet];
  const number = numbers[Math.floor(Math.random() * numbers.length)];
  numberSet.delete(number);
  return number;
}

export function getRandomNaturalNumberSet(upperBound: number, total: number): Set<number> {
  if (total > upperBound) {
    throw Error('upper bound too low');
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

