import {
  ExpressionData,
  ExpressionTypes,
  DecimalExpressionData,
  s,
} from '../../../math-components/expression-data/expressionData';
import {
  getRandomDecimals,
  getRandomFractionLowerBase,
} from '../sampleRandomValues';
import { getValidDecimals } from '../sampleValidValues';
import { Puzzle } from '../Puzzle';
import { round3 } from '../../utility';
import { PuzzleType } from '../../services/puzzleType.service';

export class Decimals extends Puzzle {
  public constructor() {
    super(
      PuzzleType.Decimals,
      'Percentages',
      true,
      getRandomFractionLowerBase(),
    );
  }

  public override predicate(choice: ExpressionData): boolean {
    return choice.value > this.target1.value;
  }
  public override getQuestionText(): ExpressionTypes[] {
    return [s('Find decimals greater than'), this.target1];
  }
  public override successDetails(choice: ExpressionTypes): ExpressionTypes[] {
    return [choice, s('is greater than'), this.target1];
  }
  public override errorDetails(choice: ExpressionTypes): ExpressionTypes[] {
    return [
      choice,
      s('is not greater than'),
      this.target1,
      s('(or'),
      new DecimalExpressionData(round3(this.target1.value)),
      s(')'),
    ];
  }
  public override getValidSamples(): Set<ExpressionData> {
    return getValidDecimals(this.target1);
  }
  public override getRandomSamples(count: number): Set<ExpressionData> {
    return getRandomDecimals(count);
  }
}
