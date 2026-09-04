import { ContentBlockModel } from './content-block.model';

export interface NoteCreateModel {
  title: string;
  description: string;
  tags: string[];
  visibility: 'private' | 'shared' | 'public';
  sections: NoteSectionModel[];
}

export interface NoteSectionModel {
  id: number;
  title: string;
  contentBlocks: ContentBlockModel[];
  children: NoteSectionModel[];
}