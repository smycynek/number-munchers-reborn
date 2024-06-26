import { dataUpperBound, divSymbol, multSymbol } from './constants';
import { ValuePair } from './dataCell';
import { mb, parseFraction } from './mixed-value-sentence/mathBuilder';
import {
  isBetween,
  isOutsideExclusive,
  isFactor,
  isPerfectSquare
} from './predicates';

const perfectSquares = new Set<number>([...getNaturalNumberSet(dataUpperBound)].filter(n => isPerfectSquare(n)));
const primes = new Set<number>([1, 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]);

export function getValidMultiples(num: number): Set<number> {
  const multiples: Set<number> = new Set();
  for (let idx = 2; idx != 10; idx++) {
    multiples.add(num * idx);
  }
  return multiples;
}

export function getPrimes(): Set<number> {
  return new Set<number>([...primes]);
}

export function getPerfectSquares(): Set<number> {
  return new Set<number>([...perfectSquares]);
}

export function getFactorTargets(minimumFactors: number = 2): Set<number> {
  const baseSet = getNaturalNumberSet(dataUpperBound);
  const factorTargets = [...baseSet].filter(f => getValidFactors(f).size >= minimumFactors)
  return new Set<number>([...factorTargets]);
}

export function getValidBetweenValues(lower: number, upper: number, inclusive: boolean): Set<number> {
  return new Set([...getNaturalNumberSet(dataUpperBound)].filter(value => isBetween(value, lower, upper, inclusive)));
}

export function getValidOutsideExclusiveValues(lower: number, upper: number): Set<number> {
  return new Set([...getNaturalNumberSet(dataUpperBound)].filter(value => isOutsideExclusive(value, lower, upper)));
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

export function getNaturalNumberSet(upperBound: number): Set<number> {
  const base = [...[].constructor(upperBound + 1).keys()]
  const baseSet = new Set(base);
  baseSet.delete(0);
  return baseSet
}

export function getValidMultiplicationPairs(target: number): Set<ValuePair> {
  const pairs: Set<ValuePair> = new Set();
  const factors = getValidFactors(target);
  factors.forEach(val => pairs.add(new ValuePair(target, mb().expression(val, target / val, multSymbol).build())));
  return pairs;
}

export function getValidDivisionPairs(target: number): Set<ValuePair> {
  const pairs: Set<ValuePair> = new Set();
  const multiples = getValidMultiples(target);

  multiples.forEach(mul => {
    const otherParam = mul / target;
    pairs.add(new ValuePair(target, mb().expression(mul, otherParam, divSymbol).build()));
  });
  return pairs;
}

export function getBaseFractions(): Set<ValuePair> {
  const newFractionPair = (idn: number, idd: number) => new ValuePair(idn / idd, mb().fraction(idn, idd).build());

  const pairs: Set<ValuePair> = new Set();
  
  /* I could create a loop, but I felt like naming the
   target fractions explicitly.  Depending on how the gameplay goes,
   I might want fractions that have only one other equivalency, like
   1/10 and 2/20, or I might prefer to eliminate or just reduce those answers
   */

  pairs.add(newFractionPair(1, 2));
  pairs.add(newFractionPair(1, 3));
  pairs.add(newFractionPair(1, 4));
  pairs.add(newFractionPair(1, 5));
  pairs.add(newFractionPair(1, 6));

  pairs.add(newFractionPair(2, 3));
  pairs.add(newFractionPair(2, 4));
  pairs.add(newFractionPair(3, 4));
  pairs.add(newFractionPair(2, 5));
  pairs.add(newFractionPair(3, 5));
  pairs.add(newFractionPair(4, 5));

  pairs.add(newFractionPair(2, 6));
  pairs.add(newFractionPair(3, 6));
  pairs.add(newFractionPair(4, 6));
  pairs.add(newFractionPair(5, 6));


  pairs.add(newFractionPair(1, 7));
  pairs.add(newFractionPair(2, 7));
  pairs.add(newFractionPair(3, 7));
  pairs.add(newFractionPair(4, 7));
  pairs.add(newFractionPair(5, 7));
  pairs.add(newFractionPair(6, 7));

  pairs.add(newFractionPair(1, 8));
  pairs.add(newFractionPair(2, 8));
  pairs.add(newFractionPair(3, 8));
  pairs.add(newFractionPair(4, 8));
  pairs.add(newFractionPair(5, 8));
  pairs.add(newFractionPair(6, 8));
  pairs.add(newFractionPair(7, 8));


  pairs.add(newFractionPair(1, 9));
  pairs.add(newFractionPair(2, 9));
  pairs.add(newFractionPair(3, 9));
  pairs.add(newFractionPair(6, 9));

  pairs.add(newFractionPair(1, 10));
  pairs.add(newFractionPair(2, 10));
  pairs.add(newFractionPair(4, 10));
  pairs.add(newFractionPair(5, 10));
  pairs.add(newFractionPair(6, 10));
  pairs.add(newFractionPair(8, 10));
  pairs.add(newFractionPair(9, 10));

  pairs.add(newFractionPair(2, 12));
  pairs.add(newFractionPair(3, 12));
  pairs.add(newFractionPair(4, 12));
  pairs.add(newFractionPair(6, 12));
  pairs.add(newFractionPair(8, 12));
  pairs.add(newFractionPair(9, 12));


  pairs.add(newFractionPair(3, 15));
  pairs.add(newFractionPair(5, 15));
  pairs.add(newFractionPair(10, 15));


  pairs.add(newFractionPair(2, 16));
  pairs.add(newFractionPair(4, 16));
  pairs.add(newFractionPair(6, 16));
  pairs.add(newFractionPair(8, 16));
  pairs.add(newFractionPair(10, 16));
  pairs.add(newFractionPair(12, 16));
  pairs.add(newFractionPair(14, 16));


  pairs.add(newFractionPair(2, 18));
  pairs.add(newFractionPair(3, 18));
  pairs.add(newFractionPair(6, 18));
  pairs.add(newFractionPair(9, 18));
  pairs.add(newFractionPair(12, 18));

  pairs.add(newFractionPair(2, 20));
  pairs.add(newFractionPair(4, 20));
  pairs.add(newFractionPair(6, 20));
  pairs.add(newFractionPair(8, 20));
  pairs.add(newFractionPair(10, 20));
  pairs.add(newFractionPair(12, 20));
  pairs.add(newFractionPair(16, 20));
  pairs.add(newFractionPair(18, 20));
  return pairs;
}

export function getValidFractions(target: ValuePair) {
  const fractionParts = parseFraction(target.valueAsString);
  const valueSet: Set<ValuePair> = new Set();
  for (let idx = 1; idx != 21; idx++) {
    for (let idy = 2; idy != 21; idy++) {
      if ((idx / idy === target.value) && !(fractionParts[0] == idx && fractionParts[1] == idy)) {
        // Add equivalent fractions but not the exact same fraction to the valid fraction list
        valueSet.add(new ValuePair((idx / idy), mb().fraction(idx, idy).build()));
      }
    }
  }
  return valueSet;
}
