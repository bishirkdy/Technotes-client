import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { NoteCard } from '../../../notes/components/note-card/note-card';
import { NoteResponse } from '../../../notes/models/note-response.model';
import { NoteApiService } from '../../../notes/services/note-api.service';

@Component({
  selector: 'app-shared-notes',
  imports: [RouterLink, EmptyState, PageHeader, NoteCard],
  templateUrl: './shared-notes.html',
  styleUrl: './shared-notes.css'
})
export class SharedNotes {
  private readonly api = inject(NoteApiService);

  notes: NoteResponse[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.api.getSharedNotes().subscribe({
      next: notes => {
        this.notes = notes;
        this.loading = false;
      },
      error: err => {
        this.error = err?.error?.detail || 'Unable to load notes shared with you.';
        this.loading = false;
      }
    });
  }
}
