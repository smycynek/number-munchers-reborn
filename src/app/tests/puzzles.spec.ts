import {
  AdditionExpressionData,
  MixedNumberExpressionData,
  RootExpressionData,
  SubtractionExpressionData,
} from '../../math-components/expression-data/expressionData';
import { Addition } from '../puzzles/puzzles/Addition';
import { Multiples } from '../puzzles/puzzles/Multiples';
import { Multiplication } from '../puzzles/puzzles/Multiplication';
import { Roots } from '../puzzles/puzzles/Roots';
import { Subtraction } from '../puzzles/puzzles/Subtraction';
import { Factors } from '../puzzles/puzzles/Factors';
import { Division } from '../puzzles/puzzles/Division';
import { Primes } from '../puzzles/puzzles/Primes';
import { PerfectSquares } from '../puzzles/puzzles/PerfectSquares';
import { DivisibleBy } from '../puzzles/puzzles/DivisibleBy';
import { FractionEquivalent } from '../puzzles/puzzles/FractionEquivalent';
import { FractionGreaterThanHalf } from '../puzzles/puzzles/FractionGreaterThanHalf';
import { FractionLessThanHalf } from '../puzzles/puzzles/FractionLessThanHalf';
import { Exponents } from '../puzzles/puzzles/Exponents';
import { Percentages } from '../puzzles/puzzles/Percentages';
import { Between } from '../puzzles/puzzles/Between';
import { OutsideExclusive } from '../puzzles/puzzles/OutsideExclusive';
import { BetweenInclusive } from '../puzzles/puzzles/BetweenInclusive';
/*
This is a little bit of overkill, but if I'm making a game
for kids, I want to make sure output is correct.

Eventually, I'll add standalone unit tests that don't
require ng test
*/

describe('PseudoUnitTests-Puzzles', () => {
  it('Should accepts and reject addition values ', () => {
    const additionPuzzle = new Addition();
    const valid = new AdditionExpressionData(additionPuzzle.target1.value, 0);
    const invalid = new AdditionExpressionData(additionPuzzle.target1.value, 1);
    expect(additionPuzzle.predicate(valid)).toBeTrue();
    expect(additionPuzzle.predicate(invalid)).toBeFalse();
  });

  it('Should accepts and reject subtraction values ', () => {
    const subtractionPuzzle = new Subtraction(3);
    const valid = new SubtractionExpressionData(
      subtractionPuzzle.target1.value,
      0,
    );
    const invalid = new SubtractionExpressionData(
      subtractionPuzzle.target1.value,
      1,
    );
    expect(subtractionPuzzle.predicate(valid)).toBeTrue();
    expect(subtractionPuzzle.predicate(invalid)).toBeFalse();
  });

  it('Should accepts and reject multiple values ', () => {
    const multiplesPuzzle = new Multiples();
    const valid = new MixedNumberExpressionData(
      multiplesPuzzle.target1.value * 3,
      0,
      0,
    );
    const invalid = new MixedNumberExpressionData(
      multiplesPuzzle.target1.value * 1.5,
      0,
      0,
    );
    expect(multiplesPuzzle.predicate(valid)).toBeTrue();
    expect(multiplesPuzzle.predicate(invalid)).toBeFalse();
  });

  it('Should accepts and reject multiplication values ', () => {
    const multiplicationPuzzle = new Multiplication();
    const valid = multiplicationPuzzle.target1;
    const invalid = new MixedNumberExpressionData(0, 0, 0);
    expect(multiplicationPuzzle.predicate(valid)).toBeTrue();
    expect(multiplicationPuzzle.predicate(invalid)).toBeFalse();
  });

  it('Should accepts and reject multiplication values ', () => {
    const multiplicationPuzzle = new Multiplication();
    const valid = multiplicationPuzzle.target1;
    const invalid = new MixedNumberExpressionData(0, 0, 0);
    expect(multiplicationPuzzle.predicate(valid)).toBeTrue();
    expect(multiplicationPuzzle.predicate(invalid)).toBeFalse();
  });

  it('Should accepts and reject factor values ', () => {
    const factorPuzzle = new Factors();
    const valid = new MixedNumberExpressionData(1, 0, 0);
    const invalid = new MixedNumberExpressionData(99, 1, 2);
    expect(factorPuzzle.predicate(valid)).toBeTrue();
    expect(factorPuzzle.predicate(invalid)).toBeFalse();
  });

  it('Should accepts and reject quotient values ', () => {
    const quotientPuzzle = new Division();
    const valid = quotientPuzzle.target1;
    const invalid = new MixedNumberExpressionData(1, 1, 2);
    expect(quotientPuzzle.predicate(valid)).toBeTrue();
    expect(quotientPuzzle.predicate(invalid)).toBeFalse();
  });

  it('Should accepts and reject divisible by values ', () => {
    const divisibleByPuzzle = new DivisibleBy();
    const valid = divisibleByPuzzle.target1;
    const invalid = new MixedNumberExpressionData(1, 1, 2);
    expect(divisibleByPuzzle.predicate(valid)).toBeTrue();
    expect(divisibleByPuzzle.predicate(invalid)).toBeFalse();
  });

  it('Should accepts and reject prime values ', () => {
    const primePuzzle = new Primes();
    const valid = new MixedNumberExpressionData(7, 0, 0);
    const invalid = new MixedNumberExpressionData(8, 0, 0);
    expect(primePuzzle.predicate(valid)).toBeTrue();
    expect(primePuzzle.predicate(invalid)).toBeFalse();
  });

  it('Should accepts and reject perfect square values ', () => {
    const perfectSquarePuzzles = new PerfectSquares();
    const valid = new MixedNumberExpressionData(9, 0, 0);
    const invalid = new MixedNumberExpressionData(8, 0, 0);
    expect(perfectSquarePuzzles.predicate(valid)).toBeTrue();
    expect(perfectSquarePuzzles.predicate(invalid)).toBeFalse();
  });

  it('Should accepts and reject root values ', () => {
    const rootPuzzle = new Roots();
    const valid = new RootExpressionData(1, 2, rootPuzzle.target1.value ** 2);
    const invalid = new RootExpressionData(1, 2, rootPuzzle.target2.value ** 3);
    expect(rootPuzzle.predicate(valid)).toBeTrue();
    expect(rootPuzzle.predicate(invalid)).toBeFalse();
  });

  it('Should accepts and reject exponent values ', () => {
    const exponentPuzzle = new Exponents();
    const valid = exponentPuzzle.target1;
    const invalid = new MixedNumberExpressionData(
      exponentPuzzle.target1.value + 1,
      0,
      0,
    );
    expect(exponentPuzzle.predicate(valid)).toBeTrue();
    expect(exponentPuzzle.predicate(invalid)).toBeFalse();
  });

  it('Should accepts and reject equivalent fractions', () => {
    const eqFractionsPuzzle = new FractionEquivalent();
    const valid = new MixedNumberExpressionData(
      0,
      eqFractionsPuzzle.target1.numerator * 2,
      eqFractionsPuzzle.target1.denominator * 2,
    );
    const invalid = new MixedNumberExpressionData(3, 31, 32);
    expect(eqFractionsPuzzle.predicate(valid)).toBeTrue();
    expect(eqFractionsPuzzle.predicate(invalid)).toBeFalse();
  });

  it('Should accepts and reject equivalent fractions greater than one half', () => {
    const gthFractionsPuzzle = new FractionGreaterThanHalf();
    const valid = new MixedNumberExpressionData(0, 3, 5);
    const invalid = new MixedNumberExpressionData(0, 2, 5);
    expect(gthFractionsPuzzle.predicate(valid)).toBeTrue();
    expect(gthFractionsPuzzle.predicate(invalid)).toBeFalse();
  });

  it('Should accepts and reject equivalent fractions lte than one half', () => {
    const lteFractionsPuzzle = new FractionLessThanHalf();
    const valid = new MixedNumberExpressionData(0, 2, 5);
    const invalid = new MixedNumberExpressionData(0, 3, 5);
    expect(lteFractionsPuzzle.predicate(valid)).toBeTrue();
    expect(lteFractionsPuzzle.predicate(invalid)).toBeFalse();
  });

  it('Should accepts and reject  percentages greater than a fraction', () => {
    const percentagesPuzzle = new Percentages();
    const valid = new MixedNumberExpressionData(1, 1, 100);
    const invalid = new MixedNumberExpressionData(0, 1, 100);
    expect(percentagesPuzzle.predicate(valid)).toBeTrue();
    expect(percentagesPuzzle.predicate(invalid)).toBeFalse();
  });

  it('Should accepts and reject between values', () => {
    const betweenPuzzle = new Between();
    const valid = new MixedNumberExpressionData(
      betweenPuzzle.target1.value + 1,
      0,
      0,
    );
    const invalid = new MixedNumberExpressionData(
      betweenPuzzle.target1.value - 1,
      0,
      0,
    );
    expect(betweenPuzzle.predicate(valid)).toBeTrue();
    expect(betweenPuzzle.predicate(invalid)).toBeFalse();
  });

  it('Should accepts and reject outside exclusive values', () => {
    const oePuzzle = new OutsideExclusive();
    const valid = new MixedNumberExpressionData(
      oePuzzle.target1.value - 1,
      0,
      0,
    );
    const invalid = new MixedNumberExpressionData(
      oePuzzle.target1.value + 1,
      0,
      0,
    );
    expect(oePuzzle.predicate(valid)).toBeTrue();
    expect(oePuzzle.predicate(invalid)).toBeFalse();
  });

  it('Should accepts and reject between inclusive values', () => {
    const bePuzzle = new BetweenInclusive();
    const valid = new MixedNumberExpressionData(bePuzzle.target1.value, 0, 0);
    const invalid = new MixedNumberExpressionData(
      bePuzzle.target1.value - 1,
      0,
      0,
    );
    expect(bePuzzle.predicate(valid)).toBeTrue();
    expect(bePuzzle.predicate(invalid)).toBeFalse();
  });
});
