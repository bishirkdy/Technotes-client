import { NgTemplateOutlet } from '@angular/common';
import {
  Component,
  HostListener,
  Input,
  OnChanges,
  signal
} from '@angular/core';
import { NoteSectionResponse } from '../../models/note-section-response.model';
import { FlatNoteSection, flattenNoteSections } from '../../models/note-section.helpers';

@Component({
  selector: 'app-docs-toc',
  imports: [NgTemplateOutlet],
  templateUrl: './docs-toc.html',
  styleUrl: './docs-toc.css'
})
export class DocsToc implements OnChanges {
  @Input() sections: NoteSectionResponse[] = [];

  readonly activeAnchor = signal('');
  items: FlatNoteSection[] = [];
  private frame = 0;

  ngOnChanges(): void {
    this.items = flattenNoteSections(this.sections ?? []);
    this.activeAnchor.set(this.items[0]?.anchor ?? '');
    this.scheduleUpdate();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    this.scheduleUpdate();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.scheduleUpdate();
  }

  private scheduleUpdate(): void {
    if (typeof requestAnimationFrame === 'undefined') {
      this.updateActive();
      return;
    }

    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => this.updateActive());
  }

  private updateActive(): void {
    if (typeof document === 'undefined' || this.items.length === 0) {
      return;
    }

    const offset = 150;
    let current = this.items[0].anchor;

    for (const item of this.items) {
      const element = document.getElementById(item.anchor);
      if (element && element.getBoundingClientRect().top <= offset) {
        current = item.anchor;
      }
    }

    const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (documentHeight > 0 && window.scrollY >= documentHeight - 4) {
      current = this.items[this.items.length - 1].anchor;
    }

    this.activeAnchor.set(current);
  }
}
