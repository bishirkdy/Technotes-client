import { NoteContentRequest } from './note-content-request.model';

export interface NoteSectionRequest {
  title: string;
  sortOrder: number;
  children: NoteSectionRequest[];
  contents: NoteContentRequest[];
}
