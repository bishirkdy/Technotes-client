import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Navbar } from '../../../../shared/components/navbar/navbar';
import { FavoriteService } from '../../../favorites/services/favorite.service';
import { AuthService } from '../../../auth/services/auth.service';
import { ContentBlockType } from '../../models/content-block-type.model';
import { API_TYPE_TO_CONTENT } from '../../models/content-block-type.mapping';
import { NoteContentResponse } from '../../models/note-content-response.model';
import { NoteResponse } from '../../models/note-response.model';
import { NoteSectionResponse } from '../../models/note-section-response.model';
import { noteStatusLabel } from '../../models/note-status.model';
import { noteVisibilityLabel } from '../../models/note-visibility.model';
import { NoteApiService } from '../../services/note-api.service';

@Component({
  selector: 'app-note-view',
  imports: [RouterLink, Navbar],
  templateUrl: './note-view.html',
  styleUrl: './note-view.css'
})
export class NoteView {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(NoteApiService);
  private readonly auth = inject(AuthService);
  readonly favorites = inject(FavoriteService);

  note: NoteResponse | null = null;
  loading = true;
  error = '';

  get canEdit(): boolean {
    return !!this.note && this.note.userId === this.auth.user?.userId;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'Note ID is missing.';
      this.loading = false;
      return;
    }

    this.api.getById(id).subscribe({
      next: note => {
        this.note = note;
        this.loading = false;
      },
      error: err => {
        this.error = err?.error?.detail || 'Unable to load note.';
        this.loading = false;
      }
    });
  }

  flattenSections(
    sections: NoteSectionResponse[],
    level = 0,
    prefix = ''
  ): Array<{ section: NoteSectionResponse; level: number; number: string }> {
    return sections.flatMap((section, index) => {
      const number = prefix ? `${prefix}.${index + 1}` : `${index + 1}`;
      return [
        { section, level, number },
        ...this.flattenSections(section.children ?? [], level + 1, number)
      ];
    });
  }

  typeOf(content: NoteContentResponse): ContentBlockType | string {
    return typeof content.type === 'number'
      ? (API_TYPE_TO_CONTENT[content.type] ?? `Type ${content.type}`)
      : String(content.type).toLowerCase();
  }

  dataOf(content: NoteContentResponse): any {
    if (!content.data) {
      return {};
    }

    try {
      return JSON.parse(content.data);
    } catch {
      return { value: content.data };
    }
  }

  visibility(value: number): string {
    return noteVisibilityLabel(value);
  }

  status(value: number): string {
    return noteStatusLabel(value);
  }

  toggleFavorite(): void {
    if (this.note) {
      this.favorites.toggle(this.note.id);
    }
  }

  graphWidth(value: number): number {
    return Math.min(Math.max(Number(value) * 5, 4), 100);
  }
}
