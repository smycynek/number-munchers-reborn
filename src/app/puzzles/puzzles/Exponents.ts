import {
  MixedNumberExpressionData,
  ExpressionData,
  ExpressionTypes,
  s,
} from '../../../math-components/expression-data/expressionData';
import { getRandomExponentPairs } from '../sampleRandomValues';
import {
  getExponentTargets,
  getValidExponentPairs,
} from '../sampleValidValues';
import { Puzzle, toggleRValue } from '../Puzzle';
import { PuzzleType } from '../../services/puzzle-type.service';

export class Exponents extends Puzzle {
  public constructor() {
    const exponentTargets = getExponentTargets();
    super(
      PuzzleType.Exponents,
      'Exponents',
      true,
      new MixedNumberExpressionData(exponentTargets[0], 0, 0),
      new MixedNumberExpressionData(exponentTargets[1], 0, 0),
      new MixedNumberExpressionData(exponentTargets[2], 0, 0),
    );
  }

  public override predicate(choice: ExpressionData): boolean {
    return (
      choice.value === this.target1.value ||
      choice.value === this.target2.value ||
      choice.value === this.target3.value
    );
  }

  public override getQuestionText(): ExpressionTypes[] {
    return [
      s('Find exponents equal to'),
      this.target1,
      s(', '),
      this.target2,
      s(', or'),
      this.target3,
    ];
  }
  public override successDetails(choice: ExpressionTypes): ExpressionTypes[] {
    return [toggleRValue(choice)];
  }
  public override errorDetails(choice: ExpressionTypes): ExpressionTypes[] {
    return [
      s('Sorry,'),
      toggleRValue(choice),
      s(', not'),
      this.target1,
      s(', '),
      this.target2,
      s(', or'),
      this.target3,
    ];
  }

  public override getValidSamples(): Set<ExpressionData> {
    return getValidExponentPairs([
      this.target1.value,
      this.target2.value,
      this.target3.value,
    ]);
  }
  public override getRandomSamples(count: number): Set<ExpressionData> {
    return getRandomExponentPairs(count);
  }
}
