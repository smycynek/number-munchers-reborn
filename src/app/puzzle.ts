import {
  dataUpperBound,
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

  expressionDataSetHas,
  getPerfectSquares,
  toExpressionDataSet,

}
  from './sampleValidValues';

import {
  getRandomNumberWithinRange,
  getRandomNaturalNumberSet,

  getRandomItemFromSetAndRemove,

}
  from './sampleRandomValues';

import { ExpressionData, MixedNumberExpressionData, StringExpressionData } from '../math-components/expression-data/expressionData';

export enum PuzzleType {
  MISC,
  MULTIPLICATION
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
    public questionText: (MixedNumberExpressionData | StringExpressionData) [],
    public successDetails: (value: ExpressionData) => (MixedNumberExpressionData | StringExpressionData) [],
    public errorDetails: (value: ExpressionData) => (MixedNumberExpressionData | StringExpressionData)[],
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
      const replacements = maxReplacements;
     // SVM TODO 
     // if (this.type === PuzzleType.MULTIPLICATION) {
     //   replacements *= 2;
     // }
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

    const perfectSquareSuccess = (cellValue: ExpressionData) => {  return [new StringExpressionData('Success: '), new MixedNumberExpressionData(Math.sqrt(cellValue.value),0,0), new StringExpressionData('time itself is'), new MixedNumberExpressionData(cellValue.value,0,0)]};
    const perfectSquareFailure = (cellValue: ExpressionData) => {  return [new StringExpressionData('Failure: no number times itself equals'), new MixedNumberExpressionData(cellValue.value,0,0)]};
    
    return [
      new Puzzle(
        (cellValue: ExpressionData) => isPerfectSquare(cellValue.value),
        dataUpperBound,
        [new StringExpressionData('Find perfect squares')],
        perfectSquareSuccess,
        perfectSquareFailure,
        () => toExpressionDataSet(getPerfectSquares()),
        (count: number) => toExpressionDataSet(getRandomNaturalNumberSet(dataUpperBound, count)),
        PuzzleType.MISC,
        true,
        'Perfect Squares'
      ),
    ];
  }

}
