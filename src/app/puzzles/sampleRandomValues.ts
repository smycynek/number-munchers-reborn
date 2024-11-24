import { isFactor } from './predicates';

import {
  boundOffsetMax,
  boundoffsetMin,
  dataUpperBound,
  multipleLowerBound,
  multipleUpperBound,
} from '../constants';
import {
  expressionDataSetHas,
  getBaseFractions,
  getLowerBaseFractions,
  getNaturalNumberSet,
  getValidBetweenValues,
  getValidDifferencePairs,
  getValidDivisionPairs,
  getValidSumPairs,
} from './sampleValidValues';
import {
  AdditionExpressionData,
  DecimalExpressionData,
  DivisionExpressionData,
  ExponentExpressionData,
  MixedNumberExpressionData,
  MultiplicationExpressionData,
  PercentageExpressionData,
  RootExpressionData,
  SubtractionExpressionData,
} from '../../math-components/expression-data/expressionData';
import { round3 } from '../utility';

export function getRandomItemFromSetAndRemove<T>(itemSet: Set<T>): T {
  const items = [...itemSet];
  const item = items[Math.floor(Math.random() * items.length)];
  itemSet.delete(item);
  return item;
}

export function getRandomNaturalNumberSet(
  upperBound: number,
  total: number,
): Set<number> {
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

export function getRandomNumberWithinRangeFromSeed(
  seed: number,
  lower: number,
  upper: number,
): number {
  const range = upper - lower;
  const initial = Math.floor(seed * (range + 1));
  return initial + lower;
}

export function getRandomNumberWithinRange(
  lower: number,
  upper: number,
): number {
  return getRandomNumberWithinRangeFromSeed(Math.random(), lower, upper);
}

// A narrower range used for > and <
export function getRandomBetweenBounds() {
  const bound1 = getRandomNumberWithinRange(
    0,
    dataUpperBound - boundOffsetMax - 2,
  );
  const bound2 =
    bound1 + getRandomNumberWithinRange(boundoffsetMin, boundOffsetMax);
  return [bound1, bound2];
}

// A wider range used for < or >
export function getRandomBetweenBoundsWide() {
  const bound1 = getRandomNumberWithinRange(0, dataUpperBound - 20);
  const bound2 =
    bound1 +
    getRandomNumberWithinRange(boundoffsetMin + 15, boundOffsetMax + 15);
  return [bound1, bound2];
}

export function getValidFactors(num: number): Set<number> {
  const factors = new Set<number>();
  for (let idx = 2; idx < num; idx++) {
    if (isFactor(idx, num)) {
      factors.add(idx);
    }
  }
  return factors;
}

export function getFactorTargets(minimumFactors: number = 2): Set<number> {
  const baseSet = getNaturalNumberSet(dataUpperBound);
  const factorTargets = [...baseSet].filter(
    (f) => getValidFactors(f).size >= minimumFactors,
  );
  return new Set<number>([...factorTargets]);
}

export function getRandomFactorTarget(minimumFactors: number): number {
  return getRandomItemFromSetAndRemove(getFactorTargets(minimumFactors));
}

export function getRandomMultiplicationPairs(
  count: number,
): Set<MultiplicationExpressionData> {
  const valueSet: Set<MultiplicationExpressionData> = new Set();
  for (let idx = 2; idx < 16; idx++) {
    for (let idy = 2; idy < 16; idy++) {
      const pair = new MultiplicationExpressionData(idx, idy);
      if (!expressionDataSetHas(pair, valueSet)) {
        valueSet.add(pair);
      }
    }
  }

  const returnSet: Set<MultiplicationExpressionData> = new Set();
  for (let ic = 0; ic !== count; ic++) {
    returnSet.add(getRandomItemFromSetAndRemove(valueSet));
  }
  return returnSet;
}

export function getRandomSumPairs(
  count: number,
  target: number,
  digits: number,
): Set<AdditionExpressionData> {
  let lower = 1;
  let upper = 5;
  let skip1 = 1;
  let skip2 = 1;

  if (digits === 2) {
    lower *= 10;
    upper *= 10;
    skip1 *= 5;
    skip2 *= 9;
  }

  if (digits === 3) {
    lower *= 100;
    upper *= 100;
    skip1 *= 50;
    skip2 *= 90;
  }

  const valueSet: Set<AdditionExpressionData> = new Set();
  for (let idx = lower; idx < upper; idx += skip1) {
    for (let idy = lower; idy < upper; idy += skip2) {
      const pair = new AdditionExpressionData(idx, idy);
      if (!expressionDataSetHas(pair, valueSet)) {
        valueSet.add(pair);
      }
    }
  }

  const validPairs = getValidSumPairs(target);
  validPairs.forEach((pair) => {
    valueSet.add(new AdditionExpressionData(pair.left, pair.right - 1));
    valueSet.add(new AdditionExpressionData(pair.left + 2, pair.right));
  });

  const returnSet: Set<AdditionExpressionData> = new Set();
  for (let ic = 0; ic !== count; ic++) {
    returnSet.add(getRandomItemFromSetAndRemove(valueSet));
  }
  return returnSet;
}

export function getRandomDifferencePairs(
  count: number,
  target: number,
  digits: number = 2,
): Set<SubtractionExpressionData> {
  let upper = dataUpperBound;
  let lower = 10;
  let skip1 = 5;
  let skip2 = 6;

  if (digits === 3) {
    upper = 999;
    skip1 = 50;
    skip2 = 60;
    lower = 95;
  }

  const valueSet: Set<SubtractionExpressionData> = new Set();
  for (let idx = upper; idx > target; idx -= skip1)
    for (let idy = upper - 1; idy > lower; idy -= skip2) {
      const pair =
        idx > idy
          ? new SubtractionExpressionData(idx, idy)
          : new SubtractionExpressionData(idy, idx);
      if (!expressionDataSetHas(pair, valueSet)) {
        valueSet.add(pair);
      }
    }

  const validPairs = getValidDifferencePairs(target, upper);
  validPairs.forEach((pair) => {
    valueSet.add(new SubtractionExpressionData(pair.left, pair.right - 1));
    valueSet.add(new SubtractionExpressionData(pair.left + 1, pair.right));
  });

  const returnSet: Set<AdditionExpressionData> = new Set();
  for (let ic = 0; ic !== count; ic++) {
    returnSet.add(getRandomItemFromSetAndRemove(valueSet));
  }
  return returnSet;
}

export function getAllExponentPairs(): Set<ExponentExpressionData> {
  const pairs: Set<ExponentExpressionData> = new Set();
  pairs.add(new ExponentExpressionData(2, 1));
  pairs.add(new ExponentExpressionData(2, 2));
  pairs.add(new ExponentExpressionData(2, 3));
  pairs.add(new ExponentExpressionData(2, 4));
  pairs.add(new ExponentExpressionData(2, 5));
  pairs.add(new ExponentExpressionData(2, 6));
  pairs.add(new ExponentExpressionData(2, 7));
  pairs.add(new ExponentExpressionData(2, 8));
  pairs.add(new ExponentExpressionData(3, 1));
  pairs.add(new ExponentExpressionData(3, 2));
  pairs.add(new ExponentExpressionData(3, 3));
  pairs.add(new ExponentExpressionData(3, 4));
  pairs.add(new ExponentExpressionData(3, 5));
  pairs.add(new ExponentExpressionData(4, 1));
  pairs.add(new ExponentExpressionData(4, 2));
  pairs.add(new ExponentExpressionData(4, 3));
  pairs.add(new ExponentExpressionData(4, 4));
  pairs.add(new ExponentExpressionData(5, 1));
  pairs.add(new ExponentExpressionData(5, 2));
  pairs.add(new ExponentExpressionData(5, 3));
  pairs.add(new ExponentExpressionData(7, 1));
  pairs.add(new ExponentExpressionData(7, 2));
  pairs.add(new ExponentExpressionData(8, 1));
  pairs.add(new ExponentExpressionData(8, 2));
  pairs.add(new ExponentExpressionData(9, 1));
  pairs.add(new ExponentExpressionData(9, 2));
  pairs.add(new ExponentExpressionData(10, 1));
  pairs.add(new ExponentExpressionData(10, 2));
  return pairs;
}

export function getAllRootPairs(): Set<RootExpressionData> {
  const pairs: Set<RootExpressionData> = new Set();
  pairs.add(new RootExpressionData(1, 2, 4));
  pairs.add(new RootExpressionData(1, 2, 9));
  pairs.add(new RootExpressionData(1, 2, 16));
  pairs.add(new RootExpressionData(1, 2, 25));
  pairs.add(new RootExpressionData(1, 2, 36));
  pairs.add(new RootExpressionData(1, 2, 49));
  pairs.add(new RootExpressionData(1, 2, 64));
  pairs.add(new RootExpressionData(1, 2, 81));
  pairs.add(new RootExpressionData(1, 2, 100));
  pairs.add(new RootExpressionData(1, 3, 8));
  pairs.add(new RootExpressionData(1, 3, 27));
  pairs.add(new RootExpressionData(1, 3, 64));
  pairs.add(new RootExpressionData(1, 3, 125));
  pairs.add(new RootExpressionData(1, 3, 216));
  pairs.add(new RootExpressionData(1, 4, 81));
  pairs.add(new RootExpressionData(1, 4, 256));
  pairs.add(new RootExpressionData(1, 5, 32));
  pairs.add(new RootExpressionData(1, 6, 64));
  pairs.add(new RootExpressionData(1, 7, 128));
  pairs.add(new RootExpressionData(1, 8, 256));
  return pairs;
}

export function getAllRootValues(): Set<number> {
  return new Set<number>([...getAllRootPairs()].map((exp) => exp.value));
}

export function getAllExponentValues(): Set<number> {
  return new Set<number>([...getAllExponentPairs()].map((exp) => exp.value));
}

export function getRandomExponentPairs(
  count: number,
): Set<ExponentExpressionData> {
  const pairs = getAllExponentPairs();
  const returnSet: Set<ExponentExpressionData> = new Set();

  for (let idc = 0; idc !== count; idc++) {
    returnSet.add(getRandomItemFromSetAndRemove(pairs));
  }
  return returnSet;
}

export function getRandomRootPairs(count: number): Set<RootExpressionData> {
  const pairs = getAllRootPairs();
  const returnSet: Set<RootExpressionData> = new Set();

  for (let idc = 0; idc !== count; idc++) {
    returnSet.add(getRandomItemFromSetAndRemove(pairs));
  }
  return returnSet;
}

export function getRandomMultipleBase(): number {
  return getRandomNumberWithinRange(multipleLowerBound, multipleUpperBound);
}

export function getRandomDivisionPairs(
  count: number,
): Set<DivisionExpressionData> {
  const valueSet: Set<DivisionExpressionData> = new Set();
  const returnSet: Set<DivisionExpressionData> = new Set();
  for (let idq = 2; idq < 12; idq++) {
    const validPairs = getValidDivisionPairs(idq);
    validPairs.forEach((v) => {
      if (!expressionDataSetHas(v, valueSet)) {
        valueSet.add(v);
      }
    });
  }
  let itemCount = count;
  if (valueSet.size < itemCount) {
    itemCount = valueSet.size;
  }
  for (let idc = 0; idc !== itemCount; idc++) {
    returnSet.add(getRandomItemFromSetAndRemove(valueSet));
  }
  return returnSet;
}

export function getRandomFractionBase(): MixedNumberExpressionData {
  return getRandomItemFromSetAndRemove(getBaseFractions());
}

export function getRandomFractionLowerBase(): MixedNumberExpressionData {
  return getRandomItemFromSetAndRemove(getLowerBaseFractions());
}

export function getRandomPercentages(
  count: number,
): Set<PercentageExpressionData> {
  const percentageDigits = getNaturalNumberSet(100);
  const returnSet = new Set<PercentageExpressionData>();
  for (let idx = 0; idx < count; idx++) {
    const percent = getRandomItemFromSetAndRemove(percentageDigits);
    returnSet.add(new PercentageExpressionData(percent));
  }
  return returnSet;
}

export function getRandomDecimals(count: number): Set<DecimalExpressionData> {
  const decimals = new Set<DecimalExpressionData>();
  const validPercentageDigits = getValidBetweenValues(1, 99, true);
  validPercentageDigits.forEach((val) => {
    const decimal = round3(val / 100);
    decimals.add(new DecimalExpressionData(decimal));
  });
  const returnSet = new Set<DecimalExpressionData>();
  for (let idx: number = 0; idx < count; idx++) {
    returnSet.add(getRandomItemFromSetAndRemove(decimals));
  }
  return returnSet;
}

export function getRandomFractions(
  count: number,
  base: MixedNumberExpressionData,
): Set<MixedNumberExpressionData> {
  const valueSet: Set<MixedNumberExpressionData> = new Set();
  const returnSet: Set<MixedNumberExpressionData> = new Set();
  for (let idx = 1; idx != 21; idx++) {
    for (let idy = 2; idy != 21; idy++) {
      if (idx === base.numerator && idy === base.denominator) {
        // Don't add fractions with the same components as the base fraction to the random mix
        continue;
      }
      if (idy <= idx) {
        continue;
      }
      valueSet.add(new MixedNumberExpressionData(0, idx, idy));
    }
  }
  for (let idc = 0; idc != count; idc++) {
    returnSet.add(getRandomItemFromSetAndRemove(valueSet));
  }
  return returnSet;
}
