import {
  dataUpperBound,
  maxReplacements
} from "./constants";
import { DataCell } from "./dataCell";

import {
  debug,
  format_and,
} from "./utility";

import {
  isBetween,
  isFactor,
  isMultiple,
  isPerfectSquare,
  isOutsideExclusive,
  isPrime,
} from "./predicates";

import {
  getPrimes,
  getValidBetweenValues,
  getValidFactors,
  getValidMultiples,
  getValidOutsideExclusiveValues,
  perfectSquares
}
  from "./sampleValidValues";

import {
  getRandomNumberWithinRange,
  getRandomItemFromSetAndRemove,
  getRandomNaturalNumberSet,
  getRandomFactorTarget,
  getRandomBetweenBounds,
  getRandomBetweenBoundsWide,
  getRandomMultipleBase,
}
  from "./sampleRandomValues";

export class Puzzle {
  public static getRandomPuzzle() {
    const puzzles = Puzzle.createPuzzles();
    return puzzles[getRandomNumberWithinRange(0, puzzles.length - 1)];
  }

  public generateCells(totalValues: number): Set<DataCell> {
    const dataCells: Set<DataCell> = new Set();
    const curatedValues = this.getCuratedValues(totalValues);
    for (let idx = 0; idx != totalValues; idx++) {
      const value = getRandomItemFromSetAndRemove(curatedValues);
      const valid = this.predicate(value);
      const data = new DataCell(value, valid, false);
      dataCells.add(data);
    }
    return dataCells;
  }

  private constructor(
    private predicate: (val: number) => boolean,
    public readonly questionText: string,
    public readonly responseText: string,
    public successDetails: (val: number) => string,
    public errorDetails: (val: number) => string,
    private readonly maxSquareValue: number,
    private validSamples: Set<number>
  ) { }

  private getCuratedValues(totalValues: number): Set<number> {
    const curatedValues = new Set(getRandomNaturalNumberSet(this.maxSquareValue, totalValues));
    debug('--');
    debug(`Curated init: ${[...curatedValues]} : ${curatedValues.size}`);
    const replacementCount = this.validSamples.size < maxReplacements ? this.validSamples.size : maxReplacements;

    debug(`Valid samples: ${[...this.validSamples]}`);
    for (let idx = 0; idx != replacementCount; idx++) {
      const validValue = getRandomItemFromSetAndRemove(this.validSamples);
      if (curatedValues.has(validValue)) {
        debug("Value exists");
        continue;
      } else {
        const valueToRemove = getRandomItemFromSetAndRemove(curatedValues);
        debug("Value to remove: " + valueToRemove);
        curatedValues.add(validValue);
        debug("Adding valid value: " + validValue);
      }
    }
    debug(`Curated final: ${[...curatedValues]} : ${curatedValues.size}`);
    return curatedValues;
  }

  private static createPuzzles(): Puzzle[] {
    const randomFactorTarget = getRandomFactorTarget();
    const randomBetweenBounds = getRandomBetweenBounds();
    const randomBetweenBoundsWide = getRandomBetweenBoundsWide();
    const randomMultipleBase = getRandomMultipleBase();
    return [
      new Puzzle(
        (cellValue: number) => (isBetween(cellValue, randomBetweenBounds[0], randomBetweenBounds[1], false)),
        `Find numbers between ${randomBetweenBounds[0]} and ${randomBetweenBounds[1]}`,
        `between ${randomBetweenBounds[0]} and ${randomBetweenBounds[1]}`,
        (cellValue: number) => { return `${cellValue} is greater than ${randomBetweenBounds[0]} and less than ${randomBetweenBounds[1]}`; },
        (cellValue: number) => { return `${cellValue} is not greater than ${randomBetweenBounds[0]} and less than ${randomBetweenBounds[1]}`; },
        dataUpperBound,
        getValidBetweenValues(randomBetweenBounds[0], randomBetweenBounds[1], false)
      ),
      new Puzzle(
        (cellValue: number) => (isBetween(cellValue, randomBetweenBounds[0], randomBetweenBounds[1], true)),
        `Find numbers >= ${randomBetweenBounds[0]} and <= ${randomBetweenBounds[1]}`,
        `>= ${randomBetweenBounds[0]} and <= ${randomBetweenBounds[1]}`,
        (cellValue: number) => { return `${cellValue} is greater than or equal to ${randomBetweenBounds[0]} and less than or equal to ${randomBetweenBounds[1]}`; },
        (cellValue: number) => { return `${cellValue} is not greater than or equal to ${randomBetweenBounds[0]} and less than or equal to ${randomBetweenBounds[1]}`; },
        dataUpperBound,
        getValidBetweenValues(randomBetweenBounds[0], randomBetweenBounds[1], true)
      ),
      new Puzzle(
        (cellValue: number) => isOutsideExclusive(cellValue, randomBetweenBoundsWide[0], randomBetweenBoundsWide[1]),
        `Find numbers > ${randomBetweenBoundsWide[1]} or < ${randomBetweenBoundsWide[0]}`,
        `> ${randomBetweenBoundsWide[1]} or < ${randomBetweenBoundsWide[0]}`,
        (cellValue: number) => { return `${cellValue} is either greater than ${randomBetweenBoundsWide[1]} or less than ${randomBetweenBoundsWide[0]}`; },
        (cellValue: number) => { return `${cellValue} is not greater than ${randomBetweenBoundsWide[1]} or less than ${randomBetweenBoundsWide[0]}`; },
        dataUpperBound,
        getValidOutsideExclusiveValues(randomBetweenBoundsWide[0], randomBetweenBoundsWide[1])
      ),
      new Puzzle(
        (cellValue: number) => isPerfectSquare(cellValue),
        "Find perfect squares",
        "a perfect square.",
        (cellValue: number) => { return `${Math.sqrt(cellValue)} times itself (${Math.sqrt(cellValue)}) equals ${cellValue}` },
        (cellValue: number) => { return `There are no whole numbers when multipied by themselves that are equal to ${cellValue}` },
        dataUpperBound,
        new Set([...perfectSquares])
      ),
      new Puzzle(
        (cellValue: number) => isMultiple(cellValue, randomMultipleBase),
        `Find multiples of ${randomMultipleBase}`,
        `a multiple of ${randomMultipleBase}.`,
        (cellValue: number) => { return `${randomMultipleBase} times ${cellValue / randomMultipleBase} equals ${cellValue}` },
        (cellValue: number) => { return `No whole numbers times ${randomMultipleBase} equal ${cellValue}` },
        dataUpperBound,
        getValidMultiples(randomMultipleBase)
      ),
      new Puzzle(
        (cellValue: number) => isMultiple(cellValue, randomMultipleBase),
        `Find numbers divisible by ${randomMultipleBase}`,
        `divisible by ${randomMultipleBase}.`,
        (cellValue: number) => { return `${cellValue} divided by ${randomMultipleBase} equals ${cellValue / randomMultipleBase}` },
        (cellValue: number) => { return `${cellValue} divided by ${randomMultipleBase} is ${Math.round((cellValue / randomMultipleBase) * 100) / 100}, not a whole number` },
        dataUpperBound,
        getValidMultiples(randomMultipleBase)
      ),
      new Puzzle(
        (cellValue: number) => isFactor(cellValue, randomFactorTarget),
        `Find factors of ${randomFactorTarget}`,
        `a factor of ${randomFactorTarget}`,
        (cellValue: number) => { return `${cellValue} times ${randomFactorTarget / cellValue} equals ${randomFactorTarget}`; },
        (cellValue: number) => { return `No whole numbers multiplied by ${cellValue} equal ${randomFactorTarget}`; },
        20, // smaller upper bound for factors
        getValidFactors(randomFactorTarget)
      ),
      new Puzzle(
        (cellValue: number) => isPrime(cellValue),
        'Find prime numbers (beta)',
        'a prime number',
        (cellValue: number) => { return `${cellValue} is not divisible by anything except 1 and itself (${cellValue})`;},
        (cellValue: number) => { return `${cellValue} has factors such as ${ format_and([...getValidFactors(cellValue)])}`; },
        dataUpperBound,
        getPrimes()
      )


    ];
  }


}
