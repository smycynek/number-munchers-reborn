import { inject, signal, WritableSignal } from '@angular/core';
import {
  multSymbol,
  divSymbol,
  expSymbol,
  fracSymbol,
  greaterEqual,
  rootSymbol,
} from '../constants';
import { environment } from '../../environments/environment';
import { StringResources } from '../strings';
import { debug } from '../utility';
import { Title } from '@angular/platform-browser';

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
  Percentages,
  Decimals,
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
  PuzzleType.Percentages,
  PuzzleType.Decimals,
]);

export const puzzleTypeTitles: Map<string, string> = new Map([
  ['Greater_or_less_than', 'Greater or less than'],
  ['Miscellaneous', 'Odds and Ends'],
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
  [PuzzleType.Percentages, 'p'],
  [PuzzleType.Decimals, 'x'],
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
  [PuzzleType.Percentages, '%'],
  [PuzzleType.Decimals, '.'],
]);

export class PuzzleTypeService {
  public initialized: WritableSignal<boolean> = signal(false);
  protected titleService: Title = inject(Title);
  public constructor() {}
  private puzzleTypes = allPuzzles;

  public add(puzzleType: PuzzleType): void {
    this.puzzleTypes.add(puzzleType);
  }

  public delete(puzzleType: PuzzleType): void {
    this.puzzleTypes.delete(puzzleType);
  }

  public getPuzzleTypes(): Set<PuzzleType> {
    return this.puzzleTypes;
  }

  public get puzzleType(): typeof PuzzleType {
    return PuzzleType;
  }

  public toggleType(value: boolean, type: PuzzleType, updateQuery?: boolean): string {
    if (value) {
      debug(`Add: ${PuzzleType[type]}`);
      this.add(type);
    } else {
      debug(`Remove: ${PuzzleType[type]}`);
      this.delete(type);
    }

    if (updateQuery) {
      let activeTypeCodes = this.getActivePuzzleCodes();
      if (this.getPuzzleTypes().size === Object.keys(PuzzleType).length / 2) {
        activeTypeCodes = '';
      }
      this.symbols.set(this.getActivePuzzleSymbols());
      this.titleService.setTitle(
        StringResources.TITLE +
          environment.titleSuffix +
          ' - ' +
          [...this.getPuzzleTypes().values()].map((p) => PuzzleType[p]).join(', ')
      );
      return activeTypeCodes;
    }
    return '';
  }

  public symbols: WritableSignal<string> = signal('');

  public getActivePuzzleSymbols(): string {
    return `(Puzzles: ${[...this.getPuzzleTypes().values()].map((p) => puzzleSymbols.get(p)).join('')})`;
  }

  public getActivePuzzleCodes(): string {
    const codes: string[] = [...this.getPuzzleTypes().values()].map(
      (p) => puzzleCodes.get(p) ?? ''
    );
    return codes.sort((a, b) => a.localeCompare(b)).join('');
  }

  public setPuzzleOptions(puzzleString: string) {
    const puzzleStringLc = puzzleString?.toLowerCase();
    if (!puzzleStringLc || puzzleStringLc.search('/|m|a|s|d|e|f|o|g|r|p|x|/') === -1) {
      return;
    }
    this.toggleType(puzzleStringLc.includes('m'), PuzzleType.Multiplication);
    this.toggleType(puzzleStringLc.includes('a'), PuzzleType.Addition);
    this.toggleType(puzzleStringLc.includes('s'), PuzzleType.Subtraction);
    this.toggleType(puzzleStringLc.includes('d'), PuzzleType.Division);
    this.toggleType(puzzleStringLc.includes('e'), PuzzleType.Exponents);
    this.toggleType(puzzleStringLc.includes('f'), PuzzleType.Fractions);
    this.toggleType(puzzleStringLc.includes('o'), PuzzleType.Miscellaneous);
    this.toggleType(puzzleStringLc.includes('g'), PuzzleType.Greater_or_less_than);
    this.toggleType(puzzleStringLc.includes('r'), PuzzleType.Roots);
    this.toggleType(puzzleStringLc.includes('p'), PuzzleType.Percentages);
    this.toggleType(puzzleStringLc.includes('x'), PuzzleType.Decimals);
  }
}
