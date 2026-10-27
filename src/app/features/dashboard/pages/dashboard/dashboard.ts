import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NoteResponse } from '../../../../features/notes/models/note-response.model';
import { NoteStatus } from '../../../../features/notes/models/note-status.model';
import { NoteApiService } from '../../../../features/notes/services/note-api.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  private readonly api = inject(NoteApiService);

  notes: NoteResponse[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    this.api.getMyNotes().subscribe({
      next: notes => {
        this.notes = notes;
        this.loading = false;
      },
      error: err => {
        this.error = err?.error?.detail || 'Unable to load dashboard.';
        this.loading = false;
      }
    });
  }

  get published(): number {
    return this.notes.filter(note => note.status === NoteStatus.Published).length;
  }

  get drafts(): number {
    return this.notes.filter(note => note.status === NoteStatus.Draft).length;
  }
}
