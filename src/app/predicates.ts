import { primes } from "./sampleValidValues";

export function isBetween(value: number, lower: number, upper: number, inclusive: boolean): boolean {
  if (inclusive) {
    return value >= lower && value <= upper;
  } else {
    return value > lower && value < upper;
  }
}

export function isFactor(candidateFactor: number, target: number): boolean {
  return ((target % candidateFactor) === 0);
}

export function isMultiple(target: number, base: number) {
  return ((target % base) === 0);
}

export function isOutsideExclusive(value: number, lower: number, upper: number): boolean {
  return !isBetween(value, lower, upper, true);
}

export function isPerfectSquare(value: number): boolean {
  return (Math.sqrt(value) === Math.floor(Math.sqrt(value)));
}

export function isPrime(value: number): boolean {
  return primes.has(value);
}