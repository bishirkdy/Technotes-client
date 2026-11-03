import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Navbar } from '../../../../shared/components/navbar/navbar';
import { Footer } from '../../../../shared/components/footer/footer';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { DocsSidebar } from '../../../notes/components/docs-sidebar/docs-sidebar';
import { NoteResponse } from '../../../notes/models/note-response.model';
import { noteSectionCount, noteTextPreview } from '../../../notes/models/note-response.helpers';
import { NoteApiService } from '../../../notes/services/note-api.service';

@Component({
  selector: 'app-topic',
  imports: [RouterLink, Navbar, Footer, EmptyState, DatePipe, DocsSidebar],
  templateUrl: './topic.html',
  styleUrl: './topic.css',
})
export class Topic {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(NoteApiService);

  topic = '';
  notes: NoteResponse[] = [];
  docsNotes: NoteResponse[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    const param = this.route.snapshot.paramMap.get('topic') ?? '';
    this.topic = param || 'Uncategorized';

    this.api.getPublicNotes().subscribe({
      next: notes => {
        const target = this.topic.toLowerCase();
        this.docsNotes = notes;
        this.notes = notes.filter(note => {
          const name = note.categoryName?.trim() || 'Uncategorized';
          return name.toLowerCase() === target;
        });
        this.loading = false;
      },
      error: () => {
        this.error = 'This reading track could not be loaded.';
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
}
