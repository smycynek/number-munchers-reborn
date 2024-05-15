import { puzzleRows, puzzleColumns } from "./constants";

export class PositionManager {
    private rowCount = puzzleRows;
    private columnCount = puzzleColumns;
    private activeRow = 0;
    private activeColumn = 0;
    private mertinIndex = -1;

    public getRowCount(): number {
        return this.rowCount;
    }

    public getColumnCount(): number {
        return this.columnCount;
    }

    public getActiveRow(): number {
        return this.activeRow;
    }

    public setActiveRow(row: number): void {
        this.activeRow = row;
    }

    public getActiveColumn(): number {
        return this.activeColumn;
    }

    public setActiveColumn(column: number): void {
        this.activeColumn = column;
    }

    public getMertinIndex(): number {
        return this.mertinIndex;
    }

    public setMertinIndex(index: number): void {
        this.mertinIndex = index;
    }


}