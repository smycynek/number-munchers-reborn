import { defaultRows, defaultColumns } from "./constants";

export class PositionManager {
    private rows = defaultRows;
    private columns = defaultColumns;
    private activeRow = 0;
    private activeColumn = 0;

    public getRows(): number {
        return this.rows;
    }

    public getColumns(): number {
        return this.columns;
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

}