import { ContentBlockType } from './content-block-type.model';

export interface ContentBlockModel {
  id: number;
  type: ContentBlockType;
  sortOrder: number;
  data: any;
}
