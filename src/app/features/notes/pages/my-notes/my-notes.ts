import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NoteCard } from '../../components/note-card/note-card';
import { NoteResponse } from '../../models/note-response.model';
import { NoteStatus } from '../../models/note-status.model';
import { NoteVisibility } from '../../models/note-visibility.model';
import { NoteApiService } from '../../services/note-api.service';

@Component({
  selector: 'app-my-notes',
  imports: [RouterLink, NoteCard],
  templateUrl: './my-notes.html',
  styleUrl: './my-notes.css'
})
export class MyNotes {
  private readonly api = inject(NoteApiService);

  readonly filters = ['All', 'Published', 'Draft', 'Public', 'Shared', 'Private'];

  filter = 'All';
  notes: NoteResponse[] = [];
  loading = true;
  error = '';
  deletingId = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.api.getMyNotes().subscribe({
      next: notes => {
        this.notes = notes;
        this.loading = false;
      },
      error: err => {
        this.error = err?.error?.detail || 'Unable to load your notes.';
        this.loading = false;
      }
    });
  }

  get filteredNotes(): NoteResponse[] {
    switch (this.filter) {
      case 'Published':
        return this.notes.filter(note => note.status === NoteStatus.Published);
      case 'Draft':
        return this.notes.filter(note => note.status === NoteStatus.Draft);
      case 'Public':
        return this.notes.filter(note => note.visibility === NoteVisibility.Public);
      case 'Shared':
        return this.notes.filter(note => note.visibility === NoteVisibility.Shared);
      case 'Private':
        return this.notes.filter(note => note.visibility === NoteVisibility.Private);
      default:
        return this.notes;
    }
  }

  delete(id: string): void {
    if (!confirm('Delete this note?')) {
      return;
    }

    this.deletingId = id;
    this.api.delete(id).subscribe({
      next: () => {
        this.notes = this.notes.filter(note => note.id !== id);
        this.deletingId = '';
      },
      error: err => {
        this.error = err?.error?.detail || 'Unable to delete note.';
        this.deletingId = '';
      }
    });
  }
}
