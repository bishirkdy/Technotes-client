import { NoteSectionResponse } from './note-section-response.model';

export interface NoteResponse {
  id: string;
  title: string;
  status: number;
  visibility: number;
  userId: string;
  folderId: string | null;
  categoryId: string | null;
  categoryName?: string | null;
  categoryParentName?: string | null;
  categoryPath?: string[];
  tags?: string[];
  createdAtUtc?: string;
  updatedAtUtc?: string;
  readingProgress?: {
    percent: number;
    lastReadAtUtc: string;
  } | null;
  sections: NoteSectionResponse[];
}
