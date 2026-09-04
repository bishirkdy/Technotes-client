import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-table-block',
  imports: [],
  templateUrl: './table-block.html',
  styleUrl: './table-block.css'
})
export class TableBlock {

  @Input()
  data: any = {};

  @Output()
  dataChange = new EventEmitter<any>();

  get columns(): string[] {
    return this.data.columns ?? ['Column 1', 'Column 2', 'Column 3'];
  }

  get rows(): string[][] {
    return this.data.rows ?? [['', '', '']];
  }

  updateField(field: string, value: string): void {
    this.data = {
      ...this.data,
      [field]: value
    };

    this.dataChange.emit(this.data);
  }

  updateColumn(index: number, value: string): void {
    const columns = [...this.columns];
    columns[index] = value;

    this.updateData({ columns });
  }

  updateCell(rowIndex: number, columnIndex: number, value: string): void {
    const rows = this.rows.map(row => [...row]);

    rows[rowIndex][columnIndex] = value;

    this.updateData({ rows });
  }

  addRow(): void {
    this.updateData({
      rows: [...this.rows, new Array(this.columns.length).fill('')]
    });
  }

  removeRow(index: number): void {
    this.updateData({
      rows: this.rows.filter((_, i) => i !== index)
    });
  }

  addColumn(): void {
    this.updateData({
      columns: [...this.columns, `Column ${this.columns.length + 1}`],
      rows: this.rows.map(row => [...row, ''])
    });
  }

  removeColumn(index: number): void {
    if (this.columns.length <= 1) return;

    this.updateData({
      columns: this.columns.filter((_, i) => i !== index),
      rows: this.rows.map(row =>
        row.filter((_, i) => i !== index)
      )
    });
  }

  private updateData(data: any): void {
    this.data = {
      ...this.data,
      ...data
    };

    this.dataChange.emit(this.data);
  }
}