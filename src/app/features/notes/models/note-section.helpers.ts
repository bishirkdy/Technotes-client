import { NoteSectionResponse } from './note-section-response.model';

export interface FlatNoteSection {
  section: NoteSectionResponse;
  level: number;
  number: string;
  anchor: string;
  ancestorIds: string[];
}

export function noteSectionAnchor(id: string): string {
  return `section-${id}`;
}

export function flattenNoteSections(
  sections: NoteSectionResponse[],
  level = 0,
  prefix = '',
  ancestorIds: string[] = []
): FlatNoteSection[] {
  return sections.flatMap((section, index) => {
    const number = prefix ? `${prefix}.${index + 1}` : `${index + 1}`;
    return [
      {
        section,
        level,
        number,
        anchor: noteSectionAnchor(section.id),
        ancestorIds
      },
      ...flattenNoteSections(
        section.children ?? [],
        level + 1,
        number,
        [...ancestorIds, section.id]
      )
    ];
  });
}
