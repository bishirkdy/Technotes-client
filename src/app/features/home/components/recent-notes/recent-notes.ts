import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NoteResponse } from '../../../notes/models/note-response.model';
import { noteTextPreview } from '../../../notes/models/note-response.helpers';
import { NoteApiService } from '../../../notes/services/note-api.service';

@Component({
  selector: 'app-recent-notes',
  imports: [RouterLink],
  templateUrl: './recent-notes.html',
  styleUrl: './recent-notes.css'
})
export class RecentNotes {
  private readonly api = inject(NoteApiService);

  notes: NoteResponse[] = [];
  loading = true;

  ngOnInit(): void {
    this.api.getPublicNotes().subscribe({
      next: notes => {
        this.notes = notes.slice(0, 5);
        this.loading = false;
      },
      error: () => {
        this.notes = [];
        this.loading = false;
      }
    });
  }

  preview(note: NoteResponse): string {
    return noteTextPreview(note) || 'Recently published note.';
  }
}
