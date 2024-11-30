import {
  ExpressionTypes,
  s,
  ExpressionData,
  MixedNumberExpressionData,
} from '../../../math-components/expression-data/expressionData';
import { dataUpperBound } from '../../constants';
import { isPerfectSquare } from '../predicates';
import { getRandomNaturalNumberSet } from '../sampleRandomValues';
import { toExpressionDataSet, getPerfectSquares } from '../sampleValidValues';
import { Puzzle } from '../Puzzle';
import { PuzzleType } from '../../services/puzzleType.service';

export class PerfectSquares extends Puzzle {
  public constructor() {
    super(PuzzleType.Miscellaneous, 'Perfect Squares', true);
  }
  public override getQuestionText(): ExpressionTypes[] {
    return [s('Find perfect squares')];
  }
  public override predicate(choice: ExpressionData): boolean {
    return isPerfectSquare(choice.value);
  }
  public override successDetails(choice: ExpressionTypes): ExpressionTypes[] {
    return [
      new MixedNumberExpressionData(Math.sqrt(choice.value), 0, 0),
      s('times itself is'),
      new MixedNumberExpressionData(choice.value, 0, 0),
    ];
  }
  public override errorDetails(choice: ExpressionTypes): ExpressionTypes[] {
    return [s('Sorry, no number times itself equals'), choice];
  }
  public override getValidSamples(): Set<ExpressionData> {
    return toExpressionDataSet(getPerfectSquares());
  }
  public override getRandomSamples(count: number): Set<ExpressionData> {
    return toExpressionDataSet(
      getRandomNaturalNumberSet(dataUpperBound, count),
    );
  }
}
