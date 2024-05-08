import { dataUpperBound } from "./constants";
import { isBetween,
  isOutsideExclusive,
  isFactor,
  isPerfectSquare } from "./predicates";

export const perfectSquares = new Set<number>([...getNaturalNumberSet(dataUpperBound)].filter(n => isPerfectSquare(n)));
export const primes = new Set<number> ([0, 1, 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97]);
export const factorTargets = new Set([...getNaturalNumberSet(dataUpperBound)].filter(n => !primes.has(n)));

export function getValidMultiples(num: number): Set<number> {
    const multiples: Set<number> = new Set();
    for (let idx = 2; idx != 10; idx++) {
    multiples.add(num * idx);
    }
    return multiples;
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