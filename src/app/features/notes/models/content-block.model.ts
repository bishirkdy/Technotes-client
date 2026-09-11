import { ContentBlockType } from './content-block-type.model';

export interface ContentBlockModel {
  type: ContentBlockType;
  sortOrder: number;
  content: string | null;
  data: string | null;
  metadata: string | null;
}