import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { JsonPipe } from '@angular/common';
import { NoteApiService } from '../../services/note-api.service';
import {
  NoteResponse,
  NoteSectionResponse,
  NoteContentResponse,
} from '../../models/note-response.model';
import { API_TYPE_TO_CONTENT, ContentBlockType } from '../../models/content-block-type.model';
import { Navbar } from '../../../../shared/components/navbar/navbar';
import { FavoriteService } from '../../../favorites/services/favorite.service';

@Component({
  selector: 'app-note-view',
  imports: [RouterLink, JsonPipe, Navbar],
  templateUrl: './note-view.html',
  styleUrl: './note-view.css',
})
export class NoteView {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(NoteApiService);
  readonly favorites = inject(FavoriteService);
  note: NoteResponse | null = null;
  loading = true;
  error = '';
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Note ID is missing.';
      this.loading = false;
      return;
    }
    this.api.getById(id).subscribe({
      next: (n) => {
        this.note = n;
        this.loading = false;
      },
      error: (e) => {
        this.error = e?.error?.detail || 'Unable to load note.';
        this.loading = false;
      },
    });
  }
  flattenSections(
    sections: NoteSectionResponse[],
    level = 0,
    prefix = '',
  ): Array<{ section: NoteSectionResponse; level: number; number: string }> {
    return sections.flatMap((s, i) => {
      const number = prefix ? `${prefix}.${i + 1}` : `${i + 1}`;
      return [
        { section: s, level, number },
        ...this.flattenSections(s.children ?? [], level + 1, number),
      ];
    });
  }
  typeOf(content: NoteContentResponse): ContentBlockType | string {
    return typeof content.type === 'number'
      ? (API_TYPE_TO_CONTENT[content.type] ?? `Type ${content.type}`)
      : String(content.type).toLowerCase();
  }
  dataOf(content: NoteContentResponse): any {
    if (!content.data) return {};
    try {
      return JSON.parse(content.data);
    } catch {
      return { value: content.data };
    }
  }
  visibility(v: number) {
    return v === 1 ? 'Public' : v === 2 ? 'Shared' : 'Private';
  }
  status(v: number) {
    return v === 2 ? 'Published' : 'Draft';
  }
  toggleFavorite() {
    if (this.note) this.favorites.toggle(this.note.id);
  }
  graphWidth(value: number): number {
    return Math.min(Math.max(Number(value) * 5, 4), 100);
  }
}
