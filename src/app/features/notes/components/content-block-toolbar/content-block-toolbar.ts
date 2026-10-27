import { Component, EventEmitter, Output } from '@angular/core';
import { ContentBlockType } from '../../models/content-block-type.model';

@Component({
  selector: 'app-content-block-toolbar',
  imports: [],
  templateUrl: './content-block-toolbar.html',
  styleUrl: './content-block-toolbar.css'
})
export class ContentBlockToolbar {

  @Output()
  blockSelected = new EventEmitter<ContentBlockType>();

  isOpen = false;

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  selectBlock(type: ContentBlockType): void {
    this.blockSelected.emit(type);
    this.isOpen = false;
  }
}