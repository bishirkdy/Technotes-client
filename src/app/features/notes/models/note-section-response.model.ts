import { NoteContentResponse } from './note-content-response.model';

export interface NoteSectionResponse {
  id: string;
  title: string;
  sortOrder: number;
  children: NoteSectionResponse[];
  contents: NoteContentResponse[];
}
