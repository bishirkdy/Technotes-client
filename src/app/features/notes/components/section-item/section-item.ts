import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-section-item',
  imports: [],
  templateUrl: './section-item.html',
  styleUrl: './section-item.css'
})
export class SectionItem {

  @Input()
  title = '';

  @Input()
  level = 0;

  @Output()
  addChild = new EventEmitter<void>();

  @Output()
  delete = new EventEmitter<void>();

  @Output()
  rename = new EventEmitter<string>();

  isEditing = false;

  startEditing(): void {
    this.isEditing = true;
  }

  finishEditing(value: string): void {
    this.rename.emit(value);
    this.isEditing = false;
  }
}