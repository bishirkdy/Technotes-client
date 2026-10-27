import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NoteResponse } from '../../../notes/models/note-response.model';
import { NoteApiService } from '../../../notes/services/note-api.service';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-favorite-list',
  imports: [RouterLink],
  templateUrl: './favorite-list.html',
  styleUrl: './favorite-list.css'
})
export class FavoriteList {
  private readonly api = inject(NoteApiService);
  private readonly favorites = inject(FavoriteService);

  notes: NoteResponse[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.api.getPublicNotes().subscribe({
      next: notes => {
        this.notes = notes.filter(note => this.favorites.isFavorite(note.id));
        this.loading = false;
      },
      error: err => {
        this.error = err?.error?.detail || 'Unable to load favorites.';
        this.loading = false;
      }
    });
  }

  remove(id: string): void {
    this.favorites.toggle(id);
    this.notes = this.notes.filter(note => note.id !== id);
  }
}
