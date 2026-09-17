import { Component, inject } from '@angular/core';
import { NoteApiService } from '../../services/note-api.service';
import { NoteResponse } from '../../models/note-response.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-notes',
  imports: [RouterLink],
  templateUrl: './my-notes.html',
  styleUrl: './my-notes.css',
})
export class MyNotes {
  private readonly api = inject(NoteApiService);
  filter = 'All';
  notes: NoteResponse[] = [];
  loading = true;
  error = '';
  deletingId = '';
  ngOnInit() {
    this.load();
  }
  load() {
    this.loading = true;
    this.api.getMyNotes().subscribe({
      next: (n) => {
        this.notes = n;
        this.loading = false;
      },
      error: (e) => {
        this.error = e?.error?.detail || 'Unable to load your notes.';
        this.loading = false;
      },
    });
  }
  get filteredNotes() {
    return this.notes.filter(
      (n) =>
        this.filter === 'All' ||
        (this.filter === 'Published' && n.status === 2) ||
        (this.filter === 'Draft' && n.status === 1) ||
        (this.filter === 'Public' && n.visibility === 1) ||
        (this.filter === 'Shared' && n.visibility === 2) ||
        (this.filter === 'Private' && n.visibility === 3),
    );
  }
  status(v: number) {
    return v === 2 ? 'Published' : 'Draft';
  }
  visibility(v: number) {
    return v === 1 ? 'Public' : v === 2 ? 'Shared' : 'Private';
  }
  preview(n: NoteResponse) {
    return this.firstText(n.sections) || 'No text preview available.';
  }
  delete(id: string) {
    if (!confirm('Delete this note?')) return;
    this.deletingId = id;
    this.api.delete(id).subscribe({
      next: () => {
        this.notes = this.notes.filter((n) => n.id !== id);
        this.deletingId = '';
      },
      error: (e) => {
        this.error = e?.error?.detail || 'Unable to delete note.';
        this.deletingId = '';
      },
    });
  }
  private firstText(sections: any[]): string {
    for (const s of sections ?? []) {
      for (const c of s.contents ?? []) {
        if (c.content) return c.content;
      }
      const x = this.firstText(s.children);
      if (x) return x;
    }
    return '';
  }
}
