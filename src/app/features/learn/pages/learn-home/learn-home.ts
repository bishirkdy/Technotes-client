import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Navbar } from '../../../../shared/components/navbar/navbar';
import { Footer } from '../../../../shared/components/footer/footer';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { DocsSidebar } from '../../../notes/components/docs-sidebar/docs-sidebar';
import { NoteResponse } from '../../../notes/models/note-response.model';
import { NoteApiService } from '../../../notes/services/note-api.service';

interface ReadingTrack {
  name: string;
  count: number;
  latest: string | null;
}

@Component({
  selector: 'app-learn-home',
  imports: [RouterLink, Navbar, Footer, EmptyState, PageHeader, DocsSidebar],
  templateUrl: './learn-home.html',
  styleUrl: './learn-home.css',
})
export class LearnHome {
  private readonly api = inject(NoteApiService);

  tracks: ReadingTrack[] = [];
  docsNotes: NoteResponse[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    this.api.getPublicNotes().subscribe({
      next: notes => {
        const tracks = new Map<string, ReadingTrack>();
        this.docsNotes = notes;

        for (const note of notes) {
          const name = note.categoryName?.trim() || 'Uncategorized';
          const date = note.updatedAtUtc || note.createdAtUtc || null;
          const current = tracks.get(name);

          if (current) {
            current.count += 1;
            if (date && (!current.latest || new Date(date) > new Date(current.latest))) {
              current.latest = date;
            }
          } else {
            tracks.set(name, { name, count: 1, latest: date });
          }
        }

        this.tracks = [...tracks.values()].sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
        this.loading = false;
      },
      error: () => {
        this.error = 'The reading room is temporarily unavailable.';
        this.loading = false;
      }
    });
  }
}
