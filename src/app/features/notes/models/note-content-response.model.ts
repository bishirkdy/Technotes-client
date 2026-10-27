export interface NoteContentResponse {
  id: string;
  type: number | string;
  sortOrder: number;
  content: string | null;
  data: string | null;
  metadata: string | null;
}
