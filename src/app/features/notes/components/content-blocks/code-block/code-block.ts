import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-code-block',
  imports: [],
  templateUrl: './code-block.html',
  styleUrl: './code-block.css'
})
export class CodeBlock {

  @Input()
  data: any = {};

  @Output()
  dataChange = new EventEmitter<any>();

  updateField(field: string, value: string | boolean): void {
    this.data = {
      ...this.data,
      [field]: value
    };

    this.dataChange.emit(this.data);
  }
}