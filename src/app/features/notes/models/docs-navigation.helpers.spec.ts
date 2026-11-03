import { NoteResponse } from './note-response.model';
import { NoteSectionResponse } from './note-section-response.model';
import {
  activeSectionAnchor,
  buildDocsGroups,
  docsNeighbours,
  noteCategoryName
} from './docs-navigation.helpers';

function note(id: string, title: string, categoryName: string | null): NoteResponse {
  return {
    id,
    title,
    categoryName,
    status: 2,
    visibility: 1,
    userId: 'user-1',
    folderId: null,
    categoryId: null,
    sections: []
  };
}

function section(id: string, title: string): NoteSectionResponse {
  return {
    id,
    title,
    sortOrder: 1,
    children: [],
    contents: []
  };
}

describe('docs navigation helpers', () => {
  const notes = [
    note('sql-2', 'Queries', 'SQL'),
    note('csharp-1', 'Getting started', 'C#'),
    note('sql-1', 'Joins', 'SQL'),
    note('misc', 'Appendix', null)
  ];

  it('groups notes by category and sorts notes by title', () => {
    const groups = buildDocsGroups(notes);

    expect(groups.map(group => group.name)).toEqual(['C#', 'SQL', 'Documentation']);
    expect(groups[1].notes.map(item => item.title)).toEqual(['Joins', 'Queries']);
  });

  it('filters groups by title, category, content preview, or section title', () => {
    expect(buildDocsGroups(notes, 'joins')[0].notes[0].id).toBe('sql-1');
    expect(buildDocsGroups(notes, 'c#')[0].name).toBe('C#');

    const js = note('js-1', 'Event loop', 'JavaScript');
    js.sections = [section('s-1', 'Promises')];

    expect(buildDocsGroups([js], 'promises')[0].notes[0].id).toBe('js-1');
  });

  it('finds adjacent notes within the same category', () => {
    const neighbours = docsNeighbours(notes, notes[0]);

    expect(neighbours.previous?.id).toBe('sql-1');
    expect(neighbours.next).toBeNull();
  });

  it('falls back to the Documentation category', () => {
    expect(noteCategoryName(note('untitled', 'Untitled', null))).toBe('Documentation');
  });

  it('selects the last section above the scroll offset', () => {
    const positions = [
      { anchor: 'section-intro', top: -420 },
      { anchor: 'section-clr', top: 40 },
      { anchor: 'section-cli', top: 260 }
    ];

    expect(activeSectionAnchor(positions, 140)).toBe('section-clr');
  });

  it('falls back to the first section before any section reaches the offset', () => {
    expect(activeSectionAnchor([{ anchor: 'section-intro', top: 220 }], 140))
      .toBe('section-intro');
    expect(activeSectionAnchor([])).toBeNull();
  });
});
