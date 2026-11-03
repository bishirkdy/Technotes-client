import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { NoteResponse } from '../../../notes/models/note-response.model';
import { NoteApiService } from '../../../notes/services/note-api.service';

interface ActivityEntry {
  id: string;
  noteId: string;
  label: string;
  title: string;
  timestamp: string;
}

@Component({
  selector: 'app-activity',
  imports: [RouterLink, DatePipe, EmptyState, PageHeader],
  templateUrl: './activity.html',
  styleUrl: './activity.css'
})
export class Activity {
  private readonly api = inject(NoteApiService);

  entries: ActivityEntry[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.api.getMyNotes().subscribe({
      next: notes => {
        this.entries = this.buildEntries(notes);
        this.loading = false;
      },
      error: err => {
        this.error = err?.error?.detail || 'Unable to load activity.';
        this.loading = false;
      }
    });
  }

  private buildEntries(notes: NoteResponse[]): ActivityEntry[] {
    const entries: ActivityEntry[] = [];

    for (const note of notes) {
      if (note.createdAtUtc) {
        entries.push({
          id: `${note.id}-created`,
          noteId: note.id,
          label: 'Note created',
          title: note.title,
          timestamp: note.createdAtUtc
        });
      }

      if (note.updatedAtUtc && note.updatedAtUtc !== note.createdAtUtc) {
        entries.push({
          id: `${note.id}-updated`,
          noteId: note.id,
          label: 'Note updated',
          title: note.title,
          timestamp: note.updatedAtUtc
        });
      }
    }

    return entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }
}
