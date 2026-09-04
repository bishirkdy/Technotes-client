import { Component } from '@angular/core';

import { ContentBlockToolbar } from '../content-block-toolbar/content-block-toolbar';

import { TextBlock } from '../content-blocks/text-block/text-block';
import { DefinitionBlock } from '../content-blocks/definition-block/definition-block';
import { PointsBlock } from '../content-blocks/points-block/points-block';
import { ExampleBlock } from '../content-blocks/example-block/example-block';
import { CodeBlock } from '../content-blocks/code-block/code-block';
import { TableBlock } from '../content-blocks/table-block/table-block';
import { GraphBlock } from '../content-blocks/graph-block/graph-block';
import { QuoteBlock } from '../content-blocks/quote-block/quote-block';

import { ContentBlockModel } from '../../models/content-block.model';

@Component({
  selector: 'app-content-block',
  imports: [
    ContentBlockToolbar,
    TextBlock,
    DefinitionBlock,
    PointsBlock,
    ExampleBlock,
    CodeBlock,
    TableBlock,
    GraphBlock,
    QuoteBlock,
  ],
  templateUrl: './content-block.html',
  styleUrl: './content-block.css',
})
export class ContentBlock {
  blocks: ContentBlockModel[] = [];

  getBlocks(): ContentBlockModel[] {
    return this.blocks;
  }

  private nextId = 1;

  addBlock(type: ContentBlockModel['type']): void {
    this.blocks.push({
      id: this.nextId++,
      type,
      data: {},
    });
  }

  removeBlock(id: number): void {
    this.blocks = this.blocks.filter((block) => block.id !== id);
  }

  moveUp(index: number): void {
    if (index === 0) return;

    [this.blocks[index - 1], this.blocks[index]] = [this.blocks[index], this.blocks[index - 1]];
  }

  moveDown(index: number): void {
    if (index === this.blocks.length - 1) return;

    [this.blocks[index], this.blocks[index + 1]] = [this.blocks[index + 1], this.blocks[index]];
  }
}
