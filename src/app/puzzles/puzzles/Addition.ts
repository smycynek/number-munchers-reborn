import {
  MixedNumberExpressionData,
  ExpressionData,
  ExpressionTypes,
  s,
} from '../../../math-components/expression-data/expressionData';
import { dataUpperBound } from '../../constants';
import { getRandomNumberWithinRange, getRandomSumPairs } from '../sampleRandomValues';
import { Puzzle, toggleRValue } from '../Puzzle';
import { getValidSumPairs } from '../sampleValidValues';
import { PuzzleType } from '../../services/puzzle-type.service';

export class Addition extends Puzzle {
  public constructor(private digits: number = 2) {
    let lowerBound = 20;
    let upperBound = dataUpperBound;
    if (digits === 3) {
      lowerBound *= 10;
      upperBound *= 10;
    }
    super(
      PuzzleType.Addition,
      `${digits} digit addition`,
      true,
      new MixedNumberExpressionData(getRandomNumberWithinRange(lowerBound, upperBound), 0, 0)
    );
    this.digits = digits;
  }
  public override predicate(choice: ExpressionData): boolean {
    return choice.value === this.target1.value;
  }
  public override getQuestionText(): ExpressionTypes[] {
    return [s('Find sums equal to'), this.target1];
  }
  public override successDetails(choice: ExpressionTypes): ExpressionTypes[] {
    return [toggleRValue(choice)];
  }
  public override errorDetails(choice: ExpressionTypes): ExpressionTypes[] {
    return [s('Sorry,'), toggleRValue(choice), s(', not'), this.target1];
  }
  public override getValidSamples(): Set<ExpressionData> {
    return getValidSumPairs(this.target1.value);
  }
  public override getRandomSamples(count: number): Set<ExpressionData> {
    return getRandomSumPairs(count, this.target1.value, this.digits);
  }
}
