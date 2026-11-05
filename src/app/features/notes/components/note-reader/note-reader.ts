import { Component, Input, signal } from '@angular/core';
import { CodeExample } from '../code-example/code-example';
import { CodePlayground } from '../code-playground/code-playground';
import { ExecutionRunner } from '../execution-runner/execution-runner';
import { ImageLightbox, LightboxImage } from '../image-lightbox/image-lightbox';
import {
  CodeExampleSource,
  SqlDialect,
  isPreviewLanguage,
  normalizeCodeLanguage,
  normalizeSqlDialect
} from '../../models/code-example.model';
import { ContentBlockType } from '../../models/content-block-type.model';
import { API_TYPE_TO_CONTENT } from '../../models/content-block-type.mapping';
import { NoteContentResponse } from '../../models/note-content-response.model';
import { NoteSectionResponse } from '../../models/note-section-response.model';
import { FlatNoteSection, flattenNoteSections } from '../../models/note-section.helpers';

@Component({
  selector: 'app-note-reader',
  imports: [CodeExample, CodePlayground, ExecutionRunner, ImageLightbox],
  templateUrl: './note-reader.html',
  styleUrl: './note-reader.css'
})
export class NoteReader {
  @Input() sections: NoteSectionResponse[] = [];

  readonly playground = signal<CodeExampleSource | null>(null);
  readonly runner = signal<CodeExampleSource | null>(null);
  readonly lightboxImage = signal<LightboxImage | null>(null);

  flattenSections(sections: NoteSectionResponse[]): FlatNoteSection[] {
    return flattenNoteSections(sections);
  }

  typeOf(content: NoteContentResponse): ContentBlockType | string {
    return typeof content.type === 'number'
      ? (API_TYPE_TO_CONTENT[content.type] ?? `Type ${content.type}`)
      : String(content.type).toLowerCase();
  }

  dataOf(content: NoteContentResponse): any {
    let data: Record<string, any> = {};

    if (content.data) {
      try {
        const parsed = JSON.parse(content.data);
        data = parsed && typeof parsed === 'object' ? parsed : { value: parsed };
      } catch {
        data = { value: content.data };
      }
    }

    if (content.metadata) {
      try {
        const metadata = JSON.parse(content.metadata);
        if (metadata && typeof metadata === 'object') {
          data = { ...data, ...metadata };
        }
      } catch {
        data['metadata'] = content.metadata;
      }
    }

    if (content.content && data['content'] == null) {
      data['content'] = content.content;
    }

    return data;
  }

  codeOf(content: NoteContentResponse): string {
    const data = this.dataOf(content);
    return data.code ?? data.content ?? '';
  }

  languageOf(content: NoteContentResponse): string {
    return this.dataOf(content).language ?? 'plaintext';
  }

  filenameOf(content: NoteContentResponse): string | null {
    return this.dataOf(content).filename ?? null;
  }

  dialectOf(content: NoteContentResponse): SqlDialect | null {
    const data = this.dataOf(content);
    return data.dialect ? normalizeSqlDialect(data.dialect) : null;
  }

  runnableOf(content: NoteContentResponse): boolean {
    return this.dataOf(content).runnable !== false;
  }

  expectedOutputOf(content: NoteContentResponse): string | null {
    const data = this.dataOf(content);
    return data.expectedOutput ?? data.result ?? data.output ?? null;
  }

  showLineNumbers(content: NoteContentResponse): boolean {
    return this.dataOf(content).showLineNumbers !== false;
  }

  wrapCode(content: NoteContentResponse): boolean {
    return this.dataOf(content).wrapCode === true;
  }

  openExample(source: CodeExampleSource): void {
    if (isPreviewLanguage(normalizeCodeLanguage(source.language))) {
      this.playground.set(source);
      return;
    }

    this.runner.set(source);
  }

  closePlayground(): void {
    this.playground.set(null);
  }

  closeRunner(): void {
    this.runner.set(null);
  }

  openImage(content: NoteContentResponse): void {
    const data = this.dataOf(content);
    if (!data.url) {
      return;
    }

    this.lightboxImage.set({
      url: data.url,
      alt: data.alt || 'Note image',
      caption: data.caption || undefined
    });
  }

  closeImage(): void {
    this.lightboxImage.set(null);
  }

  graphWidth(value: number): number {
    return Math.min(Math.max(Number(value) * 5, 4), 100);
  }
}
