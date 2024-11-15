import {
  MixedNumberExpressionData,
  ExpressionTypes,
  s,
  ExpressionData,
} from '../../../math-components/expression-data/expressionData';
import { dataUpperBound } from '../../constants';
import { isBetween } from '../predicates';
import {
  getRandomBetweenBounds,
  getRandomNaturalNumberSet,
} from '../sampleRandomValues';
import {
  toExpressionDataSet,
  getValidBetweenValues,
} from '../sampleValidValues';
import { Puzzle, PuzzleType } from '../Puzzle';

export class Between extends Puzzle {
  public constructor() {
    const bounds = getRandomBetweenBounds();
    super(
      PuzzleType.Greater_or_less_than,
      'Between',
      true,
      new MixedNumberExpressionData(bounds[0], 0, 0),
      new MixedNumberExpressionData(bounds[1], 0, 0),
    );
  }
  public override getQuestionText(): ExpressionTypes[] {
    return [s('Find numbers between'), this.target1, s('and'), this.target2];
  }
  public override predicate(choice: ExpressionData): boolean {
    return isBetween(choice.value, this.target1.value, this.target2.value, false);
  }
  public override successDetails(choice: ExpressionTypes): ExpressionTypes[] {
    return [
      choice,
      s('is greater than'),
      this.target1,
      s('and less than'),
      this.target2,
    ];
  }
  public override errorDetails(choice: ExpressionTypes): ExpressionTypes[] {
    return [
      choice,
      s('is not greater than'),
      this.target1,
      s('and less than'),
      this.target2,
    ];
  }
  public override getValidSamples(): Set<ExpressionData> {
    return toExpressionDataSet(
      getValidBetweenValues(this.target1.value, this.target2.value, false),
    );
  }
  public override getRandomSamples(count: number): Set<ExpressionData> {
    return toExpressionDataSet(getRandomNaturalNumberSet(dataUpperBound, count));
  }
}
