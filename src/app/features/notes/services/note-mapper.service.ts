import { Injectable } from '@angular/core';
import { ContentBlockType } from '../models/content-block-type.model';
import { API_TYPE_TO_CONTENT, CONTENT_TYPE_TO_API } from '../models/content-block-type.mapping';
import { CreateNoteRequest } from '../models/note-create-request.model';
import { EditorContentModel } from '../models/editor-content.model';
import { NoteCreateModel } from '../models/note-create.model';
import { NoteContentRequest } from '../models/note-content-request.model';
import { NoteContentResponse } from '../models/note-content-response.model';
import { NoteResponse } from '../models/note-response.model';
import { NoteSectionModel } from '../models/note-section.model';
import { NoteSectionRequest } from '../models/note-section-request.model';
import { NoteSectionResponse } from '../models/note-section-response.model';
import { UpdateNoteRequest } from '../models/update-note-request.model';

@Injectable({ providedIn: 'root' })
export class NoteMapperService {
  private nextEditorId = 1;

  toCreateRequest(note: NoteCreateModel): CreateNoteRequest {
    return this.toWriteRequest(note);
  }

  toUpdateRequest(note: NoteCreateModel): UpdateNoteRequest {
    return this.toWriteRequest(note);
  }

  fromResponse(note: NoteResponse): NoteCreateModel {
    return {
      title: note.title,
      visibility: note.visibility,
      status: note.status,
      folderId: note.folderId,
      categoryId: note.categoryId,
      sections: (note.sections ?? []).map((section, index) => this.fromSection(section, index))
    };
  }

  private toWriteRequest(note: NoteCreateModel): CreateNoteRequest {
    return {
      title: note.title.trim(),
      visibility: note.visibility,
      status: note.status,
      folderId: note.folderId,
      categoryId: note.categoryId,
      sections: note.sections.map((section, index) => this.toSectionRequest(section, index))
    };
  }

  private fromSection(section: NoteSectionResponse, index: number): NoteSectionModel {
    return {
      id: this.nextId(),
      title: section.title,
      sortOrder: section.sortOrder ?? index,
      children: (section.children ?? []).map((child, childIndex) => this.fromSection(child, childIndex)),
      contents: (section.contents ?? []).map((content, contentIndex) => this.fromContent(content, contentIndex))
    };
  }

  private fromContent(content: NoteContentResponse, index: number): EditorContentModel {
    const type = this.resolveType(content.type);
    let data: any = {};

    if (content.data) {
      try {
        data = JSON.parse(content.data);
      } catch {
        data = { content: content.data };
      }
    }

    if (content.content && !data.content) {
      data.content = content.content;
    }

    if (content.metadata) {
      try {
        data = { ...data, ...JSON.parse(content.metadata) };
      } catch {
        data.metadata = content.metadata;
      }
    }

    return {
      id: this.nextId(),
      type,
      sortOrder: content.sortOrder ?? index,
      data
    };
  }

  private toSectionRequest(section: NoteSectionModel, index: number): NoteSectionRequest {
    return {
      title: section.title.trim(),
      sortOrder: index + 1,
      children: section.children.map((child, childIndex) => this.toSectionRequest(child, childIndex)),
      contents: [...section.contents]
        .sort((left, right) => left.sortOrder - right.sortOrder)
        .map((content, contentIndex) => this.toContentRequest(content, contentIndex))
    };
  }

  private toContentRequest(content: EditorContentModel, index: number): NoteContentRequest {
    const value = content.data ?? {};
    const payload = this.stripCommonContent(value, content.type);

    return {
      type: CONTENT_TYPE_TO_API[content.type],
      sortOrder: index + 1,
      content: content.type === 'text' ? (value.content ?? '') : (value.content ?? null),
      data: Object.keys(payload).length > 0 ? JSON.stringify(payload) : null,
      metadata: content.type === 'code' && value.language
        ? JSON.stringify({ language: value.language, filename: value.filename ?? null })
        : null
    };
  }

  private stripCommonContent(data: Record<string, any>, type: ContentBlockType): Record<string, any> {
    const value = { ...data };
    delete value['content'];

    if (type === 'code') {
      delete value['language'];
      delete value['filename'];
    }

    return value;
  }

  private resolveType(value: number | string): ContentBlockType {
    if (typeof value === 'number') {
      return API_TYPE_TO_CONTENT[value] ?? 'text';
    }

    return (value.toLowerCase() as ContentBlockType) ?? 'text';
  }

  private nextId(): number {
    return this.nextEditorId++;
  }
}
