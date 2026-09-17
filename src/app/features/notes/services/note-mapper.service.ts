import { Injectable } from '@angular/core';
import { CONTENT_TYPE_TO_API, ContentBlockType } from '../models/content-block-type.model';
import { NoteCreateModel, NoteSectionRequestModel, NoteSectionModel } from '../models/note-create.model';
import { API_TYPE_TO_CONTENT } from '../models/content-block-type.model';
import { NoteResponse, NoteSectionResponse, NoteContentResponse } from '../models/note-response.model';

@Injectable({ providedIn: 'root' })
export class NoteMapperService {
  toCreateRequest(note: NoteCreateModel): Omit<NoteCreateModel, 'sections'> & { sections: NoteSectionRequestModel[] } {
    return {
      title: note.title.trim(),
      visibility: note.visibility,
      folderId: note.folderId,
      categoryId: note.categoryId,
      sections: note.sections.map((section, index) => this.mapSection(section, index))
    };
  }


  fromResponse(note: NoteResponse): NoteCreateModel & { description: string } {
    return {
      title: note.title,
      visibility: note.visibility,
      folderId: note.folderId,
      categoryId: note.categoryId,
      sections: note.sections.map((section, index) => this.fromSection(section, index)),
      description: ''
    };
  }

  private fromSection(section: NoteSectionResponse, index: number): NoteSectionModel {
    return {
      id: Date.now() + index + Math.floor(Math.random() * 10000),
      title: section.title,
      sortOrder: section.sortOrder ?? index,
      children: (section.children ?? []).map((child, childIndex) => this.fromSection(child, childIndex)),
      contents: (section.contents ?? []).map((content, contentIndex) => this.fromContent(content, contentIndex))
    };
  }

  private fromContent(content: NoteContentResponse, index: number) {
    const type = typeof content.type === 'number' ? API_TYPE_TO_CONTENT[content.type] : String(content.type).toLowerCase() as ContentBlockType;
    let data: any = {};
    if (content.data) {
      try { data = JSON.parse(content.data); } catch { data = { value: content.data }; }
    }
    if (content.content && !data.content) data.content = content.content;
    if (content.metadata && type === 'code') {
      try { data = { ...data, ...JSON.parse(content.metadata) }; } catch { /* keep raw content */ }
    }
    return { id: Date.now() + index + Math.floor(Math.random() * 10000), type, sortOrder: content.sortOrder ?? index, data };
  }

  private mapSection(section: NoteCreateModel['sections'][number], index: number): NoteSectionRequestModel {
    return {
      title: section.title.trim(),
      sortOrder: index + 1,
      children: section.children.map((child, childIndex) => this.mapSection(child, childIndex)),
      contents: [...section.contents]
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((content, contentIndex) => this.mapContent(content.type, content.data, contentIndex))
    };
  }

  private mapContent(type: ContentBlockType, data: any, index: number) {
    const value = data ?? {};
    const content = type === 'text' ? (value.content ?? '') : (value.content ?? null);
    const payload = this.stripCommonContent(value, type);

    return {
      type: CONTENT_TYPE_TO_API[type],
      sortOrder: index + 1,
      content,
      data: Object.keys(payload).length ? JSON.stringify(payload) : null,
      metadata: type === 'code' && value.language ? JSON.stringify({ language: value.language, filename: value.filename ?? null }) : null
    };
  }

  private stripCommonContent(data: any, type: ContentBlockType): any {
    const value = { ...(data ?? {}) };
    delete value.content;
    if (type === 'code') {
      delete value.language;
      delete value.filename;
    }
    return value;
  }
}
