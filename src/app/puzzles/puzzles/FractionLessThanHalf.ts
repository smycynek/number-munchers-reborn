import {
  ExpressionData,
  ExpressionTypes,
  s,
} from '../../../math-components/expression-data/expressionData';
import { oneHalf } from '../../constants';
import { getRandomFractions } from '../sampleRandomValues';
import { getValidFractions } from '../sampleValidValues';
import { Puzzle } from '../Puzzle';
import { PuzzleType } from '../../services/puzzleType.service';

export class FractionLessThanHalf extends Puzzle {
  public constructor() {
    super(
      PuzzleType.Fractions,
      'Fractions less than to than one half',
      true,
      oneHalf,
    );
  }

  public override predicate(choice: ExpressionData): boolean {
    return choice.value < 0.5;
  }
  public override getQuestionText(): ExpressionTypes[] {
    return [s('Find fractions <'), oneHalf];
  }
  public override successDetails(choice: ExpressionTypes): ExpressionTypes[] {
    return [choice, s('<'), oneHalf];
  }
  public override errorDetails(choice: ExpressionTypes): ExpressionTypes[] {
    return [s('Sorry,'), choice, s('is not <'), oneHalf];
  }
  public override getValidSamples(): Set<ExpressionData> {
    return getValidFractions(this.target1);
  }
  public override getRandomSamples(count: number): Set<ExpressionData> {
    return getRandomFractions(count, this.target1);
  }
}
