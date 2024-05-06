import { dataUpperBound } from "./constants";
import { between, factors, getBetweenBounds, getBetweenBoundsWide, getMultipleBounds, getValidMultiples, greaterThanOrLessThan, perfectSquares, primes, randomRange } from "./utility";

export class Puzzle {
  private constructor(
    public predicate: (val: number) => boolean,
    public questionText: string,
    public responseText: string,
    public successDetails: (val: number) => string,
    public errorDetails: (val: number) => string,
    public maxSquareValue: number,
    public validSamples: Set<number>

  ) { }

  public getSuccessDetails(value: number) : string {
    return value + " " + this.successDetails;
  }

  private static createPuzzles(): Puzzle[] {
    const factorNumbers = new Set<number>([...[].constructor(dataUpperBound).keys()]);
    primes.forEach(p => factorNumbers.delete(p));
    const randomFactor = [...factorNumbers.values()][Math.floor(Math.random() * factorNumbers.size)];
    const betweenBounds = getBetweenBounds();
    const betweenBoundsWide = getBetweenBoundsWide();
    const multipleBounds = getMultipleBounds();
    return [
      new Puzzle(
        (item: number) => ((item > betweenBounds[0]) && (item < betweenBounds[1])),
        `numbers between ${betweenBounds[0]} and ${betweenBounds[1]}`,
        `between ${betweenBounds[0]} and ${betweenBounds[1]}`,
        (item: number) => {return `${item} is greater than ${betweenBounds[0]} and less than ${betweenBounds[1]}`; },
        (item: number) => {return `${item} is not greater than ${betweenBounds[0]} and less than ${betweenBounds[1]}`; },
        dataUpperBound,
        between(betweenBounds[0], betweenBounds[1], false)
      ),
      new Puzzle(
        (item: number) => ((item >= betweenBounds[0]) && (item <= betweenBounds[1])),
        `numbers >= ${betweenBounds[0]} and <= ${betweenBounds[1]}`,
        `>= ${betweenBounds[0]} and <= ${betweenBounds[1]}`,
        (item: number) => {return `${item} is greater than or equal to ${betweenBounds[0]} and less than or equal to ${betweenBounds[1]}`; },
        (item: number) => {return `${item} is not greater than or equal to ${betweenBounds[0]} and less than or equal to ${betweenBounds[1]}`; },
        dataUpperBound,
         between(betweenBounds[0], betweenBounds[1], true)
      ),
      new Puzzle(
        (item: number) => ((item > betweenBoundsWide[1]) || (item < betweenBoundsWide[0])),
        `numbers > ${betweenBoundsWide[1]} or < ${betweenBoundsWide[0]}`,
        `> ${betweenBoundsWide[1]} or < ${betweenBoundsWide[0]}`,
        (item: number) => {return `${item} is either greater than ${betweenBoundsWide[1]} or less than ${betweenBoundsWide[0]}`; },
        (item: number) => {return `${item} is not greater than ${betweenBoundsWide[1]} or less than ${betweenBoundsWide[0]}`; },
        dataUpperBound,
        greaterThanOrLessThan(betweenBoundsWide[0], betweenBoundsWide[1])
      ),
      new Puzzle(
        (item: number) => (Math.sqrt(item) === Math.floor(Math.sqrt(item))),
        "perfect squares",
        "a perfect square.",
        (item: number) => {return `${Math.sqrt(item)} times itself (${Math.sqrt(item)}) equals ${item}`},
        (item: number) => {return `There are no whole numbers when multipied by themselves that are equal to ${item}`},
        dataUpperBound,
        new Set([...perfectSquares])
      ),
      new Puzzle(
        (item: number) => ((item % multipleBounds) === 0),
        `multiples of ${multipleBounds}`,
        `a multiple of ${multipleBounds}.`,
        (item: number) => {return `${multipleBounds} times ${item/multipleBounds} equals ${item}` },
        (item: number) => {return `No whole numbers times ${multipleBounds} equal ${item}` },
        dataUpperBound,
        getValidMultiples(multipleBounds)
      ),
      new Puzzle(
        (item: number) => ((item % multipleBounds) === 0),
        `numbers divisible by ${multipleBounds}`,
        `divisible by ${multipleBounds}.`,
        (item: number) => {return `${item} divided by ${multipleBounds} equals ${item/multipleBounds}` },
        (item: number) => {return `${item} divided by ${multipleBounds} is ${Math.round((item/multipleBounds)*100)/100}, not a whole number` },
        dataUpperBound,
        getValidMultiples(multipleBounds)
      ),
      new Puzzle(
        (item: number) => ((randomFactor % item) === 0),
        `factors of ${randomFactor}`,
        `a factor of ${randomFactor}`,
        (item: number) => {return `${item} times ${randomFactor/item} equals ${randomFactor}`; },
        (item: number) => {return `No whole numbers multiplied by ${item} equal ${randomFactor}`; },
        20, // smaller upper bound for factors
        factors(randomFactor)
      )

    ];
  }

  public static getRandomPuzzle() {
    const puzzles = Puzzle.createPuzzles();
    return puzzles[randomRange(0, puzzles.length - 1)];
  }

}

/*
      new Puzzle(
      (item: number) => (item <= 30),
      "numbers less or equal to thirty",
      "less than or equal to thirty."
    ),
*/