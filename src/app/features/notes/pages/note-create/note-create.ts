import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ContentBlock } from '../../components/content-block/content-block';
import { NoteCreateModel } from '../../models/note-create.model';

@Component({
  selector: 'app-note-create',
  imports: [FormsModule, RouterLink, ContentBlock],
  templateUrl: './note-create.html',
  styleUrl: './note-create.css',
})
export class NoteCreate {
  note: NoteCreateModel = {
    title: '',
    description: '',
    tags: ['dotnet'],
    visibility: 'private',
    sections: [{ id: 1, title: 'Introduction', contentBlocks: [], children: [] }],
  };
  activeSection = 1;
  saved = false;
  saveNote() {
    this.saved = true;
    console.log('Dummy note:', this.note);
    setTimeout(() => (this.saved = false), 1800);
  }
  addSection() {
    this.note.sections.push({
      id: Date.now(),
      title: 'New Section',
      contentBlocks: [],
      children: [],
    });
  }
  selectSection(id: number) {
    this.activeSection = id;
  }
}
