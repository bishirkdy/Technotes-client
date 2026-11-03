import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NoteApiService } from '../../services/note-api.service';
import { NoteCreateModel } from '../../models/note-create.model';
import { NoteSectionModel } from '../../models/note-section.model';
import { ContentBlockModel } from '../../models/content-block.model';
import { NoteStatus } from '../../models/note-status.model';
import { NoteVisibility } from '../../models/note-visibility.model';
import { ContentBlock } from '../../components/content-block/content-block';
import { CategoryApiService } from '../../../categories/services/category-api.service';
import { CategoryResponse } from '../../../categories/models/category.model';

@Component({
  selector: 'app-note-create',
  imports: [FormsModule, RouterLink, ContentBlock],
  templateUrl: './note-create.html',
  styleUrl: './note-create.css',
})
export class NoteCreate {
  private readonly noteApi = inject(NoteApiService);
  private readonly categoryApi = inject(CategoryApiService);
  private readonly router = inject(Router);

  readonly statuses = [
    { value: NoteStatus.Draft, label: 'Draft' },
    { value: NoteStatus.Published, label: 'Published' }
  ];

  note: NoteCreateModel = {
    title: '',
    visibility: NoteVisibility.Private,
    status: NoteStatus.Draft,
    folderId: null,
    categoryId: null,
    tags: [],
    sections: []
  };

  categories: CategoryResponse[] = [];
  tagsInput = '';

  activeSectionId: number | null = null;
  loading = false;
  saved = false;
  error = '';
  submitted = false;

  ngOnInit(): void {
    this.categoryApi.list().subscribe({
      next: categories => this.categories = categories,
      error: () => this.categories = []
    });
  }

  get categoryGroups(): CategoryResponse[] {
    return this.categories.filter(category => !category.parentCategoryId);
  }

  get childCategories(): CategoryResponse[] {
    return this.categories.filter(category => category.parentCategoryId);
  }

  childrenOf(groupId: string): CategoryResponse[] {
    return this.childCategories.filter(category => category.parentCategoryId === groupId);
  }

  get activeSection(): NoteSectionModel | null {
    return this.activeSectionId === null ? null : this.findSection(this.note.sections, this.activeSectionId);
  }

  addSection(parentId: number | null = null): void {
    const target = parentId === null ? this.note.sections : this.findSection(this.note.sections, parentId)?.children;
    if (!target) return;
    const children = target as NoteSectionModel[];
    const section: NoteSectionModel = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      title: 'New Section',
      sortOrder: children.length,
      children: [],
      contents: []
    };
    children.push(section);
    this.activeSectionId = section.id;
  }

  selectSection(id: number): void { this.activeSectionId = id; }

  renameSection(id: number, title: string): void {
    const section = this.findSection(this.note.sections, id);
    if (section) section.title = title;
  }

  removeSection(id: number): void {
    const removed = this.removeFromTree(this.note.sections, id);
    if (!removed) return;
    if (this.activeSectionId === id) this.activeSectionId = this.note.sections[0]?.id ?? null;
    this.normalizeSections(this.note.sections);
  }

  moveSection(id: number, direction: -1 | 1): void {
    const siblings = this.findSiblings(this.note.sections, id);
    if (!siblings) return;
    const index = siblings.findIndex(s => s.id === id);
    const next = index + direction;
    if (index < 0 || next < 0 || next >= siblings.length) return;
    [siblings[index], siblings[next]] = [siblings[next], siblings[index]];
    this.normalizeSections(siblings);
  }

  setContentBlocks(sectionId: number, blocks: ContentBlockModel[]): void {
    const section = this.findSection(this.note.sections, sectionId);
    if (section) section.contents = blocks;
  }

  saveNote(): void {
    this.submitted = true;
    this.error = '';
    if (!this.note.title.trim()) {
      this.error = 'Title is required.';
      return;
    }
    if (this.note.sections.length === 0) {
      this.error = 'Add at least one section.';
      return;
    }

    this.normalizeSections(this.note.sections);
    this.note.tags = this.parseTags(this.tagsInput);
    this.loading = true;
    this.noteApi.create(this.note).subscribe({
      next: response => {
        this.saved = true;
        this.loading = false;
        this.router.navigate(['/notes', response.id]);
      },
      error: error => {
        this.loading = false;
        this.error = this.getError(error, 'Unable to save note.');
      }
    });
  }

  blockCount(): number {
    return this.flattenSections(this.note.sections)
      .reduce((total, item) => total + item.section.contents.length, 0);
  }

  flattenSections(sections: NoteSectionModel[], level = 0, prefix = ''): Array<{ section: NoteSectionModel; level: number; number: string }> {
    return sections.flatMap((section, index) => {
      const number = prefix ? `${prefix}.${index + 1}` : `${index + 1}`;
      return [{ section, level, number }, ...this.flattenSections(section.children, level + 1, number)];
    });
  }

  private findSection(sections: NoteSectionModel[], id: number): NoteSectionModel | null {
    for (const section of sections) {
      if (section.id === id) return section;
      const found = this.findSection(section.children, id);
      if (found) return found;
    }
    return null;
  }

  private findSiblings(root: NoteSectionModel[], id: number): NoteSectionModel[] | null {
    if (root.some(section => section.id === id)) return root;
    for (const section of root) {
      const found = this.findSiblings(section.children, id);
      if (found) return found;
    }
    return null;
  }

  private removeFromTree(sections: NoteSectionModel[], id: number): boolean {
    const index = sections.findIndex(section => section.id === id);
    if (index >= 0) {
      sections.splice(index, 1);
      return true;
    }
    return sections.some(section => this.removeFromTree(section.children, id));
  }

  private normalizeSections(sections: NoteSectionModel[]): void {
    sections.forEach((section, index) => {
      section.sortOrder = index;
      section.contents = section.contents.map((content, contentIndex) => ({ ...content, sortOrder: contentIndex }));
      this.normalizeSections(section.children);
    });
  }

  private getError(error: any, fallback: string): string {
    return error?.error?.detail || error?.error?.message || error?.message || fallback;
  }

  private parseTags(value: string): string[] {
    const seen = new Set<string>();
    const tags: string[] = [];

    for (const item of value.split(',')) {
      const tag = item.trim();
      const key = tag.toLowerCase();
      if (tag && !seen.has(key)) {
        seen.add(key);
        tags.push(tag);
      }
    }

    return tags;
  }
}
