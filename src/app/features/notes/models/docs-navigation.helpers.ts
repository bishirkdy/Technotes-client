import { NoteResponse } from './note-response.model';
import { noteTextPreview } from './note-response.helpers';
import { flattenNoteSections } from './note-section.helpers';

export interface DocsCategoryGroup {
  name: string;
  notes: NoteResponse[];
}

export interface DocsNeighbours {
  previous: NoteResponse | null;
  next: NoteResponse | null;
}

export interface SectionPosition {
  anchor: string;
  top: number;
}

export function activeSectionAnchor(
  positions: SectionPosition[],
  offset = 140
): string | null {
  if (positions.length === 0) {
    return null;
  }

  let active = positions[0].anchor;
  for (const position of positions) {
    if (position.top <= offset) {
      active = position.anchor;
    }
  }

  return active;
}

export function noteCategoryName(note: NoteResponse): string {
  return note.categoryName?.trim() || 'Documentation';
}

export function noteCategoryParentName(note: NoteResponse): string {
  return note.categoryParentName?.trim() || noteCategoryName(note);
}

export function noteMatchesCategory(note: NoteResponse, category: string): boolean {
  const target = category.trim().toLowerCase();
  if (!target) {
    return true;
  }

  return [note.categoryName, note.categoryParentName, ...(note.categoryPath ?? [])]
    .filter((value): value is string => !!value)
    .some(value => value.toLowerCase() === target);
}

export function buildDocsGroups(notes: NoteResponse[], query = ''): DocsCategoryGroup[] {
  const term = query.trim().toLowerCase();
  const groups = new Map<string, NoteResponse[]>();

  for (const note of notes) {
    const name = noteCategoryParentName(note);
    const searchable = [
      note.title,
      noteCategoryName(note),
      noteCategoryParentName(note),
      noteTextPreview(note),
      ...flattenNoteSections(note.sections ?? []).map(item => item.section.title)
    ];
    const matches = !term || searchable.some(value => value.toLowerCase().includes(term));

    if (!matches) {
      continue;
    }

    const items = groups.get(name) ?? [];
    items.push(note);
    groups.set(name, items);
  }

  return [...groups.entries()]
    .map(([name, items]) => ({
      name,
      notes: [...items].sort((left, right) => left.title.localeCompare(right.title))
    }))
    .sort((left, right) => {
      if (left.name === 'Documentation') {
        return 1;
      }
      if (right.name === 'Documentation') {
        return -1;
      }
      return left.name.localeCompare(right.name);
    });
}

export function docsNeighbours(notes: NoteResponse[], current: NoteResponse): DocsNeighbours {
  const category = noteCategoryName(current);
  const inCategory = notes.filter(note => noteCategoryName(note) === category);
  const source = (inCategory.length > 1 ? inCategory : notes)
    .slice()
    .sort((left, right) => left.title.localeCompare(right.title));

  const index = source.findIndex(note => note.id === current.id);
  return {
    previous: index > 0 ? source[index - 1] : null,
    next: index >= 0 && index < source.length - 1 ? source[index + 1] : null
  };
}
