import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-text-block',
  imports: [],
  templateUrl: './text-block.html',
  styleUrl: './text-block.css'
})
export class TextBlock {

  @Input()
  data: any = {};

  @Output()
  dataChange = new EventEmitter<any>();

  updateContent(value: string): void {
    this.data = {
      ...this.data,
      content: value
    };

    this.dataChange.emit(this.data);
  }
}