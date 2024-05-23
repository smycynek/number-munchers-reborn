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
  getValidDivisionPairs
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
}
  from './sampleRandomValues';

export enum PuzzleType {
  MULTIPLICATION,
  DIVISION,
  GREATER_LESS_THAN,
  MISC
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
    public readonly responseText: string,
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
    return [
      new Puzzle(
        (cellValue: ValuePair) => isPerfectSquare(cellValue.value),
        dataUpperBound,
        'Find perfect squares',
        'a perfect square.',
        (cellValue: ValuePair) => { return `${Math.sqrt(cellValue.value)} times itself (${Math.sqrt(cellValue.value)}) equals ${cellValue.value}` },
        (cellValue: ValuePair) => { return `There are no whole numbers when multiplied by themselves that are equal to ${cellValue.value}` },
        () => toValuePairSet(getPerfectSquares()),
        (count: number) => toValuePairSet(getRandomNaturalNumberSet(dataUpperBound, count)),
        PuzzleType.MISC,
        true
      ),
      new Puzzle(
        (cellValue: ValuePair) => isPrime(cellValue.value),
        dataUpperBound,
        'Find prime numbers',
        'a prime number',
        (cellValue: ValuePair) => { return `${cellValue.value} is not divisible by anything except 1 and itself (${cellValue.value})`; },
        (cellValue: ValuePair) => { return `${cellValue.value} has factors such as ${format_and([...getValidFactors(cellValue.value)])}`; },
        () => toValuePairSet(getPrimes()),
        (count: number) => toValuePairSet(getRandomNaturalNumberSet(dataUpperBound, count)),
        PuzzleType.MISC,
        true
      ),
      new Puzzle(
        (cellValue: ValuePair) => (isBetween(cellValue.value, randomBetweenBounds[0], randomBetweenBounds[1], false)),
        dataUpperBound,
        `Find numbers between ${randomBetweenBounds[0]} and ${randomBetweenBounds[1]}`,
        `between ${randomBetweenBounds[0]} and ${randomBetweenBounds[1]}`,
        (cellValue: ValuePair) => { return `${cellValue.value} is greater than ${randomBetweenBounds[0]} and less than ${randomBetweenBounds[1]}`; },
        (cellValue: ValuePair) => { return `${cellValue.value} is not greater than ${randomBetweenBounds[0]} and less than ${randomBetweenBounds[1]}`; },
        () => toValuePairSet(getValidBetweenValues(randomBetweenBounds[0], randomBetweenBounds[1], false)),
        (count: number) => toValuePairSet(getRandomNaturalNumberSet(dataUpperBound, count)),
        PuzzleType.GREATER_LESS_THAN,
        true
      ),
      new Puzzle(
        (cellValue: ValuePair) => (isBetween(cellValue.value, randomBetweenBounds[0], randomBetweenBounds[1], true)),
        dataUpperBound,
        `Find numbers ${greaterEqual}  ${randomBetweenBounds[0]} and ${lessEqual} ${randomBetweenBounds[1]}`,
        `${greaterEqual} ${randomBetweenBounds[0]} and ${lessEqual} ${randomBetweenBounds[1]}`,
        (cellValue: ValuePair) => { return `${cellValue.value} is greater than or equal to ${randomBetweenBounds[0]} and less than or equal to ${randomBetweenBounds[1]}`; },
        (cellValue: ValuePair) => { return `${cellValue.value} is not greater than or equal to ${randomBetweenBounds[0]} and less than or equal to ${randomBetweenBounds[1]}`; },
        () => toValuePairSet(getValidBetweenValues(randomBetweenBounds[0], randomBetweenBounds[1], true)),
        (count: number) => toValuePairSet(getRandomNaturalNumberSet(dataUpperBound, count)),
        PuzzleType.GREATER_LESS_THAN,
        true
      ),
      new Puzzle(
        (cellValue: ValuePair) => isOutsideExclusive(cellValue.value, randomBetweenBoundsWide[0], randomBetweenBoundsWide[1]),
        dataUpperBound,
        `Find numbers > ${randomBetweenBoundsWide[1]} or < ${randomBetweenBoundsWide[0]}`,
        `> ${randomBetweenBoundsWide[1]} or < ${randomBetweenBoundsWide[0]}`,
        (cellValue: ValuePair) => { return `${cellValue.value} is either greater than ${randomBetweenBoundsWide[1]} or less than ${randomBetweenBoundsWide[0]}`; },
        (cellValue: ValuePair) => { return `${cellValue.value} is not greater than ${randomBetweenBoundsWide[1]} or less than ${randomBetweenBoundsWide[0]}`; },
        () => toValuePairSet(getValidOutsideExclusiveValues(randomBetweenBoundsWide[0], randomBetweenBoundsWide[1])),
        (count: number) => toValuePairSet(getRandomNaturalNumberSet(dataUpperBound, count)),
        PuzzleType.GREATER_LESS_THAN,
        true
      ),
      new Puzzle(
        (cellValue: ValuePair) => isMultiple(cellValue.value, randomMultipleBase),
        dataUpperBound,
        `Find multiples of ${randomMultipleBase}`,
        `a multiple of ${randomMultipleBase}.`,
        (cellValue: ValuePair) => { return `${randomMultipleBase} times ${cellValue.value / randomMultipleBase} equals ${cellValue.value}` },
        (cellValue: ValuePair) => { return `No whole numbers times ${randomMultipleBase} equal ${cellValue.value}` },
        () => toValuePairSet(getValidMultiples(randomMultipleBase)),
        (count: number) => toValuePairSet(getRandomNaturalNumberSet(dataUpperBound, count)),
        PuzzleType.MULTIPLICATION,
        true
      ),
      new Puzzle(
        (cellValue: ValuePair) => isMultiple(cellValue.value, randomMultipleBase),
        dataUpperBound,
        `Find numbers divisible by ${randomMultipleBase}`,
        `divisible by ${randomMultipleBase}.`,
        (cellValue: ValuePair) => { return `${cellValue.value} divided by ${randomMultipleBase} equals ${cellValue.value / randomMultipleBase}` },
        (cellValue: ValuePair) => { return `${cellValue.value} divided by ${randomMultipleBase} is ${round3(cellValue.value / randomMultipleBase) }, not a whole number` },
        () => toValuePairSet(getValidMultiples(randomMultipleBase)),
        (count: number) => toValuePairSet(getRandomNaturalNumberSet(dataUpperBound, count)),
        PuzzleType.DIVISION,
        true
      ),
      new Puzzle(
        (cellValue: ValuePair) => isFactor(cellValue.value, randomFactorTarget),
        dataUpperBoundLow,
        `Find factors of ${randomFactorTarget}`,
        `a factor of ${randomFactorTarget}`,
        (cellValue: ValuePair) => { return `${cellValue.value} times ${randomFactorTarget / cellValue.value} equals ${randomFactorTarget}`; },
        (cellValue: ValuePair) => { return `No whole numbers multiplied by ${cellValue.value} equal ${randomFactorTarget}`; },
        () => toValuePairSet(getValidFactors(randomFactorTarget)),
        (count: number) => toValuePairSet(getRandomNaturalNumberSet(dataUpperBoundLow, count)),
        PuzzleType.MULTIPLICATION,
        true
      ),
      new Puzzle(
        (cellValue: ValuePair) => cellValue.value === randomMultiplicationTarget,
        dataUpperBoundLow,
        `Find expressions equal to ${randomMultiplicationTarget}`,
        `equal to ${randomMultiplicationTarget}`,
        (cellValue: ValuePair) => { return `${cellValue.valueAsString} = ${randomMultiplicationTarget}`; },
        (cellValue: ValuePair) => { return `${cellValue.valueAsString} = ${cellValue.value}, not ${randomMultiplicationTarget}`; },
        () => getValidMultiplicationPairs(randomMultiplicationTarget),
        (count: number) => getRandomMultiplicationPairs(count),
        PuzzleType.MULTIPLICATION,
        true,
        'Multiplication Expressions'
      ),
      new Puzzle(
        (cellValue: ValuePair) => cellValue.value === randomQuotientTarget,
        dataUpperBoundLow,
        `Find expressions equal to ${randomQuotientTarget}`,
        `equal to ${randomQuotientTarget}`,
        (cellValue: ValuePair) => { return `${cellValue.valueAsString} = ${randomQuotientTarget}`; },
        (cellValue: ValuePair) => { return `${cellValue.valueAsString} = ${round3(cellValue.value)}, not ${randomQuotientTarget}`; },
        () => getValidDivisionPairs(randomQuotientTarget),
        (count: number) => getRandomDivisionPairs(count),
        PuzzleType.DIVISION,
        true,
        'Division Expressions'
      ),

    ];

  }
}
