import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { NotificationService } from '../../../../core/services/notification.service';
import { NoteCard } from '../../components/note-card/note-card';
import { NoteResponse } from '../../models/note-response.model';
import { NoteStatus } from '../../models/note-status.model';
import { NoteVisibility } from '../../models/note-visibility.model';
import { noteMatchesCategory } from '../../models/docs-navigation.helpers';
import { NoteApiService } from '../../services/note-api.service';

@Component({
  selector: 'app-my-notes',
  imports: [RouterLink, NoteCard, EmptyState, PageHeader],
  templateUrl: './my-notes.html',
  styleUrl: './my-notes.css'
})
export class MyNotes {
  private readonly api = inject(NoteApiService);
  private readonly notifications = inject(NotificationService);
  private readonly route = inject(ActivatedRoute);

  readonly filters = ['All', 'Published', 'Draft', 'Public', 'Shared', 'Private'];

  filter = 'All';
  category = '';
  tag = '';
  notes: NoteResponse[] = [];
  loading = true;
  error = '';
  deletingId = '';

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.category = params.get('category')?.trim() ?? '';
      this.tag = params.get('tag')?.trim() ?? '';
    });
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.api.getMyNotes().subscribe({
      next: notes => {
        this.notes = notes;
        this.loading = false;
      },
      error: err => {
        this.error = err?.error?.detail || 'Unable to load your notes.';
        this.loading = false;
      }
    });
  }

  get filteredNotes(): NoteResponse[] {
    const byStatus = (() => {
      switch (this.filter) {
        case 'Published':
          return this.notes.filter(note => note.status === NoteStatus.Published);
        case 'Draft':
          return this.notes.filter(note => note.status === NoteStatus.Draft);
        case 'Public':
          return this.notes.filter(note => note.visibility === NoteVisibility.Public);
        case 'Shared':
          return this.notes.filter(note => note.visibility === NoteVisibility.Shared);
        case 'Private':
          return this.notes.filter(note => note.visibility === NoteVisibility.Private);
        default:
          return this.notes;
      }
    })();

    let filtered = byStatus;

    if (this.category) {
      filtered = filtered.filter(note => noteMatchesCategory(note, this.category));
    }

    if (this.tag) {
      const target = this.tag.toLowerCase();
      filtered = filtered.filter(note => note.tags?.some(tag => tag.toLowerCase() === target));
    }

    return filtered;
  }

  clearCategory(): void {
    this.category = '';
  }

  clearTag(): void {
    this.tag = '';
  }

  delete(id: string): void {
    if (!confirm('Delete this note? This cannot be undone.')) {
      return;
    }

    this.deletingId = id;
    this.api.delete(id).subscribe({
      next: () => {
        this.notes = this.notes.filter(note => note.id !== id);
        this.deletingId = '';
        this.notifications.success('Note deleted.');
      },
      error: err => {
        this.error = err?.error?.detail || 'Unable to delete note.';
        this.deletingId = '';
      }
    });
  }
}
