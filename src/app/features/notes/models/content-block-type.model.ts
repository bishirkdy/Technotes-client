export type ContentBlockType =
  | 'text'
  | 'definition'
  | 'points'
  | 'example'
  | 'code'
  | 'table'
  | 'graph'
  | 'quote';

/** Swagger exposes NoteContentType as integer enum. These values follow the documented frontend order. */
export const CONTENT_TYPE_TO_API: Record<ContentBlockType, number> = {
  text: 1,
  definition: 2,
  points: 3,
  example: 4,
  code: 5,
  table: 6,
  graph: 7,
  quote: 8
};

export const API_TYPE_TO_CONTENT: Record<number, ContentBlockType> = {
  1: 'text',
  2: 'definition',
  3: 'points',
  4: 'example',
  5: 'code',
  6: 'table',
  7: 'graph',
  8: 'quote'
};
