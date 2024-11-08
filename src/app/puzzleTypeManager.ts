import { multSymbol, divSymbol, expSymbol, fracSymbol, greaterEqual, rootSymbol } from './constants';


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

export const allPuzzles = new Set<PuzzleType>([
    PuzzleType.Miscellaneous,
    PuzzleType.Multiplication,
    PuzzleType.Fractions,
    PuzzleType.Division,
    PuzzleType.Greater_or_less_than,
    PuzzleType.Addition,
    PuzzleType.Subtraction,
    PuzzleType.Exponents,
    PuzzleType.Roots,
  ]);

  export const puzzleCodes: Map<PuzzleType, string> = new Map([
    [PuzzleType.Miscellaneous, 'o'],
    [PuzzleType.Multiplication, 'm'],
    [PuzzleType.Division, 'd'],
    [PuzzleType.Exponents, 'e'],
    [PuzzleType.Fractions, 'f'],
    [PuzzleType.Addition, 'a'],
    [PuzzleType.Subtraction, 's'],
    [PuzzleType.Greater_or_less_than, 'g'],
    [PuzzleType.Roots, 'r'],
  ]);

  export const puzzleSymbols: Map<PuzzleType, string> = new Map([
    [PuzzleType.Miscellaneous, '?'],
    [PuzzleType.Multiplication, multSymbol],
    [PuzzleType.Division, divSymbol],
    [PuzzleType.Exponents, expSymbol],
    [PuzzleType.Fractions, fracSymbol],
    [PuzzleType.Addition, '+'],
    [PuzzleType.Subtraction, '-'],
    [PuzzleType.Greater_or_less_than, greaterEqual],
    [PuzzleType.Roots, rootSymbol],
  ]);

export class PuzzleTypeManager {
    private puzzleTypes = allPuzzles;

    public add(puzzleType: PuzzleType) {
        this.puzzleTypes.add(puzzleType);
    }

    public delete(puzzleType: PuzzleType) {
        this.puzzleTypes.delete(puzzleType);
    }

    public getPuzzleTypes(): Set<PuzzleType> {
        return this.puzzleTypes;
    }

    public get multiplication(): boolean {
        return this.puzzleTypes.has(PuzzleType.Multiplication);
      }
      public set multiplication(val: boolean) {
        val
          ? this.puzzleTypes.add(PuzzleType.Multiplication)
          : this.puzzleTypes.delete(PuzzleType.Multiplication);
      }

      public get division(): boolean {
        return this.puzzleTypes.has(PuzzleType.Division);
      }
      public set division(val: boolean) {
        val
          ? this.puzzleTypes.add(PuzzleType.Division)
          : this.puzzleTypes.delete(PuzzleType.Division);
      }

      public get glt(): boolean {
        return this.puzzleTypes.has(PuzzleType.Greater_or_less_than);
      }
      public set glt(val: boolean) {
        val
          ? this.puzzleTypes.add(PuzzleType.Greater_or_less_than)
          : this.puzzleTypes.delete(PuzzleType.Greater_or_less_than);
      }

      public get misc(): boolean {
        return this.puzzleTypes.has(PuzzleType.Miscellaneous);
      }
      public set misc(val: boolean) {
        val
          ? this.puzzleTypes.add(PuzzleType.Miscellaneous)
          : this.puzzleTypes.delete(PuzzleType.Miscellaneous);
      }

      public get fractions(): boolean {
        return this.puzzleTypes.has(PuzzleType.Fractions);
      }
      public set fractions(val: boolean) {
        val
          ? this.puzzleTypes.add(PuzzleType.Fractions)
          : this.puzzleTypes.delete(PuzzleType.Fractions);
      }

      public get addition(): boolean {
        return this.puzzleTypes.has(PuzzleType.Addition);
      }
      public set addition(val: boolean) {
        val
          ? this.puzzleTypes.add(PuzzleType.Addition)
          : this.puzzleTypes.delete(PuzzleType.Addition);
      }

      public get subtraction(): boolean {
        return this.puzzleTypes.has(PuzzleType.Subtraction);
      }
      public set subtraction(val: boolean) {
        val
          ? this.puzzleTypes.add(PuzzleType.Subtraction)
          : this.puzzleTypes.delete(PuzzleType.Subtraction);
      }

      public get exponents(): boolean {
        return this.puzzleTypes.has(PuzzleType.Exponents);
      }
      public set exponents(val: boolean) {
        val
          ? this.puzzleTypes.add(PuzzleType.Exponents)
          : this.puzzleTypes.delete(PuzzleType.Exponents);
      }

      public get roots(): boolean {
        return this.puzzleTypes.has(PuzzleType.Roots);
      }
      public set roots(val: boolean) {
        val
          ? this.puzzleTypes.add(PuzzleType.Roots)
          : this.puzzleTypes.delete(PuzzleType.Roots);
      }



}