import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Navbar } from '../../../../shared/components/navbar/navbar';
import { Footer } from '../../../../shared/components/footer/footer';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { DocsSidebar } from '../../components/docs-sidebar/docs-sidebar';
import { NoteCard } from '../../components/note-card/note-card';
import { NoteResponse } from '../../models/note-response.model';
import { noteTextPreview } from '../../models/note-response.helpers';
import { noteMatchesCategory } from '../../models/docs-navigation.helpers';
import { NoteApiService } from '../../services/note-api.service';

@Component({
  selector: 'app-note-list',
  imports: [FormsModule, NoteCard, Navbar, Footer, EmptyState, DocsSidebar],
  templateUrl: './note-list.html',
  styleUrl: './note-list.css'
})
export class NoteList {
  private readonly api = inject(NoteApiService);
  private readonly route = inject(ActivatedRoute);

  query = '';
  category = '';
  notes: NoteResponse[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.category = params.get('category')?.trim() ?? '';
      this.query = params.get('q')?.trim() ?? '';
    });
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
        this.error = 'Unable to load docs.';
        this.loading = false;
      }
    });
  }

  get filteredNotes(): NoteResponse[] {
    const query = this.query.trim().toLowerCase();

    return this.notes.filter(note => {
      const matchesCategory = !this.category ||
        noteMatchesCategory(note, this.category);
      if (!matchesCategory) {
        return false;
      }

      if (!query) {
        return true;
      }

      return [
        note.title,
        note.categoryName ?? '',
        note.categoryParentName ?? '',
        ...(note.categoryPath ?? []),
        ...(note.tags ?? []),
        noteTextPreview(note)
      ].some(value => value.toLowerCase().includes(query));
    });
  }

  get hasFilters(): boolean {
    return !!this.category || !!this.query.trim();
  }

  clearFilters(): void {
    this.category = '';
    this.query = '';
  }
}
