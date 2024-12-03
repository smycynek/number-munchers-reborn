import {
  ExpressionData,
  ExpressionTypes,
  PercentageExpressionData,
  s,
} from '../../../math-components/expression-data/expressionData';
import {
  getRandomFractionLowerBase,
  getRandomPercentages,
} from '../sampleRandomValues';
import { getValidPercentages } from '../sampleValidValues';
import { Puzzle } from '../Puzzle';
import { PuzzleType } from '../../services/puzzleType.service';

export class Percentages extends Puzzle {
  public constructor() {
    super(
      PuzzleType.Percentages,
      'Percentages',
      true,
      getRandomFractionLowerBase(),
    );
  }

  public override predicate(choice: ExpressionData): boolean {
    return choice.value > this.target1.value;
  }
  public override getQuestionText(): ExpressionTypes[] {
    return [s('Find percentages greater than'), this.target1];
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
      new PercentageExpressionData(this.target1.value * 100),
      s(')'),
    ];
  }
  public override getValidSamples(): Set<ExpressionData> {
    return getValidPercentages(this.target1);
  }
  public override getRandomSamples(count: number): Set<ExpressionData> {
    return getRandomPercentages(count);
  }
}
