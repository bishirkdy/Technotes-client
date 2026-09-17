import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContentBlockToolbar } from '../content-block-toolbar/content-block-toolbar';
import { TextBlock } from '../content-blocks/text-block/text-block';
import { DefinitionBlock } from '../content-blocks/definition-block/definition-block';
import { PointsBlock } from '../content-blocks/points-block/points-block';
import { ExampleBlock } from '../content-blocks/example-block/example-block';
import { CodeBlock } from '../content-blocks/code-block/code-block';
import { TableBlock } from '../content-blocks/table-block/table-block';
import { GraphBlock } from '../content-blocks/graph-block/graph-block';
import { QuoteBlock } from '../content-blocks/quote-block/quote-block';
import { ContentBlockModel, } from '../../models/content-block.model';
import { ContentBlockType } from '../../models/content-block-type.model';

@Component({
  selector: 'app-content-block',
  imports: [ContentBlockToolbar, TextBlock, DefinitionBlock, PointsBlock, ExampleBlock, CodeBlock, TableBlock, GraphBlock, QuoteBlock],
  templateUrl: './content-block.html',
  styleUrl: './content-block.css',
})
export class ContentBlock {
  @Input() blocks: ContentBlockModel[] = [];
  @Output() blocksChange = new EventEmitter<ContentBlockModel[]>();
  private nextId = 1;

  addBlock(type: ContentBlockType): void {
    const block: ContentBlockModel = {
      id: Date.now() + this.nextId++,
      type,
      sortOrder: this.blocks.length,
      data: this.defaultData(type)
    };
    this.blocks = [...this.blocks, block];
    this.emit();
  }

  updateBlock(block: ContentBlockModel, data: any): void {
    block.data = data;
    this.emit();
  }

  removeBlock(id: number): void {
    this.blocks = this.blocks.filter(block => block.id !== id);
    this.normalize();
  }

  moveUp(index: number): void {
    if (index === 0) return;
    [this.blocks[index - 1], this.blocks[index]] = [this.blocks[index], this.blocks[index - 1]];
    this.normalize();
  }

  moveDown(index: number): void {
    if (index >= this.blocks.length - 1) return;
    [this.blocks[index], this.blocks[index + 1]] = [this.blocks[index + 1], this.blocks[index]];
    this.normalize();
  }

  private normalize(): void {
    this.blocks = this.blocks.map((block, index) => ({ ...block, sortOrder: index }));
    this.emit();
  }

  private emit(): void { this.blocksChange.emit([...this.blocks]); }

  private defaultData(type: ContentBlockType): any {
    switch (type) {
      case 'text': return { content: '' };
      case 'definition': return { term: '', definition: '', example: '' };
      case 'points': return { points: [''] };
      case 'example': return { title: '', description: '', code: '', result: '' };
      case 'code': return { language: 'csharp', filename: '', code: '', showLineNumbers: true, wrapCode: false };
      case 'table': return { title: '', description: '', columns: ['Column 1', 'Column 2'], rows: [['', '']] };
      case 'graph': return { title: '', graphType: 'bar', rows: [] };
      case 'quote': return { quote: '', author: '', source: '' };
    }
  }
}
