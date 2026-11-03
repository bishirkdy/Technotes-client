import { DatePipe } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { Navbar } from '../../../../shared/components/navbar/navbar';
import { Footer } from '../../../../shared/components/footer/footer';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { NotificationService } from '../../../../core/services/notification.service';
import { FavoriteService } from '../../../favorites/services/favorite.service';
import { AuthService } from '../../../auth/services/auth.service';
import { DocsSidebar } from '../../components/docs-sidebar/docs-sidebar';
import { NoteReader } from '../../components/note-reader/note-reader';
import { ReadingProgress } from '../../components/reading-progress/reading-progress';
import { NoteResponse } from '../../models/note-response.model';
import { noteSectionCount } from '../../models/note-response.helpers';
import { docsNeighbours, noteCategoryName } from '../../models/docs-navigation.helpers';
import { NoteApiService } from '../../services/note-api.service';

@Component({
  selector: 'app-note-view',
  imports: [
    RouterLink,
    Navbar,
    Footer,
    EmptyState,
    DocsSidebar,
    NoteReader,
    ReadingProgress,
    DatePipe
  ],
  templateUrl: './note-view.html',
  styleUrl: './note-view.css'
})
export class NoteView {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(NoteApiService);
  readonly auth = inject(AuthService);
  private readonly notifications = inject(NotificationService);
  private readonly destroyRef = inject(DestroyRef);
  readonly favorites = inject(FavoriteService);

  note: NoteResponse | null = null;
  notes: NoteResponse[] = [];
  loading = true;
  error = '';
  saved = signal(false);

  get canEdit(): boolean {
    return !!this.note && this.auth.isAdmin;
  }

  get sectionCount(): number {
    return this.note ? noteSectionCount(this.note) : 0;
  }

  get docsNotes(): NoteResponse[] {
    if (!this.note || this.notes.some(note => note.id === this.note?.id)) {
      return this.notes;
    }
    return [this.note, ...this.notes];
  }

  get category(): string {
    return this.note ? noteCategoryName(this.note) : 'Documentation';
  }

  get categoryParent(): string {
    return this.note?.categoryParentName?.trim() ?? '';
  }

  get categoryPath(): string {
    return this.note?.categoryPath?.join(' / ') || this.category;
  }

  get neighbours() {
    return this.note
      ? docsNeighbours(this.docsNotes, this.note)
      : { previous: null, next: null };
  }

  ngOnInit(): void {
    this.route.paramMap.pipe(
      map(params => params.get('id')),
      tap(() => {
        this.loading = true;
        this.error = '';
        this.note = null;
        this.scrollToTop();
      }),
      switchMap(id => {
        if (!id) {
          return of({ note: null as NoteResponse | null, notes: [] as NoteResponse[] });
        }

        return forkJoin({
          note: this.api.getById(id),
          notes: this.api.getPublicNotes().pipe(catchError(() => of([])))
        });
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: result => {
        this.notes = result.notes;
        this.note = result.note;

        if (!result.note) {
          this.error = 'Note ID is missing.';
          this.loading = false;
          return;
        }

        this.saved.set(this.favorites.isFavorite(result.note.id));
        this.loading = false;
      },
      error: err => {
        this.error = err?.error?.detail || 'Unable to load note.';
        this.loading = false;
      }
    });
  }

  toggleFavorite(): void {
    if (!this.note) {
      return;
    }
    this.saved.set(this.favorites.toggle(this.note.id));
    this.notifications.success(this.saved() ? 'Saved to your favorites.' : 'Removed from favorites.');
  }

  copyLink(): void {
    if (typeof location === 'undefined') {
      return;
    }
    void navigator.clipboard?.writeText(location.href).then(
      () => this.notifications.success('Note link copied.'),
      () => this.notifications.error('Could not copy the link.')
    );
  }

  private scrollToTop(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }
}
