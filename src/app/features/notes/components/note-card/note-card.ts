import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NoteResponse } from '../../models/note-response.model';
import { noteSectionCount, noteTextPreview } from '../../models/note-response.helpers';
import { noteVisibilityLabel } from '../../models/note-visibility.model';

@Component({
  selector: 'app-note-card',
  imports: [RouterLink, DatePipe],
  templateUrl: './note-card.html',
  styleUrl: './note-card.css'
})
export class NoteCard {
  @Input({ required: true }) note!: NoteResponse;
  @Input() editable = false;
  @Input() showVisibility = false;
  @Input() deleting = false;
  @Output() deleteRequested = new EventEmitter<string>();

  get preview(): string {
    return noteTextPreview(this.note) || 'Open this note to read the complete content.';
  }

  get sectionCount(): number {
    return noteSectionCount(this.note);
  }

  get visibilityLabel(): string {
    return noteVisibilityLabel(this.note.visibility);
  }

  get date(): string | null {
    return this.note.updatedAtUtc || this.note.createdAtUtc || null;
  }

  requestDelete(): void {
    this.deleteRequested.emit(this.note.id);
  }
}
