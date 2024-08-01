import {
  dataUpperBound,
  dataUpperBoundLow,
  maxReplacements
} from './constants';
import { DataCell } from './dataCell';

import {
  debug,
} from './utility';

import {
  isPerfectSquare,

} from './predicates';


import {
  getRandomNumberWithinRange,
  getRandomNaturalNumberSet,

  getRandomItemFromSetAndRemove,
  getRandomFactorTarget,
  getRandomMultiplicationPairs,
  getRandomFractions,
  getRandomFractionBase,

}
  from './sampleRandomValues';

import { ExpressionData, ExpressionTypes, MixedNumberExpressionData, MultiplicationExpressionData, s } from '../math-components/expression-data/expressionData';
import { expressionDataSetHas, getPerfectSquares, getValidFractions, getValidMultiplicationPairs, toExpressionDataSet } from './sampleValidValues';

export enum PuzzleType {
  MISC,
  MULTIPLICATION,
  FRACTIONS
}

export class Puzzle {
  public static getRandomPuzzle(puzzleTypes: Set<PuzzleType>) {
    const puzzles = Puzzle.createPuzzles().filter(p => puzzleTypes.has(p.type) && p.include);
    return puzzles[getRandomNumberWithinRange(0, puzzles.length - 1)];
  }

  public generateCell(curatedValues: Set<ExpressionData>) {
    const value = getRandomItemFromSetAndRemove(curatedValues)
    debug(`Value to set: ${value}`)
    const valid = this.predicate(value);
    return new DataCell(value, valid, false);
  }

  public generateCells(totalValues: number): Set<DataCell> {
    const dataCells: Set<DataCell> = new Set();
    const curatedValues = this.getCuratedValues(totalValues);
    for (let idx = 0; idx != totalValues; idx++) {
      const data = this.generateCell(curatedValues)
      dataCells.add(data);
    }
    return dataCells;
  }

  private constructor(
    private predicate: (val: ExpressionData) => boolean,
    public maxValue: number,
    public questionText: (ExpressionTypes) [],
    public successDetails: (value: ExpressionTypes) => (ExpressionTypes) [],
    public errorDetails: (value: ExpressionTypes) => (ExpressionTypes)[],
    public getValidSamples: () => Set<ExpressionData>,
    public getRandomSamples: (count: number, maxValue: number) => Set<ExpressionData>,
    public type: PuzzleType,
    public include: boolean = true,
    public name: string = ''
  ) { }

  private getCuratedValues(count: number, addValidValues: boolean = true): Set<ExpressionData> {
    const curatedValues = this.getRandomSamples(count, this.maxValue);
    if (addValidValues) {
      const validSamples = this.getValidSamples();
      let replacements = maxReplacements;
     // SVM TODO 
      if (this.type === PuzzleType.MULTIPLICATION) {
        replacements *= 2;
      }
      const replacementCount = validSamples.size < replacements ? validSamples.size : replacements;
      debug(`Valid samples for puzzle: ${[...validSamples]}`);
      debug(`Substituting in ${replacements} correct answers.`);
      for (let idx = 0; idx != replacementCount; idx++) {
        const validValue = getRandomItemFromSetAndRemove(validSamples);
        if (expressionDataSetHas(validValue, curatedValues)) {
          debug(`Value exists: ${validValue}`);
          continue;
        } else {
          const valueToRemove = getRandomItemFromSetAndRemove(curatedValues);
          debug('Value to remove: ' + valueToRemove);
          curatedValues.add(validValue);
          debug('Adding valid value: ' + validValue);
        }
      }
    }

    debug(`Curated final values: ${[...curatedValues]} : ${curatedValues.size}`);
    return curatedValues;
  }

  private static createPuzzles(): Puzzle[] {   

    const randomMultiplicationTarget = getRandomFactorTarget(3);
    
    const perfectSquareSuccess = (cellValue: ExpressionData) => {  return [new MixedNumberExpressionData(Math.sqrt(cellValue.value),0,0), s('time itself is'), new MixedNumberExpressionData(cellValue.value,0,0)]};
    const perfectSquareFailure = (cellValue: ExpressionData) => {  return [s('Sorry, no number times itself equals'), new MixedNumberExpressionData(cellValue.value,0,0)]};
    
    const multiplicationSuccess = (cellValue: ExpressionTypes) => { 
      const mCellValue = cellValue.clone() as MultiplicationExpressionData;
      mCellValue.showRval = true;
      return [mCellValue];
    };
    const multiplicationFailure = (cellValue: ExpressionTypes) => {
      const mCellValue = cellValue.clone() as MultiplicationExpressionData;
      mCellValue.showRval = true;
       return [
      mCellValue,
       s(`, not ${randomMultiplicationTarget}`)
    ]};

    const ltHalfSuccess = (cellValue: ExpressionTypes) => { 
      return [cellValue, s('<'), new MixedNumberExpressionData(0,1,2)];
    };

    const ltHalfFailure = (cellValue: ExpressionTypes) => { 
      return [s('Sorry,'), cellValue, s('is not <'), new MixedNumberExpressionData(0,1,2)];
    };

    const randomFractionBase = getRandomFractionBase();
    
    return [
      new Puzzle(
        (cellValue: ExpressionData) => isPerfectSquare(cellValue.value),
        dataUpperBound,
        [s('Find perfect squares')],
        perfectSquareSuccess,
        perfectSquareFailure,
        () => toExpressionDataSet(getPerfectSquares()),
        (count: number) => toExpressionDataSet(getRandomNaturalNumberSet(dataUpperBound, count)),
        PuzzleType.MISC,
        true,
        'Perfect Squares'
      ),

      new Puzzle(
        (cellValue: ExpressionData) => cellValue.value === randomMultiplicationTarget,
        dataUpperBoundLow,
        [s(`Find expressions equal to ${randomMultiplicationTarget}`)],
        multiplicationSuccess,
        multiplicationFailure,
        () => getValidMultiplicationPairs(randomMultiplicationTarget),
        (count: number) => getRandomMultiplicationPairs(count),
        PuzzleType.MULTIPLICATION,
        true,
        'Multiplication Expressions'
      ),

      new Puzzle(
        (cellValue: ExpressionData) => cellValue.value < 0.5,
        dataUpperBound,
        [s('Find fractions <'), new MixedNumberExpressionData(0,1,2)],
        ltHalfSuccess,
        ltHalfFailure,
        () => getValidFractions(randomFractionBase),
        (count: number) => getRandomFractions(count, randomFractionBase),
        PuzzleType.FRACTIONS,
        true,
        'Fraction < 1/2'
      )

    ];
  }

}
