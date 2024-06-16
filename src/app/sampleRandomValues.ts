import {
  dataUpperBound,
  boundoffsetMin,
  boundOffsetMax,
  multipleLowerBound,
  multipleUpperBound,
  multSymbol,
}
  from './constants';
import { ValuePair } from './dataCell';
import { mb, parseFraction } from './mixed-value-sentence/mathBuilder';
import { getBaseFractions, getFactorTargets, getNaturalNumberSet, getValidDivisionPairs } from './sampleValidValues';
import { valuePairSetHas } from './utility';

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

export function getRandomFactorTarget(minimumFactors: number): number {
  return getRandomItemFromSetAndRemove(getFactorTargets(minimumFactors));
}

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

export function getRandomMultipleBase(): number {
  return getRandomNumberWithinRange(multipleLowerBound, multipleUpperBound);
}

export function getRandomMultiplicationPairs(count: number): Set<ValuePair> {
  const valueSet: Set<ValuePair> = new Set();
  for (let idx = 2; idx < 16; idx++) {
    for (let idy = 2; idy < 16; idy++) {
      const pair = new ValuePair(idx * idy, mb().expression(idx, idy, multSymbol).build());
      if (!valuePairSetHas(pair, valueSet)) {
        valueSet.add(pair);
      }
    }
  }
  const returnSet: Set<ValuePair> = new Set();
  for (let ic = 0; ic !== count; ic++) {
    returnSet.add(getRandomItemFromSetAndRemove(valueSet))
  }
  return returnSet;
}

export function getRandomDivisionPairs(count: number): Set<ValuePair> {
  const valueSet: Set<ValuePair> = new Set();
  const returnSet: Set<ValuePair> = new Set();
  for (let idq = 2; idq < 12; idq++) {
    getValidDivisionPairs(idq).forEach(v => {
      if (!valuePairSetHas(v, valueSet)) {
        valueSet.add(v);
      }
    });
  }
  for (let idc = 0; idc != count; idc++) {
    returnSet.add(getRandomItemFromSetAndRemove(valueSet));
  }
  return returnSet;
}

export function getRandomFractionBase(): ValuePair {
  return getRandomItemFromSetAndRemove(getBaseFractions());
}

export function getRandomFractions(count: number, base: ValuePair ) {
  const valueSet: Set<ValuePair> = new Set();
  const returnSet: Set<ValuePair> = new Set();
  const fractionParts = parseFraction(base.valueAsString);
  for (let idx=1; idx !=21; idx++) {
    for (let idy = 2; idy != 21; idy++) {
      if (idx === fractionParts[0] && idy === fractionParts[1]) {  
        // Don't add fractions with the same components as the base fraction to the random mix
        continue;
      }
      if (idy <= idx) {
        continue;
      }
      valueSet.add(new ValuePair((idx/idy), mb().fraction(idx, idy).build()));
  }
}
for (let idc = 0; idc != count; idc++) {
  returnSet.add(getRandomItemFromSetAndRemove(valueSet));
}
return returnSet;
}