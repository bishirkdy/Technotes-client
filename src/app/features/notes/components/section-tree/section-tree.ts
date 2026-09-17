import { Component, EventEmitter, Input, Output } from '@angular/core';

import { SectionItem } from '../section-item/section-item';
import { NoteSectionModel } from '../../models/note-create.model';

@Component({
  selector: 'app-section-tree',
  imports: [SectionItem],
  templateUrl: './section-tree.html',
  styleUrl: './section-tree.css'
})
export class SectionTree {

  @Input()
  sections: NoteSectionModel[] = [];

  @Output()
  sectionsChange = new EventEmitter<NoteSectionModel[]>();

  @Output()
  sectionSelected = new EventEmitter<number>();

  private nextId = 1;

  addSection(): void {
    const section: NoteSectionModel = {
      id: this.nextId++,
      title: 'New Section',
      sortOrder: this.sections.length,
      contents: [],
      children: []
    };

    this.sections = [
      ...this.sections,
      section
    ];

    this.sectionsChange.emit(this.sections);
    this.sectionSelected.emit(section.id);
  }

  selectSection(id: number): void {
    this.sectionSelected.emit(id);
  }

  renameSection(id: number, title: string): void {
    const section = this.sections.find(x => x.id === id);

    if (!section) return;

    section.title = title;

    this.sectionsChange.emit(this.sections);
  }

  deleteSection(id: number): void {
    this.sections = this.sections.filter(
      section => section.id !== id
    );

    this.sectionsChange.emit(this.sections);
  }
}