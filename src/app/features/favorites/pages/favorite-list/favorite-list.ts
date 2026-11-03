import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { NotificationService } from '../../../../core/services/notification.service';
import { NoteResponse } from '../../../notes/models/note-response.model';
import { noteSectionCount, noteTextPreview } from '../../../notes/models/note-response.helpers';
import { NoteApiService } from '../../../notes/services/note-api.service';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-favorite-list',
  imports: [RouterLink, EmptyState, PageHeader, DatePipe],
  templateUrl: './favorite-list.html',
  styleUrl: './favorite-list.css'
})
export class FavoriteList {
  private readonly api = inject(NoteApiService);
  private readonly favorites = inject(FavoriteService);
  private readonly notifications = inject(NotificationService);

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
        this.notes = notes.filter(note => this.favorites.isFavorite(note.id));
        this.loading = false;
      },
      error: err => {
        this.error = err?.error?.detail || 'Unable to load favorites.';
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

  remove(id: string): void {
    this.favorites.toggle(id);
    this.notes = this.notes.filter(note => note.id !== id);
    this.notifications.success('Removed from favorites.');
  }
}
