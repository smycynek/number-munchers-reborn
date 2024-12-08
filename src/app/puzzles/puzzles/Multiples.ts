import {
  ExpressionData,
  ExpressionTypes,
  MixedNumberExpressionData,
  s,
} from '../../../math-components/expression-data/expressionData';
import { dataUpperBound } from '../../constants';
import { isMultiple } from '../predicates';
import {
  getRandomMultipleBase,
  getRandomNaturalNumberSet,
} from '../sampleRandomValues';
import { getValidMultiples, toExpressionDataSet } from '../sampleValidValues';
import { Puzzle } from '../Puzzle';
import { PuzzleType } from '../../services/puzzle-type.service';

export class Multiples extends Puzzle {
  public constructor() {
    super(
      PuzzleType.Multiplication,
      'Multiples of',
      true,
      new MixedNumberExpressionData(getRandomMultipleBase(), 0, 0),
    );
  }
  public override predicate(choice: ExpressionData): boolean {
    return isMultiple(choice.value, this.target1.value);
  }
  public override getQuestionText(): ExpressionTypes[] {
    return [s('Find multiples of'), this.target1];
  }
  public override successDetails(choice: ExpressionTypes): ExpressionTypes[] {
    return [
      this.target1,
      s('times'),
      s(`${choice.value / this.target1.value}`),
      s('equals'),
      choice,
    ];
  }
  public override errorDetails(choice: ExpressionTypes): ExpressionTypes[] {
    return [s('No whole numbers times'), this.target1, s('equals'), choice];
  }
  public override getValidSamples(): Set<ExpressionData> {
    return toExpressionDataSet(getValidMultiples(this.target1.value));
  }
  public override getRandomSamples(count: number): Set<ExpressionData> {
    return toExpressionDataSet(
      getRandomNaturalNumberSet(dataUpperBound, count),
    );
  }
}
