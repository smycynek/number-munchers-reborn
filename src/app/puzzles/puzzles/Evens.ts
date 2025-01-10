import {
  ExpressionData,
  ExpressionTypes,
  s,
} from '../../../math-components/expression-data/expressionData';
import { dataUpperBound } from '../../constants';
import { PuzzleType } from '../../services/puzzle-type.service';
import { Puzzle } from '../Puzzle';
import { getRandomNaturalNumberSet } from '../sampleRandomValues';
import { toExpressionDataSet, getNaturalEvenSet } from '../sampleValidValues';

export class Evens extends Puzzle {
  public constructor() {
    super(PuzzleType.Miscellaneous, 'Odds', true);
  }
  public override predicate(choice: ExpressionData): boolean {
    return choice.value % 2 === 0;
  }
  public override getQuestionText(): ExpressionTypes[] {
    return [s('Find even numbers')];
  }
  public override successDetails(choice: ExpressionTypes): ExpressionTypes[] {
    return [choice, s('is even!')];
  }
  public override errorDetails(choice: ExpressionTypes): ExpressionTypes[] {
    return [s('Sorry, '), choice, s('is odd')];
  }
  public override getValidSamples(): Set<ExpressionData> {
    return toExpressionDataSet(getNaturalEvenSet(dataUpperBound));
  }
  public override getRandomSamples(count: number): Set<ExpressionData> {
    return toExpressionDataSet(
      getRandomNaturalNumberSet(dataUpperBound, count),
    );
  }
}