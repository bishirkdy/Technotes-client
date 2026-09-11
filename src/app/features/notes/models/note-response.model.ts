import { ContentBlockModel } from './content-block.model';

export interface NoteResponse {
  id: string;
  title: string;
  status: number;
  visibility: number;
  userId: string;
  folderId: string | null;
  categoryId: string | null;
  sections: NoteSectionResponse[];
}

export interface NoteSectionResponse {
  id: string;
  title: string;
  sortOrder: number;
  children: NoteSectionResponse[];
  contents: ContentBlockModel[];
}