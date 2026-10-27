import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NoteResponse } from '../../../../features/notes/models/note-response.model';
import { noteTextPreview } from '../../../../features/notes/models/note-response.helpers';
import { NoteApiService } from '../../../../features/notes/services/note-api.service';

@Component({
  selector: 'app-search',
  imports: [FormsModule, RouterLink],
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class Search {
  private readonly api = inject(NoteApiService);

  query = '';
  results: NoteResponse[] = [];
  loading = false;
  searched = false;
  error = '';

  search(): void {
    const query = this.query.trim();
    this.error = '';

    if (!query) {
      this.results = [];
      this.searched = false;
      return;
    }

    this.loading = true;
    this.searched = true;
    this.api.search(query).subscribe({
      next: results => {
        this.results = results;
        this.loading = false;
      },
      error: err => {
        this.error = err?.error?.detail || 'Search failed.';
        this.loading = false;
      }
    });
  }

  preview(note: NoteResponse): string {
    return noteTextPreview(note) || 'Open the note to read more.';
  }
}
