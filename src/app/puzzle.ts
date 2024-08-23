import {
  dataUpperBound,
  dataUpperBoundLow,
  greaterEqual,
  lessEqual,
  maxReplacements,
} from './constants';
import { DataCell } from './dataCell';

import { debug, format_and, round3 } from './utility';

import {
  isBetween,
  isFactor,
  isMultiple,
  isOutsideExclusive,
  isPerfectSquare,
  isPrime,
} from './predicates';

import {
  getRandomNumberWithinRange,
  getRandomNaturalNumberSet,
  getRandomItemFromSetAndRemove,
  getRandomFactorTarget,
  getRandomMultiplicationPairs,
  getRandomFractions,
  getRandomFractionBase,
  getRandomMultipleBase,
  getRandomBetweenBounds,
  getRandomBetweenBoundsWide,
  getRandomDivisionPairs,
  getValidFactors,
} from './sampleRandomValues';

import {
  ExpressionData,
  ExpressionTypes,
  MixedNumberExpressionData,
  s,
} from '../math-components/expression-data/expressionData';
import {
  expressionDataSetHas,
  getPerfectSquares,
  getPrimes,
  getValidBetweenValues,
  getValidDivisionPairs,
  getValidFractions,
  getValidMultiples,
  getValidMultiplicationPairs,
  getValidOutsideExclusiveValues,
  toExpressionDataSet,
} from './sampleValidValues';
import { OP_GTE } from '../math-components/expression-data/operators';

function toggleRValue(cellValue: ExpressionTypes): ExpressionTypes {
  cellValue.showRval = !cellValue.showRval;
  return cellValue;
}

export enum PuzzleType {
  MISC,
  MULTIPLICATION,
  FRACTIONS,
  DIVISION,
  GREATER_LESS_THAN,
}

export class Puzzle {
  public static getRandomPuzzle(puzzleTypes: Set<PuzzleType>) {
    const puzzles = Puzzle.createPuzzles().filter(
      (p) => puzzleTypes.has(p.type) && p.include,
    );
    return puzzles[getRandomNumberWithinRange(0, puzzles.length - 1)];
  }

  public generateCell(curatedValues: Set<ExpressionData>) {
    const value = getRandomItemFromSetAndRemove(curatedValues);
    debug(`Value to set: ${value}`);
    const valid = this.predicate(value);
    return new DataCell(value, valid, false);
  }

  public generateCells(totalValues: number): Set<DataCell> {
    const dataCells: Set<DataCell> = new Set();
    const curatedValues = this.getCuratedValues(totalValues);
    for (let idx = 0; idx != totalValues; idx++) {
      const data = this.generateCell(curatedValues);
      dataCells.add(data);
    }
    return dataCells;
  }

  private constructor(
    private predicate: (val: ExpressionData) => boolean,
    public maxValue: number,
    public questionText: ExpressionTypes[],
    public successDetails: (value: ExpressionTypes) => ExpressionTypes[],
    public errorDetails: (value: ExpressionTypes) => ExpressionTypes[],
    public getValidSamples: () => Set<ExpressionData>,
    public getRandomSamples: (
      count: number,
      maxValue: number,
    ) => Set<ExpressionData>,
    public type: PuzzleType,
    public include: boolean = true,
    public name: string = '',
  ) {}

  private getCuratedValues(
    count: number,
    addValidValues: boolean = true,
  ): Set<ExpressionData> {
    const curatedValues = this.getRandomSamples(count, this.maxValue);
    if (addValidValues) {
      const validSamples = this.getValidSamples();
      let replacements = maxReplacements;
      if (this.type === PuzzleType.MULTIPLICATION) {
        replacements *= 2;
      }
      const replacementCount =
        validSamples.size < replacements ? validSamples.size : replacements;
      debug(`Valid samples for puzzle: ${[...validSamples]}`);
      debug(`Substituting in ${replacements} correct answers.`);
      for (let idx = 0; idx != replacementCount; idx++) {
        const validValue = getRandomItemFromSetAndRemove(validSamples);
        if (expressionDataSetHas(validValue, curatedValues)) {
          debug(`Value exists: ${validValue}`);
          continue;
        } else {
          const valueToRemove = getRandomItemFromSetAndRemove(curatedValues);
          debug('Value to remove: ' + valueToRemove);
          curatedValues.add(validValue);
          debug('Adding valid value: ' + validValue);
        }
      }
    }

    debug(
      `Curated final values: ${[...curatedValues]} : ${curatedValues.size}`,
    );
    return curatedValues;
  }

  private static createPuzzles(): Puzzle[] {
    const randomMultiplicationTarget = getRandomFactorTarget(3);
    const randomMultipleBase = getRandomMultipleBase();
    const randomQuotientTarget = getRandomNumberWithinRange(2, 11);
    const randomBetweenBounds = getRandomBetweenBounds();
    const randomBetweenBoundsWide = getRandomBetweenBoundsWide();
    const randomFactorTarget = getRandomFactorTarget(2);
    const randomFractionBase = getRandomFractionBase();

    const perfectSquareSuccess = (cellValue: ExpressionData) => {
      return [
        new MixedNumberExpressionData(Math.sqrt(cellValue.value), 0, 0),
        s('time itself is'),
        new MixedNumberExpressionData(cellValue.value, 0, 0),
      ];
    };
    const perfectSquareFailure = (cellValue: ExpressionData) => {
      return [
        s('Sorry, no number times itself equals'),
        new MixedNumberExpressionData(cellValue.value, 0, 0),
      ];
    };

    const primeSuccess = (cellValue: ExpressionTypes) => {
      return [
        s(
          `${cellValue.value} is not divisible by anything except 1 and itself (${cellValue.value})`,
        ),
      ];
    };
    
    const primeFailure = (cellValue: ExpressionTypes) => {
      const validFactorsFormatted = format_and([...getValidFactors(cellValue.value)]);
      return [s(`${cellValue.value} has factors such as ${validFactorsFormatted}`)];
    };

    const betweenSuccess = (cellValue: ExpressionTypes) => {
      return [
        s(
          `${cellValue.value} is greater than ${randomBetweenBounds[0]} and less than ${randomBetweenBounds[1]}`,
        ),
      ];
    };
    const betweenFailure = (cellValue: ExpressionTypes) => {
      return [
        s(
          `${cellValue.value} is not greater than ${randomBetweenBounds[0]} and less than ${randomBetweenBounds[1]}`,
        ),
      ];
    };

    const betweenInclusiveSuccess = (cellValue: ExpressionTypes) => {
      return [
        s(
          `${cellValue.value} is greater than or equal to ${randomBetweenBounds[0]} and less than or equal to ${randomBetweenBounds[1]}`,
        ),
      ];
    };
    const betweenInclusiveFailure = (cellValue: ExpressionTypes) => {
      return [
        s(
          `${cellValue.value} is not greater than or equal to ${randomBetweenBounds[0]} and less than or equal to ${randomBetweenBounds[1]}`,
        ),
      ];
    };

    const outsideExclusiveSuccess = (cellValue: ExpressionTypes) => {
      return [
        s(
          `${cellValue.value} is either greater than ${randomBetweenBoundsWide[1]} or less than ${randomBetweenBoundsWide[0]}`,
        ),
      ];
    };
    const outsideExclusiveFailure = (cellValue: ExpressionTypes) => {
      return [
        s(
          `${cellValue.value} is not either greater than ${randomBetweenBoundsWide[1]} or less than ${randomBetweenBoundsWide[0]}`,
        ),
      ];
    };

    const multiplicationSuccess = (cellValue: ExpressionTypes) => {
      return [toggleRValue(cellValue)];
    };
    const multiplicationFailure = (cellValue: ExpressionTypes) => {
      return [
        toggleRValue(cellValue),
        s(`, not ${randomMultiplicationTarget}`),
      ];
    };

    const multiplesSuccess = (cellValue: ExpressionTypes) => {
      return [
        s(
          `${randomMultipleBase} times ${
            cellValue.value / randomMultipleBase
          } equals ${cellValue.value}`,
        ),
      ];
    };
    const multiplesFailure = (cellValue: ExpressionTypes) => {
      return [
        s(
          `No whole numbers times ${randomMultipleBase} equals ${cellValue.value}`,
        ),
      ];
    };

    const factorsSuccess = (cellValue: ExpressionTypes) => {
      return [
        s(
          `${cellValue.value} times ${
            randomFactorTarget / cellValue.value
          }  equals ${randomFactorTarget}`,
        ),
      ];
    };
    const factorsFailure = (cellValue: ExpressionTypes) => {
      return [
        s(
          `No whole numbers multiplied by ${cellValue.value} equal ${randomFactorTarget}`,
        ),
      ];
    };

    const divisionSuccess = (cellValue: ExpressionTypes) => {
      return [toggleRValue(cellValue)];
    };
    const divisionFailure = (cellValue: ExpressionTypes) => {
      return [toggleRValue(cellValue), s(`, not ${randomQuotientTarget}`)];
    };

    const divisibleBySuccess = (cellValue: ExpressionTypes) => {
      return [
        s(
          `${cellValue.value} divided by ${randomMultipleBase} equals ${
            cellValue.value / randomMultipleBase
          }`,
        ),
      ];
    };
    const divisibleByFailure = (cellValue: ExpressionTypes) => {
      return [
        s(
          `${cellValue.value} divided by ${randomMultipleBase} is ${round3(
            cellValue.value / randomMultipleBase,
          )}, not a whole number.`,
        ),
      ];
    };

    const fractionEquivalentSuccess = (cellValue: ExpressionTypes) => {
      return [cellValue, s('is equivalent to'), randomFractionBase];
    };
    const fractionEquivalentFailure = (cellValue: ExpressionTypes) => {
      return [cellValue, s('is not equivalent to'), randomFractionBase];
    };

    const gteHalfSuccess = (cellValue: ExpressionTypes) => {
      return [cellValue, s(OP_GTE), new MixedNumberExpressionData(0, 1, 2)];
    };
    const gteHalfFailure = (cellValue: ExpressionTypes) => {
      return [
        s('Sorry,'),
        cellValue,
        s(`is not ${OP_GTE}`),
        new MixedNumberExpressionData(0, 1, 2),
      ];
    };

    const ltHalfSuccess = (cellValue: ExpressionTypes) => {
      return [cellValue, s('<'), new MixedNumberExpressionData(0, 1, 2)];
    };
    const ltHalfFailure = (cellValue: ExpressionTypes) => {
      return [
        s('Sorry,'),
        cellValue,
        s('is not <'),
        new MixedNumberExpressionData(0, 1, 2),
      ];
    };

    return [
      new Puzzle(
        (cellValue: ExpressionData) => isPerfectSquare(cellValue.value),
        dataUpperBound,
        [s('Find perfect squares')],
        perfectSquareSuccess,
        perfectSquareFailure,
        () => toExpressionDataSet(getPerfectSquares()),
        (count: number) =>
          toExpressionDataSet(getRandomNaturalNumberSet(dataUpperBound, count)),
        PuzzleType.MISC,
        true,
        'Perfect Squares',
      ),

      new Puzzle(
        (cellValue: ExpressionData) => isPrime(cellValue.value),
        dataUpperBound,
        [s('Find prime numbers')],
        primeSuccess,
        primeFailure,
        () => toExpressionDataSet(getPrimes()),
        (count: number) =>
          toExpressionDataSet(getRandomNaturalNumberSet(dataUpperBound, count)),
        PuzzleType.MISC,
        true,
        'Primes',
      ),

      new Puzzle(
        (cellValue: ExpressionData) =>
          isBetween(
            cellValue.value,
            randomBetweenBounds[0],
            randomBetweenBounds[1],
            false,
          ),
        dataUpperBound,
        [
          s(
            `Find numbers between ${randomBetweenBounds[0]} and ${randomBetweenBounds[1]}`,
          ),
        ],
        betweenSuccess,
        betweenFailure,
        () =>
          toExpressionDataSet(
            getValidBetweenValues(
              randomBetweenBounds[0],
              randomBetweenBounds[1],
              false,
            ),
          ),
        (count: number) =>
          toExpressionDataSet(getRandomNaturalNumberSet(dataUpperBound, count)),
        PuzzleType.GREATER_LESS_THAN,
        true,
        'Between',
      ),
      new Puzzle(
        (cellValue: ExpressionData) =>
          isBetween(
            cellValue.value,
            randomBetweenBounds[0],
            randomBetweenBounds[1],
            true,
          ),
        dataUpperBound,
        [
          s(
            `Find numbers ${greaterEqual} ${randomBetweenBounds[0]} and ${lessEqual}  ${randomBetweenBounds[1]}  `,
          ),
        ],
        betweenInclusiveSuccess,
        betweenInclusiveFailure,
        () =>
          toExpressionDataSet(
            getValidBetweenValues(
              randomBetweenBounds[0],
              randomBetweenBounds[1],
              true,
            ),
          ),
        (count: number) =>
          toExpressionDataSet(getRandomNaturalNumberSet(dataUpperBound, count)),
        PuzzleType.GREATER_LESS_THAN,
        true,
        'Between inclusive',
      ),

      new Puzzle(
        (cellValue: ExpressionData) =>
          isOutsideExclusive(
            cellValue.value,
            randomBetweenBoundsWide[0],
            randomBetweenBoundsWide[1],
          ),
        dataUpperBound,
        [
          s(
            `Find numbers > ${randomBetweenBoundsWide[1]} or < ${randomBetweenBoundsWide[0]}`,
          ),
        ],
        outsideExclusiveSuccess,
        outsideExclusiveFailure,
        () =>
          toExpressionDataSet(
            getValidOutsideExclusiveValues(
              randomBetweenBoundsWide[0],
              randomBetweenBoundsWide[1],
            ),
          ),
        (count: number) =>
          toExpressionDataSet(getRandomNaturalNumberSet(dataUpperBound, count)),
        PuzzleType.GREATER_LESS_THAN,
        true,
        'Outside exclusive',
      ),

      new Puzzle(
        (cellValue: ExpressionData) =>
          cellValue.value === randomMultiplicationTarget,
        dataUpperBoundLow,
        [s(`Find expressions equal to ${randomMultiplicationTarget}`)],
        multiplicationSuccess,
        multiplicationFailure,
        () => getValidMultiplicationPairs(randomMultiplicationTarget),
        (count: number) => getRandomMultiplicationPairs(count),
        PuzzleType.MULTIPLICATION,
        true,
        'Multiplication Expressions',
      ),

      new Puzzle(
        (cellValue: ExpressionData) =>
          isMultiple(cellValue.value, randomMultipleBase),
        dataUpperBound,
        [s(`Find multiples of ${randomMultipleBase}`)],
        multiplesSuccess,
        multiplesFailure,
        () => toExpressionDataSet(getValidMultiples(randomMultipleBase)),
        (count: number) =>
          toExpressionDataSet(getRandomNaturalNumberSet(dataUpperBound, count)),
        PuzzleType.MULTIPLICATION,
        true,
        'Multiples',
      ),

      new Puzzle(
        (cellValue: ExpressionData) =>
          isFactor(cellValue.value, randomFactorTarget),
        dataUpperBoundLow,
        [s(`Find factors of ${randomFactorTarget}`)],
        factorsSuccess,
        factorsFailure,
        () => toExpressionDataSet(getValidFactors(randomFactorTarget)),
        (count: number) =>
          toExpressionDataSet(
            getRandomNaturalNumberSet(dataUpperBoundLow, count),
          ),
        PuzzleType.MULTIPLICATION,
        true,
        'Factors',
      ),

      new Puzzle(
        (cellValue: ExpressionData) => cellValue.value === randomQuotientTarget,
        dataUpperBoundLow,
        [s(`Find expressions equal to ${randomQuotientTarget}`)],
        divisionSuccess,
        divisionFailure,
        () => getValidDivisionPairs(randomQuotientTarget),
        (count: number) => getRandomDivisionPairs(count),
        PuzzleType.DIVISION,
        true,
        'Division Expressions',
      ),

      new Puzzle(
        (cellValue: ExpressionData) =>
          isMultiple(cellValue.value, randomMultipleBase),
        dataUpperBound,
        [s(`Find numbers divisible by ${randomMultipleBase}`)],
        divisibleBySuccess,
        divisibleByFailure,
        () => toExpressionDataSet(getValidMultiples(randomMultipleBase)),
        (count: number) =>
          toExpressionDataSet(getRandomNaturalNumberSet(dataUpperBound, count)),
        PuzzleType.DIVISION,
        true,
        'Divisible by',
      ),

      new Puzzle(
        (cellValue: ExpressionData) =>
          cellValue.value === randomFractionBase.value,
        dataUpperBound,
        [s('Find fractions equivalent to'), randomFractionBase],
        fractionEquivalentSuccess,
        fractionEquivalentFailure,
        () => getValidFractions(randomFractionBase),
        (count: number) => getRandomFractions(count, randomFractionBase),
        PuzzleType.FRACTIONS,
        true,
        'Fraction Equivalents',
      ),
      new Puzzle(
        (cellValue: ExpressionData) => cellValue.value >= 0.5,
        dataUpperBound,
        [s(`Find fractions ${OP_GTE}`), new MixedNumberExpressionData(0, 1, 2)],
        gteHalfSuccess,
        gteHalfFailure,
        () => getValidFractions(randomFractionBase),
        (count: number) => getRandomFractions(count, randomFractionBase),
        PuzzleType.FRACTIONS,
        true,
        `Fraction ${greaterEqual} 1/2`,
      ),

      new Puzzle(
        (cellValue: ExpressionData) => cellValue.value < 0.5,
        dataUpperBound,
        [s('Find fractions <'), new MixedNumberExpressionData(0, 1, 2)],
        ltHalfSuccess,
        ltHalfFailure,
        () => getValidFractions(randomFractionBase),
        (count: number) => getRandomFractions(count, randomFractionBase),
        PuzzleType.FRACTIONS,
        true,
        'Fraction < 1/2',
      ),
    ];
  }
}
