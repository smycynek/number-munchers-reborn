import {
  MixedNumberExpressionData,
  ExpressionData,
  ExpressionTypes,
  s,
} from '../../../math-components/expression-data/expressionData';
import { getRandomRootPairs } from '../sampleRandomValues';
import { getRootTargets, getValidRootPairs } from '../sampleValidValues';
import { Puzzle, PuzzleType, toggleRValue } from '../Puzzle';

export class Roots extends Puzzle {
  private rootTargets: number[];
  public constructor() {
    const rootTargets = getRootTargets();
    super(
      PuzzleType.Roots,
      'Roots',
      true,
      new MixedNumberExpressionData(rootTargets[0], 0, 0),
      new MixedNumberExpressionData(rootTargets[1], 0, 0),
      new MixedNumberExpressionData(rootTargets[2], 0, 0),
    );
    this.rootTargets = rootTargets;
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
      s('Find roots equal to'),
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
    return getValidRootPairs(this.rootTargets);
  }
  public override getRandomSamples(count: number): Set<ExpressionData> {
    return getRandomRootPairs(count);
  }
}
