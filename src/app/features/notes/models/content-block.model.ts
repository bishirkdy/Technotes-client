export type ContentBlockType =
  | 'text'
  | 'definition'
  | 'points'
  | 'example'
  | 'code'
  | 'table'
  | 'graph'
  | 'quote';

export interface ContentBlockModel {
  id: number;
  type: ContentBlockType;
  data: any;
}