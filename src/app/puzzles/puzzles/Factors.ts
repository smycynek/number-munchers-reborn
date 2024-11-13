import {
  ExpressionData,
  ExpressionTypes,
  MixedNumberExpressionData,
  s,
} from '../../../math-components/expression-data/expressionData';
import { dataUpperBoundLow } from '../../constants';
import { isFactor } from '../../predicates';
import {
  getRandomFactorTarget,
  getRandomNaturalNumberSet,
  getValidFactors,
} from '../../sampleRandomValues';
import { toExpressionDataSet } from '../../sampleValidValues';
import { Puzzle, PuzzleType } from '../Puzzle';

export class Factors extends Puzzle {
  public constructor() {
    super(
      PuzzleType.Multiplication,
      'Factors',
      true,
      new MixedNumberExpressionData(getRandomFactorTarget(2), 0, 0),
    );
  }
  public override predicate(choice: ExpressionData): boolean {
    return isFactor(choice.value, this.target1.value);
  }
  public override getQuestionText(): ExpressionTypes[] {
    return [s('Find factors of'), this.target1];
  }
  public override successDetails(choice: ExpressionTypes): ExpressionTypes[] {
    return [
      choice,
      s('times'),
      s(`${this.target1.value / choice.value}`),
      s('equals'),
      this.target1,
    ];
  }
  public override errorDetails(choice: ExpressionTypes): ExpressionTypes[] {
    return [
      s('No whole numbers multiplied by'),
      choice,
      s('equal'),
      this.target1,
    ];
  }
  public override getValidSamples(): Set<ExpressionData> {
    return toExpressionDataSet(getValidFactors(this.target1.value));
  }
  public override getRandomSamples(count: number): Set<ExpressionData> {
    return toExpressionDataSet(getRandomNaturalNumberSet(dataUpperBoundLow, count));
  }
}
