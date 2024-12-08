import { Injectable, signal, WritableSignal } from '@angular/core';
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

@Injectable({
  providedIn: 'root',
})
export class PuzzleTypeService {
  public constructor(protected titleService: Title) {}
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

  public get percentages(): boolean {
    return this.puzzleTypes.has(PuzzleType.Percentages);
  }
  public set percentages(val: boolean) {
    val
      ? this.puzzleTypes.add(PuzzleType.Percentages)
      : this.puzzleTypes.delete(PuzzleType.Percentages);
  }

  public get decimals(): boolean {
    return this.puzzleTypes.has(PuzzleType.Decimals);
  }
  public set decimals(val: boolean) {
    val
      ? this.puzzleTypes.add(PuzzleType.Decimals)
      : this.puzzleTypes.delete(PuzzleType.Decimals);
  }

  public get puzzleType(): typeof PuzzleType {
    return PuzzleType;
  }

  public validPuzzleSetSelected(): boolean {
    return this.getPuzzleTypes().size !== 0;
  }

  public getPuzzleTypeMessage(): string {
    return this.getPuzzleTypes().size === 0
      ? 'Select at least one puzzle type'
      : 'OK';
  }

  public settingsChanged: WritableSignal<boolean> = signal(false);

  public toggleType(
    value: boolean,
    type: PuzzleType,
    updateQuery?: boolean,
  ): string {
    this.settingsChanged.set(true);
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
          [...this.getPuzzleTypes().values()]
            .map((p) => PuzzleType[p])
            .join(', '),
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
      (p) => puzzleCodes.get(p) ?? '',
    );
    return codes.sort((a, b) => a.localeCompare(b)).join('');
  }
  public clearAll(): void {
    this.toggleType(false, PuzzleType.Greater_or_less_than, true);
    this.toggleType(false, PuzzleType.Addition, true);
    this.toggleType(false, PuzzleType.Subtraction, true);
    this.toggleType(false, PuzzleType.Multiplication, true);
    this.toggleType(false, PuzzleType.Division, true);
    this.toggleType(false, PuzzleType.Fractions, true);
    this.toggleType(false, PuzzleType.Decimals, true);
    this.toggleType(false, PuzzleType.Percentages, true);
    this.toggleType(false, PuzzleType.Miscellaneous, true);
    this.toggleType(false, PuzzleType.Roots, true);
    this.toggleType(false, PuzzleType.Exponents, true);
    this.settingsChanged.set(true);
  }

  public ensureValidPuzzleSelection(): void {
    if (this.getPuzzleTypes().size === 0) {
      debug('No puzzles selected, defaulting to addition');
      this.toggleType(true, PuzzleType.Addition, true);
      this.settingsChanged.set(true);
    }
  }

  public setPuzzleOptions(puzzleString: string) {
    const puzzleStringLc = puzzleString?.toLowerCase();
    if (
      !puzzleStringLc ||
      puzzleStringLc.search('/|m|a|s|d|e|f|o|g|r|p|x|/') === -1
    ) {
      return;
    }
    this.toggleType(puzzleStringLc.includes('m'), PuzzleType.Multiplication);
    this.toggleType(puzzleStringLc.includes('a'), PuzzleType.Addition);
    this.toggleType(puzzleStringLc.includes('s'), PuzzleType.Subtraction);
    this.toggleType(puzzleStringLc.includes('d'), PuzzleType.Division);
    this.toggleType(puzzleStringLc.includes('e'), PuzzleType.Exponents);
    this.toggleType(puzzleStringLc.includes('f'), PuzzleType.Fractions);
    this.toggleType(puzzleStringLc.includes('o'), PuzzleType.Miscellaneous);
    this.toggleType(
      puzzleStringLc.includes('g'),
      PuzzleType.Greater_or_less_than,
    );
    this.toggleType(puzzleStringLc.includes('r'), PuzzleType.Roots);
    this.toggleType(puzzleStringLc.includes('p'), PuzzleType.Percentages);
    this.toggleType(puzzleStringLc.includes('x'), PuzzleType.Decimals);
  }
}
