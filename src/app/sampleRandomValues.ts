

import { isFactor } from './predicates';

import { dataUpperBound } from './constants';
import { expressionDataSetHas, getBaseFractions, getNaturalNumberSet } from './sampleValidValues';
import { MixedNumberExpressionData, MultiplicationExpressionData } from '../math-components/expression-data/expressionData';


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
  const factorTargets = [...baseSet].filter(f => getValidFactors(f).size >= minimumFactors)
  return new Set<number>([...factorTargets]);
}

export function getRandomFactorTarget(minimumFactors: number): number {
  return getRandomItemFromSetAndRemove(getFactorTargets(minimumFactors));
}


export function getRandomMultiplicationPairs(count: number): Set<MultiplicationExpressionData> {
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
    returnSet.add(getRandomItemFromSetAndRemove(valueSet))
  }
  return returnSet;
}

export function getRandomFractionBase(): MixedNumberExpressionData {
  return getRandomItemFromSetAndRemove(getBaseFractions());
}

export function getRandomFractions(count: number, base: MixedNumberExpressionData ) {
  const valueSet: Set<MixedNumberExpressionData> = new Set();
  const returnSet: Set<MixedNumberExpressionData> = new Set();
  for (let idx=1; idx !=21; idx++) {
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