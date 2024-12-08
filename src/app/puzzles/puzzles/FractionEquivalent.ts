import {
  ExpressionData,
  ExpressionTypes,
  s,
} from '../../../math-components/expression-data/expressionData';
import {
  getRandomFractionBase,
  getRandomFractions,
} from '../sampleRandomValues';
import { getValidFractions } from '../sampleValidValues';
import { Puzzle } from '../Puzzle';
import { PuzzleType } from '../../services/puzzle-type.service';

export class FractionEquivalent extends Puzzle {
  public constructor() {
    super(
      PuzzleType.Fractions,
      'Equivalent Fractions',
      true,
      getRandomFractionBase(),
    );
  }

  public override predicate(choice: ExpressionData): boolean {
    return choice.value === this.target1.value;
  }
  public override getQuestionText(): ExpressionTypes[] {
    return [s('Find fractions equivalent to'), this.target1];
  }
  public override successDetails(choice: ExpressionTypes): ExpressionTypes[] {
    return [choice, s('is equivalent to'), this.target1];
  }
  public override errorDetails(choice: ExpressionTypes): ExpressionTypes[] {
    return [choice, s('is not equivalent to'), this.target1];
  }
  public override getValidSamples(): Set<ExpressionData> {
    return getValidFractions(this.target1);
  }
  public override getRandomSamples(count: number): Set<ExpressionData> {
    return getRandomFractions(count, this.target1);
  }
}
