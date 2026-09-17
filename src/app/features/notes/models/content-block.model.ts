import { ContentBlockType } from './content-block-type.model';

/** Editor-side model. Backend-specific fields are produced by NoteMapperService. */
export interface ContentBlockModel {
  id: number;
  type: ContentBlockType;
  sortOrder: number;
  data: any;
}
