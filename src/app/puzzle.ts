import { dataUpperBound } from "./constants";
import { getBetweenBounds, getBetweenBoundsWide, getMultipleBounds, randomRange } from "./utility";

export class Puzzle {
  private constructor(
    public predicate: (val: number) => boolean,
    public questionText: string,
    public responseText: string,
    public maxSquareValue: number = dataUpperBound
  ) { }

  private static createPuzzles(): Puzzle[] {
    const factorNumbers = new Set<number>([...[].constructor(dataUpperBound).keys()]);
    const primes = [0, 1, 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97];
    primes.forEach(p => factorNumbers.delete(p));
    const randomFactor = [...factorNumbers.values()][Math.floor(Math.random() * factorNumbers.size)];
    const betweenBounds = getBetweenBounds();
    const betweenBoundsWide = getBetweenBoundsWide();
    const multipleBounds = getMultipleBounds();
    return [
      new Puzzle(
        (item: number) => ((item > betweenBounds[0]) && (item < betweenBounds[1])),
        `numbers between ${betweenBounds[0]} and ${betweenBounds[1]}`,
        `between  ${betweenBounds[0]} and ${betweenBounds[1]}`
      ),
      new Puzzle(
        (item: number) => ((item >= betweenBounds[0]) && (item <= betweenBounds[1])),
        `numbers >= ${betweenBounds[0]} and <= ${betweenBounds[1]}`,
        `>= ${betweenBounds[0]} and <= ${betweenBounds[1]}`
      ),
      new Puzzle(
        (item: number) => ((item > betweenBoundsWide[1]) || (item < betweenBoundsWide[0])),
        `numbers > ${betweenBoundsWide[1]} or < ${betweenBoundsWide[0]}`,
        `> ${betweenBoundsWide[1]} or < ${betweenBoundsWide[0]}`
      ),
      new Puzzle(
        (item: number) => (Math.sqrt(item) === Math.floor(Math.sqrt(item))),
        "perfect squares (ask for help)",
        "a perfect square."
      ),
      new Puzzle(
        (item: number) => ((item % multipleBounds) === 0),
        `multiples of ${multipleBounds}`,
        `a multiple of ${multipleBounds}.`
      ),
      new Puzzle(
        (item: number) => ((item % multipleBounds) === 0),
        `numbers divisible by ${multipleBounds}`,
        `divisible by ${multipleBounds}.`
      ),
      new Puzzle(
        (item: number) => ((randomFactor % item) === 0),
        `factors of ${randomFactor}`,
        `a factor of ${randomFactor}`,
        20
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