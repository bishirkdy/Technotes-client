import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-quote-block',
  imports: [],
  templateUrl: './quote-block.html',
  styleUrl: './quote-block.css'
})
export class QuoteBlock {

  @Input()
  data: any = {};

  @Output()
  dataChange = new EventEmitter<any>();

  updateField(field: string, value: string): void {
    this.data = {
      ...this.data,
      [field]: value
    };

    this.dataChange.emit(this.data);
  }
}