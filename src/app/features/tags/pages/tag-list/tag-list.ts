import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { NoteApiService } from '../../../notes/services/note-api.service';

interface TagSummary {
  name: string;
  count: number;
}

@Component({
  selector: 'app-tag-list',
  imports: [RouterLink, EmptyState, PageHeader],
  templateUrl: './tag-list.html',
  styleUrl: './tag-list.css'
})
export class TagList {
  private readonly api = inject(NoteApiService);

  tags: TagSummary[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.error = '';
    this.api.getMyNotes().subscribe({
      next: notes => {
        const tags = new Map<string, TagSummary>();
        for (const note of notes) {
          for (const value of note.tags ?? []) {
            const name = value.trim();
            if (!name) {
              continue;
            }
            const key = name.toLowerCase();
            const current = tags.get(key);
            if (current) {
              current.count += 1;
            } else {
              tags.set(key, { name, count: 1 });
            }
          }
        }

        this.tags = [...tags.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
        this.loading = false;
      },
      error: err => {
        this.error = err?.error?.detail || 'Unable to load tags.';
        this.loading = false;
      }
    });
  }
}
