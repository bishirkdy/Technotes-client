import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NoteResponse } from '../../../notes/models/note-response.model';
import { noteTextPreview } from '../../../notes/models/note-response.helpers';
import { NoteApiService } from '../../../notes/services/note-api.service';

@Component({
  selector: 'app-featured-notes',
  imports: [RouterLink],
  templateUrl: './featured-notes.html',
  styleUrl: './featured-notes.css'
})
export class FeaturedNotes {
  private readonly api = inject(NoteApiService);

  notes: NoteResponse[] = [];
  loading = true;

  ngOnInit(): void {
    this.api.getPublicNotes().subscribe({
      next: notes => {
        this.notes = notes.slice(0, 3);
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  preview(note: NoteResponse): string {
    return noteTextPreview(note) || 'Open the note to read the complete content.';
  }
}
