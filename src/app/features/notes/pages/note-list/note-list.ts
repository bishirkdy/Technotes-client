import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NoteCard } from '../../components/note-card/note-card';
import { NoteResponse } from '../../models/note-response.model';
import { NoteApiService } from '../../services/note-api.service';

@Component({
  selector: 'app-note-list',
  imports: [RouterLink, FormsModule, NoteCard],
  templateUrl: './note-list.html',
  styleUrl: './note-list.css'
})
export class NoteList {
  private readonly api = inject(NoteApiService);

  query = '';
  notes: NoteResponse[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.api.getPublicNotes().subscribe({
      next: notes => {
        this.notes = notes;
        this.loading = false;
      },
      error: () => {
        this.error = 'Unable to load public notes.';
        this.loading = false;
      }
    });
  }

  get filteredNotes(): NoteResponse[] {
    const query = this.query.trim().toLowerCase();
    return query
      ? this.notes.filter(note => note.title.toLowerCase().includes(query))
      : this.notes;
  }
}
