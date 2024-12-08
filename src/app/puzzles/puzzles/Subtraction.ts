import {
  MixedNumberExpressionData,
  ExpressionData,
  ExpressionTypes,
  s,
} from '../../../math-components/expression-data/expressionData';
import {
  getRandomNumberWithinRange,
  getRandomDifferencePairs,
} from '../sampleRandomValues';
import { getValidDifferencePairs } from '../sampleValidValues';
import { Puzzle, toggleRValue } from '../Puzzle';
import { dataUpperBound } from '../../constants';
import { PuzzleType } from '../../services/puzzle-type.service';

export class Subtraction extends Puzzle {
  public constructor(private digits: number = 2) {
    let lowerBound = 1;
    let upperBound = 80;
    if (digits === 3) {
      lowerBound = 10;
      upperBound = 980;
    }
    super(
      PuzzleType.Subtraction,
      `${digits} digit subtraction`,
      true,
      new MixedNumberExpressionData(
        getRandomNumberWithinRange(lowerBound, upperBound),
        0,
        0,
      ),
    );
    this.digits = digits;
  }
  public override predicate(choice: ExpressionData): boolean {
    return choice.value === this.target1.value;
  }
  public override getQuestionText(): ExpressionTypes[] {
    return [s('Find differences equal to'), this.target1];
  }
  public override successDetails(choice: ExpressionTypes): ExpressionTypes[] {
    return [toggleRValue(choice)];
  }
  public override errorDetails(choice: ExpressionTypes): ExpressionTypes[] {
    return [s('Sorry,'), toggleRValue(choice), s(', not'), this.target1];
  }
  public override getValidSamples(): Set<ExpressionData> {
    let upperBound = dataUpperBound;
    if (this.digits === 3) {
      upperBound = 999;
    }
    return getValidDifferencePairs(this.target1.value, upperBound);
  }
  public override getRandomSamples(count: number): Set<ExpressionData> {
    return getRandomDifferencePairs(count, this.target1.value, this.digits);
  }
}
