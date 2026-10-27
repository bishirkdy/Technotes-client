// Mirrors TechNotes.Domain.Enums.NoteStatus.
export enum NoteStatus {
  Draft = 1,
  Published = 2,
  Archived = 3
}

export function noteStatusLabel(status: number): string {
  switch (status) {
    case NoteStatus.Draft:
      return 'Draft';
    case NoteStatus.Published:
      return 'Published';
    case NoteStatus.Archived:
      return 'Archived';
    default:
      return 'Unknown';
  }
}
