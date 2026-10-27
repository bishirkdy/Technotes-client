import { EditorContentModel } from './editor-content.model';

export interface NoteSectionModel {
  id: number;
  title: string;
  sortOrder: number;
  children: NoteSectionModel[];
  contents: EditorContentModel[];
}
