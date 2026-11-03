import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { AuthService } from '../../../auth/services/auth.service';
import { FavoriteService } from '../../../favorites/services/favorite.service';
import { NoteResponse } from '../../../notes/models/note-response.model';
import { noteSectionCount } from '../../../notes/models/note-response.helpers';
import { NoteStatus } from '../../../notes/models/note-status.model';
import { NoteVisibility } from '../../../notes/models/note-visibility.model';
import { NoteApiService } from '../../../notes/services/note-api.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink, DatePipe, EmptyState, PageHeader],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {
  private readonly api = inject(NoteApiService);
  readonly auth = inject(AuthService);
  private readonly favorites = inject(FavoriteService);

  notes: NoteResponse[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    this.load();
  }

  get isAdmin(): boolean {
    return this.auth.isAdmin;
  }

  get description(): string {
    return this.isAdmin
      ? 'A live overview of the notes you publish.'
      : 'Pick up where you left off.';
  }

  load(): void {
    this.loading = true;
    this.error = '';

    const request = this.isAdmin ? this.api.getMyNotes() : this.api.getPublicNotes();
    request.subscribe({
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

  get publicNotes(): number {
    return this.notes.filter(note => note.visibility === NoteVisibility.Public).length;
  }

  get reading(): number {
    return this.notes.filter(note => {
      const percent = note.readingProgress?.percent ?? 0;
      return percent > 0 && percent < 100;
    }).length;
  }

  get finished(): number {
    return this.notes.filter(note => note.readingProgress?.percent === 100).length;
  }

  get savedCount(): number {
    return this.favorites.all().length;
  }

  get recentNotes(): NoteResponse[] {
    return [...this.notes]
      .sort((a, b) => this.timestamp(b) - this.timestamp(a))
      .slice(0, 5);
  }

  get categories(): Array<{ name: string; count: number }> {
    const counts = new Map<string, number>();
    for (const note of this.notes) {
      const name = note.categoryName?.trim() || 'Uncategorized';
      counts.set(name, (counts.get(name) ?? 0) + 1);
    }
    return [...counts.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  sectionCount(note: NoteResponse): number {
    return noteSectionCount(note);
  }

  date(note: NoteResponse): string | null {
    return this.isAdmin
      ? note.updatedAtUtc || note.createdAtUtc || null
      : note.readingProgress?.lastReadAtUtc || note.createdAtUtc || null;
  }

  progress(note: NoteResponse): number {
    return note.readingProgress?.percent ?? 0;
  }

  private timestamp(note: NoteResponse): number {
    const value = this.date(note);
    return value ? new Date(value).getTime() : 0;
  }
}
