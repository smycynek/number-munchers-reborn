import {
  ExpressionData,
  ExpressionTypes,
  MixedNumberExpressionData,
} from '../../math-components/expression-data/expressionData';
import { maxReplacements } from '../constants';
import { DataCell } from '../dataCell';
import { getRandomItemFromSetAndRemove } from './sampleRandomValues';
import { expressionDataSetHas } from './sampleValidValues';
import { debug } from '../utility';
import { PuzzleType } from '../services/puzzle-type.service';

export function toggleRValue(cellValue: ExpressionTypes): ExpressionTypes {
  cellValue.showRval = !cellValue.showRval;
  return cellValue;
}

export abstract class Puzzle {
  public abstract predicate(choice: ExpressionData): boolean;
  public abstract getQuestionText(): ExpressionTypes[];
  public abstract successDetails(choice: ExpressionTypes): ExpressionTypes[];
  public abstract errorDetails(choice: ExpressionTypes): ExpressionTypes[];
  public abstract getValidSamples(): Set<ExpressionData>;
  public abstract getRandomSamples(count: number): Set<ExpressionData>;

  public constructor(
    public readonly type: PuzzleType,
    public readonly name: string,
    public readonly include: boolean,
    public readonly target1: MixedNumberExpressionData = new MixedNumberExpressionData(0, 0, 0),
    public readonly target2: MixedNumberExpressionData = new MixedNumberExpressionData(0, 0, 0),
    public readonly target3: MixedNumberExpressionData = new MixedNumberExpressionData(0, 0, 0)
  ) {}

  public generateCell(curatedValues: Set<ExpressionData>) {
    const value = getRandomItemFromSetAndRemove(curatedValues);
    debug(`Value to set: ${value}`);
    const valid = this.predicate(value);
    return new DataCell(value, valid, false);
  }

  public generateCells(totalValues: number): Set<DataCell> {
    const dataCells: Set<DataCell> = new Set();
    const curatedValues = this.getCuratedValues(totalValues);
    for (let idx = 0; idx != totalValues; idx++) {
      const data = this.generateCell(curatedValues);
      dataCells.add(data);
    }
    return dataCells;
  }

  protected getCuratedValues(count: number, addValidValues: boolean = true): Set<ExpressionData> {
    const randomValues = this.getRandomSamples(count);

    if (addValidValues) {
      const validSamples = this.getValidSamples();
      let replacements = maxReplacements;
      if (
        [PuzzleType.Multiplication, PuzzleType.Addition, PuzzleType.Subtraction].includes(this.type)
      ) {
        replacements *= 2;
        debug('Extra replacements');
      }
      const replacementCount = validSamples.size < replacements ? validSamples.size : replacements;
      debug(`Valid samples for puzzle: ${[...validSamples]}`);
      debug(`Substituting in ${replacements} correct answers.`);
      for (let idx = 0; idx != replacementCount; idx++) {
        const validValue = getRandomItemFromSetAndRemove(validSamples);
        if (expressionDataSetHas(validValue, randomValues)) {
          debug(`Value exists: ${validValue}`);
          continue;
        } else {
          const valueToRemove = getRandomItemFromSetAndRemove(randomValues);
          debug('Value to remove: ' + valueToRemove);
          randomValues.add(validValue);
          debug('Adding valid value: ' + validValue);
        }
      }
    }

    debug(`Curated final values: ${[...randomValues]} : ${randomValues.size}`);
    return randomValues;
  }
}
