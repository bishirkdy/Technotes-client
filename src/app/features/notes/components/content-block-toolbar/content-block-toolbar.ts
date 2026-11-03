import { Component, EventEmitter, Output } from '@angular/core';
import { ContentBlockType } from '../../models/content-block-type.model';

interface BlockOption {
  type: ContentBlockType;
  label: string;
  description: string;
  glyph: string;
}

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

  readonly options: BlockOption[] = [
    { type: 'text', label: 'Text', description: 'Write normal content', glyph: 'T' },
    { type: 'definition', label: 'Definition', description: 'Explain a concept', glyph: 'D' },
    { type: 'points', label: 'Key points', description: 'Create an important list', glyph: '•' },
    { type: 'example', label: 'Example', description: 'Add a practical example', glyph: 'E' },
    { type: 'code', label: 'Code', description: 'Add a code snippet', glyph: '{}' },
    { type: 'table', label: 'Table', description: 'Create structured data', glyph: '▦' },
    { type: 'image', label: 'Image', description: 'Upload from Cloudinary', glyph: '▧' },
    { type: 'graph', label: 'Graph', description: 'Visualize information', glyph: '◇' },
    { type: 'quote', label: 'Quote', description: 'Highlight important text', glyph: '“' }
  ];

  toggleMenu(): void {
    this.isOpen = !this.isOpen;
  }

  selectBlock(type: ContentBlockType): void {
    this.blockSelected.emit(type);
    this.isOpen = false;
  }
}
