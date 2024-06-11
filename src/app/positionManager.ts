import { Signal, WritableSignal, signal } from '@angular/core';
import { puzzleRows, puzzleColumns } from './constants';

export class PositionManager {
    public readonly rowCount: Signal<number> = signal(puzzleRows);
    public readonly columnCount: Signal<number> = signal(puzzleColumns);
    public readonly activeRow: WritableSignal<number> = signal(0);
    public readonly activeColumn: WritableSignal<number> = signal(0);
    public readonly mertinIndex: WritableSignal<number> = signal(-1);
}