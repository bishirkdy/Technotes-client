import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { NoteResponse } from '../../../notes/models/note-response.model';
import { noteSectionCount, noteTextPreview } from '../../../notes/models/note-response.helpers';
import { NoteApiService } from '../../../notes/services/note-api.service';

@Component({
  selector: 'app-recent-notes',
  imports: [RouterLink, DatePipe, EmptyState],
  templateUrl: './recent-notes.html',
  styleUrl: './recent-notes.css'
})
export class RecentNotes {
  private readonly api = inject(NoteApiService);

  notes: NoteResponse[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    this.api.getPublicNotes().subscribe({
      next: notes => {
        this.notes = [...notes]
          .sort((a, b) => this.timestamp(b) - this.timestamp(a))
          .slice(0, 5);
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load recent notes.';
        this.loading = false;
      }
    });
  }

  preview(note: NoteResponse): string {
    return noteTextPreview(note) || 'Open the note to read its content.';
  }

  sectionCount(note: NoteResponse): number {
    return noteSectionCount(note);
  }

  date(note: NoteResponse): string | null {
    return note.updatedAtUtc || note.createdAtUtc || null;
  }

  private timestamp(note: NoteResponse): number {
    const value = note.updatedAtUtc || note.createdAtUtc;
    return value ? new Date(value).getTime() : 0;
  }
}
