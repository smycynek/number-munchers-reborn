import {
  MixedNumberExpressionData,
  ExpressionTypes,
  s,
  ExpressionData,
} from '../../../math-components/expression-data/expressionData';
import {
  getRandomDivisionPairs,
  getRandomNumberWithinRange,
} from '../sampleRandomValues';
import { getValidDivisionPairs } from '../sampleValidValues';
import { Puzzle, toggleRValue } from '../Puzzle';
import { PuzzleType } from '../../services/puzzle-type.service';

export class Division extends Puzzle {
  public constructor() {
    super(
      PuzzleType.Division,
      'Division',
      true,
      new MixedNumberExpressionData(getRandomNumberWithinRange(2, 11), 0, 0),
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
    return getValidDivisionPairs(this.target1.value);
  }
  public override getRandomSamples(count: number): Set<ExpressionData> {
    return getRandomDivisionPairs(count);
  }
}
