import { NoteSectionModel } from './note-section.model';

export interface NoteCreateModel {
  title: string;
  visibility: number;
  status: number;
  folderId: string | null;
  categoryId: string | null;
  tags: string[];
  sections: NoteSectionModel[];
}
