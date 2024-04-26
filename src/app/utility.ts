import { boundOffsetMax, boundoffsetMin, dataUpperBound, multipleLowerBound, multipleUpperBound } from "./constants";

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

function getRandomItemAndRemove(numberSet: Set<number>): number {
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

export function getBetweenBounds() {
  const bound1 = randomRange(0, dataUpperBound);
  const bound2 = bound1 + randomRange(boundoffsetMin, boundOffsetMax);
  return [bound1, bound2];
}

export function getMultipleBounds(): number {
  return randomRange(multipleLowerBound, multipleUpperBound);
}

