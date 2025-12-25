import { Signal, WritableSignal, signal } from '@angular/core';
import { puzzleRows, puzzleColumns } from '../constants';
import { wrapUp, debug, wrapDown, getRandomItemFromSetAndRemove } from '../utility';

export class PositionService {
  public readonly rowCount: Signal<number> = signal(puzzleRows);
  public readonly columnCount: Signal<number> = signal(puzzleColumns);
  public readonly activeRow: WritableSignal<number> = signal(0);
  public readonly activeColumn: WritableSignal<number> = signal(0);
  public readonly mertinIndex: WritableSignal<number> = signal(-1);

  public getPosition(): string {
    return `${this.activeRow()}, ${this.activeColumn()}`;
  }

  public up() {
    this.activeRow.set(wrapUp(this.activeRow(), this.rowCount()));
    debug(`Up: ${this.getPosition()}`);
  }

  public down() {
    this.activeRow.set(wrapDown(this.activeRow(), this.rowCount()));
    debug(`Down: ${this.getPosition()}`);
  }

  public left() {
    this.activeColumn.set(wrapDown(this.activeColumn(), this.columnCount()));
    debug(`Left: ${this.getPosition()}`);
  }

  public right() {
    this.activeColumn.set(wrapUp(this.activeColumn(), this.columnCount()));
    debug(`Right: ${this.getPosition()}`);
  }

  public getRandomNonOccupiedIndex(): number {
    const activeIndex = this.activeRow() * this.columnCount() + this.activeColumn();
    const upperBound = this.columnCount() * this.rowCount();
    const base = [...[].constructor(upperBound).keys()];
    const baseSet = new Set(base);
    baseSet.delete(activeIndex);
    baseSet.delete(this.mertinIndex());
    return getRandomItemFromSetAndRemove(baseSet);
  }
}
