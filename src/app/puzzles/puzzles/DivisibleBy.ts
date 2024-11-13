import {
  ExpressionData,
  ExpressionTypes,
  MixedNumberExpressionData,
  s,
} from '../../../math-components/expression-data/expressionData';
import { dataUpperBound } from '../../constants';
import { isMultiple } from '../../predicates';
import {
  getRandomMultipleBase,
  getRandomNaturalNumberSet,
} from '../../sampleRandomValues';
import {
  getValidMultiples,
  toExpressionDataSet,
} from '../../sampleValidValues';
import { round3 } from '../../utility';
import { Puzzle, PuzzleType } from '../Puzzle';

export class DivisibleBy extends Puzzle {
  public constructor() {
    super(
      PuzzleType.Division,
      'Divisible by',
      true,
      new MixedNumberExpressionData(getRandomMultipleBase(), 0, 0),
    );
  }

  public override predicate(choice: ExpressionData): boolean {
    return isMultiple(choice.value, this.target1.value);
  }
  public override getQuestionText(): ExpressionTypes[] {
    return [s('Find numbers divisible by'), this.target1];
  }
  public override successDetails(choice: ExpressionTypes): ExpressionTypes[] {
    return [
      choice,
      s('divided by'),
      this.target1,
      s('equals'),
      s(`${choice.value / this.target1.value}`),
    ];
  }
  public override errorDetails(choice: ExpressionTypes): ExpressionTypes[] {
    return [
      choice,
      s('divided by'),
      this.target1,
      s('is'),
      s(`${round3(choice.value / this.target1.value)}`),
      s(', not a whole number'),
    ];
  }

  public override getValidSamples(): Set<ExpressionData> {
    return toExpressionDataSet(getValidMultiples(this.target1.value));
  }
  public override getRandomSamples(count: number): Set<ExpressionData> {
    return toExpressionDataSet(getRandomNaturalNumberSet(dataUpperBound, count));
  }
}
