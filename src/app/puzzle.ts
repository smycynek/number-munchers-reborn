import {
  dataUpperBound,
  dataUpperBound3,
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
  getRandomSumPairs,
  getRandomDifferencePairs,
  getRandomExponentPairs,
  getRandomRootPairs,
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
  getValidSumPairs,
  getValidDifferencePairs,
  toExpressionDataSet,
  getValidExponentPairs,
  getExponentTargets,
  getRootTargets,
  getValidRootPairs,
} from './sampleValidValues';
import { OP_GTE } from '../math-components/expression-data/operators';

function toggleRValue(cellValue: ExpressionTypes): ExpressionTypes {
  cellValue.showRval = !cellValue.showRval;
  return cellValue;
}

export enum PuzzleType {
  Miscellaneous,
  Multiplication,
  Fractions,
  Division,
  Greater_or_less_than,
  Addition,
  Subtraction,
  Exponents,
  Roots,
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
      if (
        [
          PuzzleType.Multiplication,
          PuzzleType.Addition,
          PuzzleType.Subtraction,
        ].includes(this.type)
      ) {
        replacements *= 2;
        debug('Extra replacements');
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
    const randomAdditionTarget = getRandomNumberWithinRange(20, 99);
    const randomAdditionTarget3 = getRandomNumberWithinRange(200, 999);
    const randomSubtractionTarget = getRandomNumberWithinRange(1, 80);
    const exponentTargets = getExponentTargets();
    const rootTargets = getRootTargets();

    const perfectSquareSuccess = (cellValue: ExpressionData) => {
      return [
        new MixedNumberExpressionData(Math.sqrt(cellValue.value), 0, 0),
        s('times itself is'),
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
      const validFactorsFormatted = format_and([
        ...getValidFactors(cellValue.value),
      ]);
      return [
        s(`${cellValue.value} has factors such as ${validFactorsFormatted}`),
      ];
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

    const sumDiffFailure = (cellValue: ExpressionTypes, target: number) => {
      return [s('Sorry, '), toggleRValue(cellValue), s(`, not ${target}`)];
    };

    const sumDiffSuccess = (cellValue: ExpressionTypes) => {
      return [toggleRValue(cellValue)];
    };

    const sumFailure = (cellValue: ExpressionTypes) => {
      return sumDiffFailure(cellValue, randomAdditionTarget);
    };

    const diffFailure = (cellValue: ExpressionTypes) => {
      return sumDiffFailure(cellValue, randomSubtractionTarget);
    };

    const expRootSuccess = (cellValue: ExpressionTypes) => {
      return [toggleRValue(cellValue)];
    };

    const expFailure = (cellValue: ExpressionTypes) => {
      return [
        s('Sorry, '),
        toggleRValue(cellValue),
        s(
          `, not ${exponentTargets[0]}, ${exponentTargets[1]}, or ${exponentTargets[2]} `,
        ),
      ];
    };

    const rootFailure = (cellValue: ExpressionTypes) => {
      return [
        s('Sorry, '),
        toggleRValue(cellValue),
        s(
          `, not ${rootTargets[0]}, ${rootTargets[1]}, or ${rootTargets[2]} `,
        ),
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
        PuzzleType.Miscellaneous,
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
        PuzzleType.Miscellaneous,
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
        PuzzleType.Greater_or_less_than,
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
        PuzzleType.Greater_or_less_than,
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
        PuzzleType.Greater_or_less_than,
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
        PuzzleType.Multiplication,
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
        PuzzleType.Multiplication,
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
        PuzzleType.Multiplication,
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
        PuzzleType.Division,
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
        PuzzleType.Division,
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
        PuzzleType.Fractions,
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
        PuzzleType.Fractions,
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
        PuzzleType.Fractions,
        true,
        'Fraction < 1/2',
      ),
      new Puzzle(
        (cellValue: ExpressionData) => cellValue.value === randomAdditionTarget,
        dataUpperBound,
        [s(`Find sums equal to ${randomAdditionTarget}`)],
        sumDiffSuccess,
        sumFailure,
        () => getValidSumPairs(randomAdditionTarget),
        (count: number) => getRandomSumPairs(count, randomAdditionTarget, 2),
        PuzzleType.Addition,
        true,
        'Addition',
      ),
      new Puzzle(
        (cellValue: ExpressionData) => cellValue.value === randomAdditionTarget3,
        dataUpperBound3,
        [s(`Find sums equal to ${randomAdditionTarget3}`)],
        sumDiffSuccess,
        sumFailure,
        () => getValidSumPairs(randomAdditionTarget3),
        (count: number) => getRandomSumPairs(count, randomAdditionTarget3, 3),
        PuzzleType.Addition,
        true,
        'Addition 3-digit',
      ),
      new Puzzle(
        (cellValue: ExpressionData) =>
          cellValue.value === randomSubtractionTarget,
        dataUpperBound3,
        [s(`Find differences equal to ${randomSubtractionTarget}`)],
        sumDiffSuccess,
        diffFailure,
        () => getValidDifferencePairs(randomSubtractionTarget),
        (count: number) =>
          getRandomDifferencePairs(count, randomSubtractionTarget),
        PuzzleType.Subtraction,
        true,
        'Subtraction',
      ),

      new Puzzle(
        (cellValue: ExpressionData) =>
          cellValue.value === exponentTargets[0] ||
          cellValue.value === exponentTargets[1] ||
          cellValue.value === exponentTargets[2],
        dataUpperBound,
        [
          s(
            `Find exponents equal to ${exponentTargets[0]}, ${exponentTargets[1]}, or ${exponentTargets[2]}`,
          ),
        ],
        expRootSuccess,
        expFailure,
        () => getValidExponentPairs(exponentTargets),
        (count: number) => getRandomExponentPairs(count),
        PuzzleType.Exponents,
        true,
        'Exponents',
      ),

      new Puzzle(
        (cellValue: ExpressionData) =>
          cellValue.value === rootTargets[0] ||
          cellValue.value === rootTargets[1] ||
          cellValue.value === rootTargets[2],
        dataUpperBound,
        [
          s(
            `Find roots equal to ${rootTargets[0]}, ${rootTargets[1]}, or ${rootTargets[2]}`,
          ),
        ],
        expRootSuccess,
        rootFailure,
        () => getValidRootPairs(rootTargets),
        (count: number) => getRandomRootPairs(count),
        PuzzleType.Roots,
        true,
        'Roots',
      ),

    ];
  }
}
