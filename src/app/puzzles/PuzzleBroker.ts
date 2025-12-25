import { PuzzleType } from '../services/puzzle-type.service';
import { getRandomNumberWithinRange } from './sampleRandomValues';
import { Puzzle } from './Puzzle';
import { Addition } from './puzzles/Addition';
import { Between } from './puzzles/Between';
import { BetweenInclusive } from './puzzles/BetweenInclusive';
import { DivisibleBy } from './puzzles/DivisibleBy';
import { Division } from './puzzles/Division';
import { Exponents } from './puzzles/Exponents';
import { Factors } from './puzzles/Factors';
import { FractionEquivalent } from './puzzles/FractionEquivalent';
import { FractionGreaterThanHalf } from './puzzles/FractionGreaterThanHalf';
import { FractionLessThanHalf } from './puzzles/FractionLessThanHalf';
import { Multiples } from './puzzles/Multiples';
import { Multiplication } from './puzzles/Multiplication';
import { OutsideExclusive } from './puzzles/OutsideExclusive';
import { Odds } from './puzzles/Odds';
import { PerfectSquares } from './puzzles/PerfectSquares';
import { Primes } from './puzzles/Primes';
import { Roots } from './puzzles/Roots';
import { Subtraction } from './puzzles/Subtraction';
import { Percentages } from './puzzles/Percentages';
import { Decimals } from './puzzles/Decimals';
import { Evens } from './puzzles/Evens';

export function getRandomPuzzle(puzzleTypes: Set<PuzzleType>) {
  const puzzles: Puzzle[] = [
    new Addition(2),
    new Addition(2),
    new Addition(3),
    new Subtraction(2),
    new Subtraction(2),
    new Subtraction(3),
    new Between(),
    new BetweenInclusive(),
    new OutsideExclusive(),
    new Multiplication(),
    new Multiples(),
    new Factors(),
    new PerfectSquares(),
    new Primes(),
    new FractionEquivalent(),
    new FractionGreaterThanHalf(),
    new FractionLessThanHalf(),
    new Percentages(),
    new Division(),
    new DivisibleBy(),
    new Roots(),
    new Exponents(),
    new Decimals(),
    new Odds(),
    new Evens(),
  ];
  const puzzlesFiltered = puzzles.filter((p) => puzzleTypes.has(p.type) && p.include);
  return puzzlesFiltered[getRandomNumberWithinRange(0, puzzlesFiltered.length - 1)];
}
