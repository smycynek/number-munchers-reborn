import { Signal, WritableSignal, signal } from '@angular/core';
import { puzzleRows, puzzleColumns } from './constants';
import { wrapUp, debug, wrapDown } from './utility';

export class PositionManager {
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
}
