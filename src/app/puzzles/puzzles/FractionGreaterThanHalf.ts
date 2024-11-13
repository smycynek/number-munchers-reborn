import {
  ExpressionData,
  ExpressionTypes,
  s,
} from '../../../math-components/expression-data/expressionData';
import { greaterEqual, oneHalf } from '../../constants';
import { getRandomFractions } from '../../sampleRandomValues';
import { getValidFractions } from '../../sampleValidValues';
import { Puzzle, PuzzleType } from '../Puzzle';


export class FractionGreaterThanHalf extends Puzzle {
  public constructor() {
    super(
      PuzzleType.Fractions,
      'Fractions greater or equal to than one half',
      true,
      oneHalf,
    );
  }

  public override predicate(choice: ExpressionData): boolean {
    return choice.value >= 0.5;
  }
  public override getQuestionText(): ExpressionTypes[] {
    return [
      s(`Find fractions ${greaterEqual}`),
      oneHalf,
    ];
  }
  public override successDetails(choice: ExpressionTypes): ExpressionTypes[] {
    return [choice, s(greaterEqual), oneHalf];
  }
  public override errorDetails(choice: ExpressionTypes): ExpressionTypes[] {
    return [
      s('Sorry,'),
      choice,
      s(`is not ${greaterEqual}`),
      oneHalf,
    ];
  }
  public override getValidSamples(): Set<ExpressionData> {
    return getValidFractions(this.target1);
  }
  public override getRandomSamples(count: number): Set<ExpressionData> {
    return getRandomFractions(count, this.target1);
  }
}
