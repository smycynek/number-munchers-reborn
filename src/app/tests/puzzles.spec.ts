import {
  AdditionExpressionData,
  ExponentExpressionData,
  RootExpressionData,
  SubtractionExpressionData,
} from '../../math-components/expression-data/expressionData';
import { Addition } from '../puzzles/puzzles/Addition';
import { Exponents } from '../puzzles/puzzles/Exponents';
import { Roots } from '../puzzles/puzzles/Roots';
import { Subtraction } from '../puzzles/puzzles/Subtraction';
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

  it('Should accepts and reject exponent values ', () => {
    const exponentPuzzle = new Exponents();
    const valid = new ExponentExpressionData(exponentPuzzle.target1.value, 1);
    const invalid = new ExponentExpressionData(exponentPuzzle.target2.value, 4);
    expect(exponentPuzzle.predicate(valid)).toBeTrue();
    expect(exponentPuzzle.predicate(invalid)).toBeFalse();
  });

  it('Should accepts and reject root values ', () => {
    const rootPuzzle = new Roots();
    const valid = new RootExpressionData(1, 2, rootPuzzle.target1.value ** 2);
    const invalid = new RootExpressionData(1, 2, rootPuzzle.target2.value ** 3);
    expect(rootPuzzle.predicate(valid)).toBeTrue();
    expect(rootPuzzle.predicate(invalid)).toBeFalse();
  });
});
