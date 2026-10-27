import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ContentBlock } from '../../components/content-block/content-block';
import { ContentBlockModel } from '../../models/content-block.model';
import { NoteCreateModel } from '../../models/note-create.model';
import { NoteSectionModel } from '../../models/note-section.model';
import { NoteStatus } from '../../models/note-status.model';
import { NoteApiService } from '../../services/note-api.service';
import { NoteMapperService } from '../../services/note-mapper.service';

@Component({
  selector: 'app-note-edit',
  imports: [FormsModule, RouterLink, ContentBlock],
  templateUrl: './note-edit.html',
  styleUrl: './note-edit.css'
})
export class NoteEdit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(NoteApiService);
  private readonly mapper = inject(NoteMapperService);
  private readonly id = this.route.snapshot.paramMap.get('id') ?? '';

  readonly statuses = [
    { value: NoteStatus.Draft, label: 'Draft' },
    { value: NoteStatus.Published, label: 'Published' },
    { value: NoteStatus.Archived, label: 'Archived' }
  ];

  note: NoteCreateModel = {
    title: '',
    visibility: 1,
    status: NoteStatus.Draft,
    folderId: null,
    categoryId: null,
    sections: []
  };

  activeSectionId: number | null = null;
  loading = true;
  saving = false;
  error = '';

  ngOnInit(): void {
    if (!this.id) {
      this.error = 'Note ID is missing.';
      this.loading = false;
      return;
    }

    this.api.getById(this.id).subscribe({
      next: note => {
        this.note = this.mapper.fromResponse(note);
        this.activeSectionId = this.note.sections[0]?.id ?? null;
        this.loading = false;
      },
      error: err => {
        this.error = err?.error?.detail || 'Unable to load note.';
        this.loading = false;
      }
    });
  }

  get activeSection(): NoteSectionModel | null {
    return this.activeSectionId === null
      ? null
      : this.find(this.note.sections, this.activeSectionId);
  }

  flattenSections(
    sections: NoteSectionModel[],
    level = 0,
    prefix = ''
  ): Array<{ section: NoteSectionModel; level: number; number: string }> {
    return sections.flatMap((section, index) => {
      const number = prefix ? `${prefix}.${index + 1}` : `${index + 1}`;
      return [
        { section, level, number },
        ...this.flattenSections(section.children, level + 1, number)
      ];
    });
  }

  selectSection(id: number): void {
    this.activeSectionId = id;
  }

  setBlocks(id: number, blocks: ContentBlockModel[]): void {
    const section = this.find(this.note.sections, id);
    if (section) {
      section.contents = blocks;
    }
  }

  addSection(parentId: number | null = null): void {
    const target = parentId === null
      ? this.note.sections
      : this.find(this.note.sections, parentId)?.children;

    if (!target) {
      return;
    }

    const section: NoteSectionModel = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      title: 'New Section',
      sortOrder: target.length,
      children: [],
      contents: []
    };

    target.push(section);
    this.activeSectionId = section.id;
  }

  removeSection(id: number): void {
    if (!this.remove(this.note.sections, id)) {
      return;
    }

    this.normalize(this.note.sections);
    if (this.activeSectionId === id) {
      this.activeSectionId = this.note.sections[0]?.id ?? null;
    }
  }

  save(): void {
    this.error = '';

    if (!this.note.title.trim()) {
      this.error = 'Title is required.';
      return;
    }

    if (!this.note.sections.length) {
      this.error = 'Add at least one section.';
      return;
    }

    this.normalize(this.note.sections);
    this.saving = true;
    this.api.update(this.id, this.note).subscribe({
      next: response => this.router.navigate(['/notes', response.id]),
      error: err => {
        this.error = err?.error?.detail || 'Unable to update note.';
        this.saving = false;
      }
    });
  }

  delete(): void {
    if (!confirm('Delete this note?')) {
      return;
    }

    this.api.delete(this.id).subscribe({
      next: () => this.router.navigate(['/app/notes']),
      error: err => {
        this.error = err?.error?.detail || 'Unable to delete note.';
      }
    });
  }

  private find(sections: NoteSectionModel[], id: number): NoteSectionModel | null {
    for (const section of sections) {
      if (section.id === id) {
        return section;
      }

      const found = this.find(section.children, id);
      if (found) {
        return found;
      }
    }

    return null;
  }

  private remove(sections: NoteSectionModel[], id: number): boolean {
    const index = sections.findIndex(section => section.id === id);
    if (index >= 0) {
      sections.splice(index, 1);
      return true;
    }

    return sections.some(section => this.remove(section.children, id));
  }

  private normalize(sections: NoteSectionModel[]): void {
    sections.forEach((section, index) => {
      section.sortOrder = index;
      section.contents = section.contents.map((content, contentIndex) => ({
        ...content,
        sortOrder: contentIndex
      }));
      this.normalize(section.children);
    });
  }
}
