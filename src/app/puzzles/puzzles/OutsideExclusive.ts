import {
  MixedNumberExpressionData,
  ExpressionTypes,
  s,
  ExpressionData,
} from '../../../math-components/expression-data/expressionData';
import { dataUpperBound } from '../../constants';
import { isOutsideExclusive } from '../predicates';
import {
  getRandomBetweenBoundsWide,
  getRandomNaturalNumberSet,
} from '../sampleRandomValues';
import {
  toExpressionDataSet,
  getValidOutsideExclusiveValues,
} from '../sampleValidValues';
import { Puzzle, PuzzleType } from '../Puzzle';

export class OutsideExclusive extends Puzzle {
  public constructor() {
    const bounds = getRandomBetweenBoundsWide();
    super(
      PuzzleType.Greater_or_less_than,
      'Outside Exclusive',
      true,
      new MixedNumberExpressionData(bounds[0], 0, 0),
      new MixedNumberExpressionData(bounds[1], 0, 0),
    );
  }
  public override getQuestionText(): ExpressionTypes[] {
    return [s('Find numbers >'), this.target2, s('or <'), this.target1];
  }
  public override predicate(choice: ExpressionData): boolean {
    return isOutsideExclusive(
      choice.value,
      this.target1.value,
      this.target2.value,
    );
  }

  public override successDetails(choice: ExpressionTypes): ExpressionTypes[] {
    return [
      choice,
      s('is either greater than'),
      this.target2,
      s('or less than'),
      this.target1,
    ];
  }

  public override errorDetails(choice: ExpressionTypes): ExpressionTypes[] {
    return [
      choice,
      s('is not greater than'),
      this.target2,
      s('or less than'),
      this.target1,
    ];
  }
  public override getValidSamples(): Set<ExpressionData> {
    return toExpressionDataSet(
      getValidOutsideExclusiveValues(this.target1.value, this.target2.value),
    );
  }
  public override getRandomSamples(count: number): Set<ExpressionData> {
    return toExpressionDataSet(getRandomNaturalNumberSet(dataUpperBound, count));
  }
}
