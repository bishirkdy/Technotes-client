import { NoteSectionResponse } from './note-section-response.model';

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
