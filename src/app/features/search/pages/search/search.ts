import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { NoteCard } from '../../../notes/components/note-card/note-card';
import { NoteResponse } from '../../../notes/models/note-response.model';
import { NoteApiService } from '../../../notes/services/note-api.service';

@Component({
  selector: 'app-search',
  imports: [FormsModule, EmptyState, PageHeader, NoteCard],
  templateUrl: './search.html',
  styleUrl: './search.css'
})
export class Search {
  private readonly api = inject(NoteApiService);
  private readonly route = inject(ActivatedRoute);

  query = '';
  results: NoteResponse[] = [];
  loading = false;
  searched = false;
  error = '';

  ngOnInit(): void {
    const initial = this.route.snapshot.queryParamMap.get('q')?.trim() ?? '';
    if (initial) {
      this.query = initial;
      this.search();
    }
  }

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
}
