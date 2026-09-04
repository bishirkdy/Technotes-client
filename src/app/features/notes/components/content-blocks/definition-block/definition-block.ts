import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-definition-block',
  imports: [],
  templateUrl: './definition-block.html',
  styleUrl: './definition-block.css'
})
export class DefinitionBlock {

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