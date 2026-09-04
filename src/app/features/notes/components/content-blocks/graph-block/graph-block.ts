import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-graph-block',
  imports: [],
  templateUrl: './graph-block.html',
  styleUrl: './graph-block.css'
})
export class GraphBlock {
  @Input() data: any = {};
  @Output() dataChange = new EventEmitter<any>();

  get rows(): { label: string; value: number }[] { return this.data.rows ?? []; }

  updateField(field: string, value: string): void {
    this.data = { ...this.data, [field]: value };
    this.dataChange.emit(this.data);
  }

  addRow(): void { this.updateRows([...this.rows, { label: '', value: 0 }]); }
  removeRow(index: number): void { this.updateRows(this.rows.filter((_, i) => i !== index)); }

  updateRow(index: number, field: 'label' | 'value', value: string): void {
    const rows = this.rows.map(row => ({ ...row }));
    if (field === 'value') rows[index].value = Number(value);
    else rows[index].label = value;
    this.updateRows(rows);
  }

  private updateRows(rows: { label: string; value: number }[]): void {
    this.data = { ...this.data, rows };
    this.dataChange.emit(this.data);
  }
}
