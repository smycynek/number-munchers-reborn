import { boundOffsetMax, boundoffsetMin, dataUpperBound, multipleLowerBound, multipleUpperBound } from "./constants";

export const perfectSquares = new Set([...getRangeSet(9)].map(n => n*n));
export const primes =new Set<number> ([0, 1, 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]);

export function hasTouch(): boolean {
  return ('ontouchstart' in window);
}

export function getRandomIndicies(count: number, upperBound: number): Set<number> {
  const startingIndices = getRangeSet(upperBound);
  startingIndices.add(0);
  const indicies = new Set<number>();
  for (let idx = 0; idx != count; idx++) {
    const index = getRandomItemAndRemove(startingIndices);
    indicies.add(index);
  }
  return indicies;
}

export function wrapUp(value: number, max: number): number {
  if (value === max - 1) {
    return 0;
  }
  return value + 1;
}

export function wrapDown(value: number, max: number): number {
  if (value === 0) {
    return max - 1;
  }
  return value - 1;
}

export function parseId(cellId: string): number[] {
  cellId = cellId.replace("i", "");
  const parsed = [Number(cellId[0]), Number(cellId[1])];
  if (parsed.length != 2 || isNaN(parsed[0]) || isNaN(parsed[1])) {
    throw new Error("Not a cell id");
  }
  return parsed;
}

export function getRandomItemAndRemove(numberSet: Set<number>): number {
  const numbers = [...numberSet];
  const number = numbers[Math.floor(Math.random() * numbers.length)];
  numberSet.delete(number);
  return number;
}

function getRangeSet(upperBound: number): Set<number> {
  const base = [...[].constructor(upperBound + 1).keys()]
  const baseSet = new Set(base);
  baseSet.delete(0);
  return baseSet
}

export function getUniqueCollection(upper: number, total: number): number[] {
  const numberSet = getRangeSet(upper);
  const collection: number[] = [];
  for (let idx = 0; idx != total; idx++) {
    collection.push(getRandomItemAndRemove(numberSet));
  }
  return collection;
}

export function randomRange(lower: number, upper: number): number {
  const range = upper - lower;
  const initial = Math.floor(Math.random() * (range + 1));
  return initial + lower;
}

// A narrower range used for > and <
export function getBetweenBounds() {
  const bound1 = randomRange(0, dataUpperBound);
  const bound2 = bound1 + randomRange(boundoffsetMin, boundOffsetMax);
  return [bound1, bound2];
}

// A wider range used for < or >
export function getBetweenBoundsWide() {
  const bound1 = randomRange(0, dataUpperBound - 20);
  const bound2 = bound1 + randomRange(boundoffsetMin + 15, boundOffsetMax + 15 );
  return [bound1, bound2];
}

export function getMultipleBounds(): number {
  return randomRange(multipleLowerBound, multipleUpperBound);
}

export function getValidMultiples(num: number): Set<number> {
  const multiples: Set<number> = new Set();
  for (let idx = 2; idx != 10; idx++) {
  multiples.add(num * idx);
  }
  return multiples;
}

export function between(lower: number, upper: number, inclusive: boolean): Set<number> {
  const betweens = new Set<number>();
  const lbound = inclusive ? lower: lower+1;
  const ubound = inclusive ? upper: upper-1;
  for (let idx = lbound; idx <= ubound; idx++) {
    betweens.add(idx);
  }
  return betweens;
}

export function greaterThanOrLessThan(lower: number, upper: number): Set<number> {
  const greaterThanOrLessThans = new Set<number>();
  for (let idx = lower - 1; idx >= 1; idx--) {
    greaterThanOrLessThans.add(idx);
  }
  for (let idx = upper + 1; idx <= dataUpperBound; idx++) {
    greaterThanOrLessThans.add(idx);
  }
  return greaterThanOrLessThans;
}

export function factors(num: number): Set<number> {
  const factors = new Set<number>();
  for (let idx = 2; idx < num; idx++) {
    if (num % idx == 0) {
      factors.add(idx);
    }
  }
  return factors;
}

let LOG = false;

export function toggleLog(): void {
  LOG = !LOG;
}

export function debug(message: string) {
  if (LOG) {
  console.log(message)
  }
}