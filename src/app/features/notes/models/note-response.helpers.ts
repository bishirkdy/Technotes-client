import { NoteResponse } from './note-response.model';
import { NoteSectionResponse } from './note-section-response.model';

export function noteTextPreview(note: NoteResponse): string {
  const visit = (sections: NoteResponse['sections']): string => {
    for (const section of sections ?? []) {
      for (const content of section.contents ?? []) {
        if (content.content) {
          return content.content;
        }
      }

      const nested = visit(section.children ?? []);
      if (nested) {
        return nested;
      }
    }

    return '';
  };

  return visit(note.sections);
}

function countSections(sections: NoteSectionResponse[]): number {
  return sections.reduce(
    (total, section) => total + 1 + countSections(section.children ?? []),
    0
  );
}

export function noteSectionCount(note: NoteResponse): number {
  return countSections(note.sections ?? []);
}
