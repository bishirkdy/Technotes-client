import { ContentBlockType } from './content-block-type.model';

export interface NoteCreateModel {
  title: string;
  visibility: number;
  folderId: string | null;
  categoryId: string | null;
  sections: NoteSectionModel[];
}

export interface NoteSectionModel {
  id: number;
  title: string;
  sortOrder: number;
  children: NoteSectionModel[];
  contents: EditorContentModel[];
}

export interface EditorContentModel {
  id: number;
  type: ContentBlockType;
  sortOrder: number;
  data: any;
}

export interface NoteContentRequestModel {
  type: number;
  sortOrder: number;
  content: string | null;
  data: string | null;
  metadata: string | null;
}

export interface NoteSectionRequestModel {
  title: string;
  sortOrder: number;
  children: NoteSectionRequestModel[];
  contents: NoteContentRequestModel[];
}
