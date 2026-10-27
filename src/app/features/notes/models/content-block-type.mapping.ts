import { ContentBlockType } from './content-block-type.model';

// Values mirror TechNotes.Domain.Enums.NoteContentType.
export const CONTENT_TYPE_TO_API: Record<ContentBlockType, number> = {
  text: 1,
  definition: 2,
  points: 3,
  example: 5,
  table: 6,
  code: 7,
  graph: 9,
  quote: 10
};

export const API_TYPE_TO_CONTENT: Record<number, ContentBlockType> = {
  1: 'text',
  2: 'definition',
  3: 'points',
  5: 'example',
  6: 'table',
  7: 'code',
  9: 'graph',
  10: 'quote'
};

export function contentBlockLabel(type: ContentBlockType): string {
  switch (type) {
    case 'text':
      return 'Text';
    case 'definition':
      return 'Definition';
    case 'points':
      return 'Key points';
    case 'example':
      return 'Example';
    case 'code':
      return 'Code';
    case 'table':
      return 'Table';
    case 'graph':
      return 'Graph';
    case 'quote':
      return 'Quote';
  }
}
