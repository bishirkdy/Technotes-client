import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-example-block',
  imports: [],
  templateUrl: './example-block.html',
  styleUrl: './example-block.css'
})
export class ExampleBlock {

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