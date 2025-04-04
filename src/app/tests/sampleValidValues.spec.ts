/*
This is a little bit of overkill, but if I'm making a game
for kids, I want to make sure output is correct.
*/

import {
  ExponentExpressionData,
  MixedNumberExpressionData,
  RootExpressionData,
} from '../../math-components/expression-data/expressionData';
import {
  getValidFactors,
  getFactorTargets,
} from '../puzzles/sampleRandomValues';
import {
  getNaturalNumberSet,
  getValidBetweenValues,
  getValidOutsideExclusiveValues,
  getValidMultiples,
} from '../puzzles/sampleValidValues';

describe('PseudoUnitTests-SampleValidValues', () => {
  it('getNaturalNumberSet gives valid natural numbers', () => {
    const naturals = getNaturalNumberSet(3);
    expect(naturals.size).toEqual(3);
    expect(naturals.has(1)).toBeTrue();
    expect(naturals.has(2)).toBeTrue();
    expect(naturals.has(3)).toBeTrue();
  });

  it('getValidBetweenValues should give valid between values', () => {
    const betweensExclusive = getValidBetweenValues(1, 4, false);
    expect(betweensExclusive.size).toEqual(2);
    expect(betweensExclusive.has(2)).toBeTrue();
    expect(betweensExclusive.has(3)).toBeTrue();
    const betweensInclusive = getValidBetweenValues(1, 4, true);
    expect(betweensInclusive.size).toEqual(4);
    expect(betweensInclusive.has(1)).toBeTrue();
    expect(betweensInclusive.has(2)).toBeTrue();
    expect(betweensInclusive.has(3)).toBeTrue();
    expect(betweensInclusive.has(4)).toBeTrue();
  });

  it('getValidOutsideExclusiveValues should give valid outside exclusive values', () => {
    const outsideExclusive = getValidOutsideExclusiveValues(2, 98);
    expect(outsideExclusive.size).toEqual(2);
    expect(outsideExclusive.has(1)).toBeTrue();
    expect(outsideExclusive.has(99)).toBeTrue();
  });

  it('getValidFactors should give valid factors', () => {
    const value = 12;
    const factors = getValidFactors(value);
    expect(factors.size).toEqual(4);
    expect(factors.has(2)).toBeTrue();
    expect(factors.has(3)).toBeTrue();
    expect(factors.has(4)).toBeTrue();
    expect(factors.has(6)).toBeTrue();
  });

  it('getValidMultiples should give valid multiples', () => {
    const base = 3;
    const multiples = getValidMultiples(base);
    expect(multiples.size).toEqual(8);
    expect(multiples.has(6)).toBeTrue();
    expect(multiples.has(9)).toBeTrue();
    expect(multiples.has(12)).toBeTrue();
    expect(multiples.has(15)).toBeTrue();
    expect(multiples.has(18)).toBeTrue();
    expect(multiples.has(21)).toBeTrue();
    expect(multiples.has(24)).toBeTrue();
    expect(multiples.has(27)).toBeTrue();
  });

  it('getFactorTargets should give numbers with a minimum number of factors', () => {
    // Note, we do not include 1 and the number itself here
    const factorTargets_10 = getFactorTargets(10);
    expect(factorTargets_10.size).toEqual(5);
  });

  it('Fraction values should be evaluated', () => {
    const exp1 = new MixedNumberExpressionData(0, 2, 3);
    const exp2 = new MixedNumberExpressionData(1, 3, 4);
    expect(exp1.value).toEqual(2 / 3);
    expect(exp2.value).toEqual(1.75);
  });

  it('Exponent values should be evaluated', () => {
    const exp1 = new ExponentExpressionData(2, 3);
    const exp2 = new ExponentExpressionData(3, 4);
    expect(exp1.value).toEqual(8);
    expect(exp2.value).toEqual(81);
  });

  it('Root values should be evaluated', () => {
    const exp1 = new RootExpressionData(1, 2, 64);
    const exp2 = new RootExpressionData(1, 4, 81);
    expect(exp1.value).toEqual(8);
    expect(exp2.value).toEqual(3);
  });
});
