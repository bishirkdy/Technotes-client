import { NoteSectionRequest } from './note-section-request.model';

export interface UpdateNoteRequest {
  title: string;
  visibility: number;
  status: number;
  folderId: string | null;
  categoryId: string | null;
  tags: string[];
  sections: NoteSectionRequest[];
}
