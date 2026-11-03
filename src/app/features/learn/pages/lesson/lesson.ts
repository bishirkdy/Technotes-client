import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';
import { Navbar } from '../../../../shared/components/navbar/navbar';
import { Footer } from '../../../../shared/components/footer/footer';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { DocsSidebar } from '../../../notes/components/docs-sidebar/docs-sidebar';
import { NoteReader } from '../../../notes/components/note-reader/note-reader';
import { ReadingProgress } from '../../../notes/components/reading-progress/reading-progress';
import { NoteResponse } from '../../../notes/models/note-response.model';
import { noteSectionCount } from '../../../notes/models/note-response.helpers';
import { NoteApiService } from '../../../notes/services/note-api.service';

@Component({
  selector: 'app-lesson',
  imports: [RouterLink, Navbar, Footer, EmptyState, NoteReader, ReadingProgress, DatePipe, DocsSidebar],
  templateUrl: './lesson.html',
  styleUrl: './lesson.css',
})
export class Lesson {
  private readonly route = inject(ActivatedRoute);
  private readonly api = inject(NoteApiService);

  topic = '';
  note: NoteResponse | null = null;
  docsNotes: NoteResponse[] = [];
  loading = true;
  error = '';

  get sectionCount(): number {
    return this.note ? noteSectionCount(this.note) : 0;
  }

  ngOnInit(): void {
    this.topic = this.route.snapshot.paramMap.get('topic') ?? 'Reading room';
    const id = this.route.snapshot.paramMap.get('lesson');

    if (!id) {
      this.error = 'This reading item is missing an identifier.';
      this.loading = false;
      return;
    }

    forkJoin({
      note: this.api.getById(id),
      notes: this.api.getPublicNotes().pipe(catchError(() => of([])))
    }).subscribe({
      next: result => {
        this.note = result.note;
        this.docsNotes = result.notes;
        this.loading = false;
      },
      error: () => {
        this.error = 'This note could not be loaded.';
        this.loading = false;
      }
    });
  }
}
