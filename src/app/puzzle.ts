import {
  dataUpperBound,
  dataUpperBoundLow,
  greaterEqual,
  lessEqual,
  maxReplacements
} from './constants';
import { DataCell, ValuePair } from './dataCell';

import {
  valuePairSetHas,
  debug,
  format_and,
  round3,
  toValuePairSet,
} from './utility';

import {
  isBetween,
  isFactor,
  isMultiple,
  isPerfectSquare,
  isOutsideExclusive,
  isPrime,
} from './predicates';

import {
  getPrimes,
  getValidBetweenValues,
  getValidFactors,
  getValidMultiples,
  getValidOutsideExclusiveValues,
  getPerfectSquares,
  getValidMultiplicationPairs,
  getValidDivisionPairs,
  getValidFractions
}
  from './sampleValidValues';

import {
  getRandomNumberWithinRange,
  getRandomNaturalNumberSet,
  getRandomFactorTarget,
  getRandomBetweenBounds,
  getRandomBetweenBoundsWide,
  getRandomMultipleBase,
  getRandomItemFromSetAndRemove,
  getRandomMultiplicationPairs,
  getRandomDivisionPairs,
  getRandomFractionBase,
  getRandomFractions,
}
  from './sampleRandomValues';
import { mb } from './mixed-value-sentence/mathBuilder';

export enum PuzzleType {
  MULTIPLICATION,
  DIVISION,
  GREATER_LESS_THAN,
  MISC,
  FRACTIONS
}

export class Puzzle {
  public static getRandomPuzzle(puzzleTypes: Set<PuzzleType>) {
    const puzzles = Puzzle.createPuzzles().filter(p => puzzleTypes.has(p.type) && p.include);
    return puzzles[getRandomNumberWithinRange(0, puzzles.length - 1)];
  }

  public generateCell(curatedValues: Set<ValuePair>) {
    const value = getRandomItemFromSetAndRemove(curatedValues)
    debug(`Value to set: ${value}`)
    const valid = this.predicate(value);
    return new DataCell(value, valid, false);
  }

  public generateCells(totalValues: number): Set<DataCell> {
    const dataCells: Set<DataCell> = new Set();
    const curatedValues = this.getCuratedValues(totalValues);
    for (let idx = 0; idx != totalValues; idx++) {
      const data = this.generateCell(curatedValues)
      dataCells.add(data);
    }
    return dataCells;
  }

  private constructor(
    private predicate: (val: ValuePair) => boolean,
    public maxValue: number,
    public readonly questionText: string,
    public successDetails: (valuePair: ValuePair) => string,
    public errorDetails: (valuePair: ValuePair) => string,
    public getValidSamples: () => Set<ValuePair>,
    public getRandomSamples: (count: number, maxValue: number) => Set<ValuePair>,
    public type: PuzzleType,
    public include: boolean = true,
    public name: string = ''
  ) { }

  private getCuratedValues(count: number, addValidValues: boolean = true): Set<ValuePair> {
    const curatedValues = this.getRandomSamples(count, this.maxValue);
    if (addValidValues) {
      const validSamples = this.getValidSamples();
      let replacements = maxReplacements;
      if (this.type === PuzzleType.MULTIPLICATION) {
        replacements *= 2;
      }
      const replacementCount = validSamples.size < replacements ? validSamples.size : replacements;
      debug(`Valid samples for puzzle: ${[...validSamples]}`);
      debug(`Substituting in ${replacements} correct answers.`);
      for (let idx = 0; idx != replacementCount; idx++) {
        const validValue = getRandomItemFromSetAndRemove(validSamples);
        if (valuePairSetHas(validValue, curatedValues)) {
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

    debug(`Curated final values: ${[...curatedValues]} : ${curatedValues.size}`);
    return curatedValues;
  }

  private static createPuzzles(): Puzzle[] {
    const randomFactorTarget = getRandomFactorTarget(2);
    const randomMultiplicationTarget = getRandomFactorTarget(3);
    const randomQuotientTarget = getRandomNumberWithinRange(2, 11);
    const randomBetweenBounds = getRandomBetweenBounds();
    const randomBetweenBoundsWide = getRandomBetweenBoundsWide();
    const randomMultipleBase = getRandomMultipleBase();
    const randomFractionBase = getRandomFractionBase();
    
    return [
      new Puzzle(
        (cellValue: ValuePair) => isPerfectSquare(cellValue.value),
        dataUpperBound,
        mb().text('Find perfect squares').build(),
        (cellValue: ValuePair) => { return mb().number(Math.sqrt(cellValue.value), false, true).text('times itself (').number(Math.sqrt(cellValue.value), false, false).text(') equals').number(cellValue.value).build() },
        (cellValue: ValuePair) => { return mb().text('There are no whole numbers when multiplied by themselves that are equal to').number(cellValue.value).build() },
        () => toValuePairSet(getPerfectSquares()),
        (count: number) => toValuePairSet(getRandomNaturalNumberSet(dataUpperBound, count)),
        PuzzleType.MISC,
        true
      ),
      new Puzzle(
        (cellValue: ValuePair) => isPrime(cellValue.value),
        dataUpperBound,
        mb().text('Find prime numbers').build(),

        (cellValue: ValuePair) => { return mb().number(cellValue.value, false, true).text('is not divisible by anything except 1 and itself (').number(cellValue.value, false, false).text(')').build(); },

        (cellValue: ValuePair) => { return mb().number(cellValue.value, false, true).text(`has factors such as ${format_and([...getValidFactors(cellValue.value)])}`).build(); },

        () => toValuePairSet(getPrimes()),
        (count: number) => toValuePairSet(getRandomNaturalNumberSet(dataUpperBound, count)),
        PuzzleType.MISC,
        true
      ),
      new Puzzle(
        (cellValue: ValuePair) => (isBetween(cellValue.value, randomBetweenBounds[0], randomBetweenBounds[1], false)),
        dataUpperBound,
        mb().text('Find numbers between').number(randomBetweenBounds[0]).text('and').number(randomBetweenBounds[1]).build(),
        (cellValue: ValuePair) => { return mb().number(cellValue.value, false, true).text('is greater than').number(randomBetweenBounds[0]).text('and less than').number(randomBetweenBounds[1]).build(); },

        (cellValue: ValuePair) => { return mb().number(cellValue.value, false, true).text('is not greater than').number(randomBetweenBounds[0]).text('and less than').number(randomBetweenBounds[1]).build(); },

        () => toValuePairSet(getValidBetweenValues(randomBetweenBounds[0], randomBetweenBounds[1], false)),
        (count: number) => toValuePairSet(getRandomNaturalNumberSet(dataUpperBound, count)),
        PuzzleType.GREATER_LESS_THAN,
        true
      ),
      new Puzzle(
        (cellValue: ValuePair) => (isBetween(cellValue.value, randomBetweenBounds[0], randomBetweenBounds[1], true)),
        dataUpperBound,
        mb().text(`Find numbers ${greaterEqual}`).number(randomBetweenBounds[0]).text(`and ${lessEqual}`).number(randomBetweenBounds[1]).build(),
        (cellValue: ValuePair) => { return mb().number(cellValue.value, false, true).text('is greater than or equal to').number(randomBetweenBounds[0]).text('and less than or equal to').number(randomBetweenBounds[1]).build(); },

        (cellValue: ValuePair) => { return mb().number(cellValue.value, false, true).text('is not greater than or equal to').number(randomBetweenBounds[0]).text('and less than or equal to').number(randomBetweenBounds[1]).build(); },
        () => toValuePairSet(getValidBetweenValues(randomBetweenBounds[0], randomBetweenBounds[1], true)),
        (count: number) => toValuePairSet(getRandomNaturalNumberSet(dataUpperBound, count)),
        PuzzleType.GREATER_LESS_THAN,
        true
      ),
      new Puzzle(
        (cellValue: ValuePair) => isOutsideExclusive(cellValue.value, randomBetweenBoundsWide[0], randomBetweenBoundsWide[1]),
        dataUpperBound,
        mb().text('Find numbers >').number(randomBetweenBoundsWide[1], true, true).text('or <').number(randomBetweenBoundsWide[0]).build(),
        (cellValue: ValuePair) => { return mb().number(cellValue.value, false, true).text('is either greater than').number(randomBetweenBoundsWide[1]).text('or less than').number(randomBetweenBoundsWide[0]).build(); },

        (cellValue: ValuePair) => { return mb().number(cellValue.value, false, true).text('is not greater than').number(randomBetweenBoundsWide[1]).text('or less than').number(randomBetweenBoundsWide[0]).build(); },
        () => toValuePairSet(getValidOutsideExclusiveValues(randomBetweenBoundsWide[0], randomBetweenBoundsWide[1])),
        (count: number) => toValuePairSet(getRandomNaturalNumberSet(dataUpperBound, count)),
        PuzzleType.GREATER_LESS_THAN,
        true
      ),
      new Puzzle(
        (cellValue: ValuePair) => isMultiple(cellValue.value, randomMultipleBase),
        dataUpperBound,
        mb().text('Find multiples of').number(randomMultipleBase).build(),
        (cellValue: ValuePair) => { return mb().number(randomMultipleBase, false, true).text('times').number(cellValue.value / randomMultipleBase).text('equals').number(cellValue.value).build() },
        (cellValue: ValuePair) => { return mb().text('No whole numbers times').number(randomMultipleBase).text('equals').number(cellValue.value).build() },
        () => toValuePairSet(getValidMultiples(randomMultipleBase)),
        (count: number) => toValuePairSet(getRandomNaturalNumberSet(dataUpperBound, count)),
        PuzzleType.MULTIPLICATION,
        true
      ),
      new Puzzle(
        (cellValue: ValuePair) => isMultiple(cellValue.value, randomMultipleBase),
        dataUpperBound,
        mb().text('Find numbers divisible by').number(randomMultipleBase).build(),
        (cellValue: ValuePair) => { return mb().number(cellValue.value, false, true).text('divided by').number(randomMultipleBase).text('equals').number(cellValue.value / randomMultipleBase).build() },
        (cellValue: ValuePair) => { return mb().number(cellValue.value, false, true).text('divided by').number(randomMultipleBase).text('is').number(round3(cellValue.value / randomMultipleBase), true, false).text(', not a whole number').build() },
        () => toValuePairSet(getValidMultiples(randomMultipleBase)),
        (count: number) => toValuePairSet(getRandomNaturalNumberSet(dataUpperBound, count)),
        PuzzleType.DIVISION,
        true
      ),
      new Puzzle(
        (cellValue: ValuePair) => isFactor(cellValue.value, randomFactorTarget),
        dataUpperBoundLow,
        mb().text('Find factors of').number(randomFactorTarget).build(),
        (cellValue: ValuePair) => { return mb().number(cellValue.value, false, true).text('times').number(randomFactorTarget / cellValue.value).text('equals').number(randomFactorTarget).build() },
        (cellValue: ValuePair) => { return mb().text('No whole numbers multiplied by').number(cellValue.value).text('equal').number(randomFactorTarget).build() },
        () => toValuePairSet(getValidFactors(randomFactorTarget)),
        (count: number) => toValuePairSet(getRandomNaturalNumberSet(dataUpperBoundLow, count)),
        PuzzleType.MULTIPLICATION,
        true
      ),
      new Puzzle(
        (cellValue: ValuePair) => cellValue.value === randomMultiplicationTarget,
        dataUpperBoundLow,
        mb().text('Find expressions equal to').number(randomMultiplicationTarget).build(),
        (cellValue: ValuePair) => { return `${cellValue.valueAsString} ${mb().text('=').number(randomMultiplicationTarget).build()}`; },
        (cellValue: ValuePair) => { return `${cellValue.valueAsString} ${mb().text('=').number(cellValue.value, true, false).text(', not').number(randomMultiplicationTarget).build()}`; },
        () => getValidMultiplicationPairs(randomMultiplicationTarget),
        (count: number) => getRandomMultiplicationPairs(count),
        PuzzleType.MULTIPLICATION,
        true,
        'Multiplication Expressions'
      ),
      new Puzzle(
        (cellValue: ValuePair) => cellValue.value === randomQuotientTarget,
        dataUpperBoundLow,
        mb().text('Find expressions equal to').number(randomQuotientTarget).build(),
        (cellValue: ValuePair) => { return `${cellValue.valueAsString} ${mb().text('=').number(randomQuotientTarget).build()}`; },
        (cellValue: ValuePair) => { return `${cellValue.valueAsString} ${mb().text('=').number(cellValue.value, true, false).text(', not').number(randomQuotientTarget).build()}`; },
        () => getValidDivisionPairs(randomQuotientTarget),
        (count: number) => getRandomDivisionPairs(count),
        PuzzleType.DIVISION,
        true,
        'Division Expressions'
      ),
      new Puzzle(
        (cellValue: ValuePair) => cellValue.value === randomFractionBase.value,
        dataUpperBound,
        `${mb().text('Find fractions equivalent to').build()} ${randomFractionBase.valueAsString}`,
        (cellValue: ValuePair) => {return `${cellValue.valueAsString} is equivalent to ${randomFractionBase.valueAsString}`;},
        (cellValue: ValuePair) => {return  `${cellValue.valueAsString} is not equivalent to ${randomFractionBase.valueAsString}`;},
        () => getValidFractions(randomFractionBase),
        (count: number) => getRandomFractions(count, randomFractionBase),
        PuzzleType.FRACTIONS,
        true,
        'Fraction Basics'
      )
    ];
  }
}
