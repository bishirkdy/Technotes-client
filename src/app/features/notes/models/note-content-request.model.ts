export interface NoteContentRequest {
  type: number;
  sortOrder: number;
  content: string | null;
  data: string | null;
  metadata: string | null;
}
