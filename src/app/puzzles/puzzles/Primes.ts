import {
  ExpressionData,
  ExpressionTypes,
  s,
} from '../../../math-components/expression-data/expressionData';
import { dataUpperBound } from '../../constants';
import { isPrime } from '../predicates';
import {
  getRandomNaturalNumberSet,
  getValidFactors,
} from '../sampleRandomValues';
import { toExpressionDataSet, getPrimes } from '../sampleValidValues';
import { format_and } from '../../utility';
import { Puzzle } from '../Puzzle';
import { PuzzleType } from '../../services/puzzleType.service';

export class Primes extends Puzzle {
  public constructor() {
    super(PuzzleType.Miscellaneous, 'Prime numbers', true);
  }
  public override predicate(choice: ExpressionData): boolean {
    return isPrime(choice.value);
  }

  public override getQuestionText(): ExpressionTypes[] {
    return [s('Find prime numbers')];
  }
  public override successDetails(choice: ExpressionTypes): ExpressionTypes[] {
    return [choice, s('is not divisible by anything except 1 and itself')];
  }
  public override errorDetails(choice: ExpressionTypes): ExpressionTypes[] {
    const validFactorsFormatted = format_and([
      ...getValidFactors(choice.value),
    ]);
    return [choice, s(`has factors such as ${validFactorsFormatted}`)];
  }
  public override getValidSamples(): Set<ExpressionData> {
    return toExpressionDataSet(getPrimes());
  }
  public override getRandomSamples(count: number): Set<ExpressionData> {
    return toExpressionDataSet(
      getRandomNaturalNumberSet(dataUpperBound, count),
    );
  }
}
