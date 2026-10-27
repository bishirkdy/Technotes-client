// Mirrors TechNotes.Domain.Enums.NoteVisibility.
export enum NoteVisibility {
  Private = 1,
  Shared = 2,
  Public = 3
}

export function noteVisibilityLabel(visibility: number): string {
  switch (visibility) {
    case NoteVisibility.Private:
      return 'Private';
    case NoteVisibility.Shared:
      return 'Shared';
    case NoteVisibility.Public:
      return 'Public';
    default:
      return 'Unknown';
  }
}
