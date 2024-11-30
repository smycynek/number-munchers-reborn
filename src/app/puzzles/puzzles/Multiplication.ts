import {
  MixedNumberExpressionData,
  ExpressionTypes,
  s,
  ExpressionData,
} from '../../../math-components/expression-data/expressionData';
import {
  getRandomFactorTarget,
  getRandomMultiplicationPairs,
} from '../sampleRandomValues';
import { getValidMultiplicationPairs } from '../sampleValidValues';
import { Puzzle, toggleRValue } from '../Puzzle';
import { PuzzleType } from '../../services/puzzleType.service';

export class Multiplication extends Puzzle {
  public constructor() {
    super(
      PuzzleType.Multiplication,
      'Multiplication',
      true,
      new MixedNumberExpressionData(getRandomFactorTarget(3), 0, 0),
    );
  }

  public override getQuestionText(): ExpressionTypes[] {
    return [s('Find expressions equal to'), this.target1];
  }
  public override predicate(choice: ExpressionData): boolean {
    return choice.value === this.target1.value;
  }
  public override successDetails(choice: ExpressionTypes): ExpressionTypes[] {
    return [toggleRValue(choice)];
  }
  public override errorDetails(choice: ExpressionTypes): ExpressionTypes[] {
    return [toggleRValue(choice), s(', not'), this.target1];
  }
  public override getValidSamples(): Set<ExpressionData> {
    return getValidMultiplicationPairs(this.target1.value);
  }
  public override getRandomSamples(count: number): Set<ExpressionData> {
    return getRandomMultiplicationPairs(count);
  }
}
