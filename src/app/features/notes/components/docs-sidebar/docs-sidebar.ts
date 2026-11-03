import { NgTemplateOutlet } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  inject,
  signal
} from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NoteResponse } from '../../models/note-response.model';
import {
  activeSectionAnchor,
  buildDocsGroups,
  noteCategoryName,
  noteMatchesCategory,
  SectionPosition
} from '../../models/docs-navigation.helpers';
import { FlatNoteSection, flattenNoteSections } from '../../models/note-section.helpers';

@Component({
  selector: 'app-docs-sidebar',
  imports: [NgTemplateOutlet, RouterLink, RouterLinkActive],
  templateUrl: './docs-sidebar.html',
  styleUrl: './docs-sidebar.css'
})
export class DocsSidebar implements OnChanges, AfterViewInit, OnDestroy {
  @Input() notes: NoteResponse[] = [];
  @Input() currentNoteId = '';
  @Input() currentCategory = '';
  @Input() mode: 'docs' | 'learn' = 'docs';
  @Input() singleNote = false;

  readonly query = signal('');
  readonly activeAnchor = signal('');

  private readonly collapsedGroups = signal<Set<string>>(new Set());
  private readonly collapsedSections = signal<Set<string>>(new Set());
  private readonly sectionCache = new Map<string, FlatNoteSection[]>();
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  private frame = 0;

  get groups() {
    const source = this.currentCategory
      ? this.notes.filter(note => noteMatchesCategory(note, this.currentCategory))
      : this.notes;

    return buildDocsGroups(source, this.query());
  }

  get focusNote(): NoteResponse | null {
    return this.notes.find(note => note.id === this.currentNoteId) ?? this.notes[0] ?? null;
  }

  get focusCategory(): string {
    return this.focusNote ? noteCategoryName(this.focusNote) : this.currentCategory;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['notes'] || changes['currentNoteId']) {
      this.activeAnchor.set('');
      this.collapsedSections.set(new Set());
      this.scheduleActiveUpdate();
    }
  }

  ngAfterViewInit(): void {
    this.scheduleActiveUpdate();
  }

  ngOnDestroy(): void {
    if (typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.frame);
    }
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.scheduleActiveUpdate();
  }

  noteRoute(note: NoteResponse): string[] {
    return this.mode === 'learn'
      ? ['/learn', noteCategoryName(note), note.id]
      : ['/notes', note.id];
  }

  categoryLabel(note: NoteResponse): string {
    return noteCategoryName(note);
  }

  noteSections(note: NoteResponse): FlatNoteSection[] {
    const cached = this.sectionCache.get(note.id);
    if (cached) {
      return cached;
    }

    const sections = flattenNoteSections(note.sections ?? []);
    this.sectionCache.set(note.id, sections);
    return sections;
  }

  visibleSections(note: NoteResponse): FlatNoteSection[] {
    const collapsed = this.collapsedSections();
    return this.noteSections(note).filter(
      item => !item.ancestorIds.some(id => collapsed.has(id))
    );
  }

  hasChildren(item: FlatNoteSection): boolean {
    return (item.section.children?.length ?? 0) > 0;
  }

  isSectionExpanded(id: string): boolean {
    return !this.collapsedSections().has(id);
  }

  toggleSection(id: string): void {
    this.collapsedSections.update(items => {
      const next = new Set(items);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  setQuery(value: string): void {
    this.query.set(value);
  }

  isExpanded(name: string): boolean {
    return !this.collapsedGroups().has(name);
  }

  toggle(name: string): void {
    this.collapsedGroups.update(items => {
      const next = new Set(items);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  }

  private scheduleActiveUpdate(): void {
    if (typeof window === 'undefined') {
      return;
    }

    if (typeof requestAnimationFrame === 'undefined') {
      this.updateActiveSection();
      return;
    }

    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => this.updateActiveSection());
  }

  private updateActiveSection(): void {
    if (
      typeof document === 'undefined' ||
      typeof window === 'undefined' ||
      !this.focusNote
    ) {
      return;
    }

    const sections = this.noteSections(this.focusNote);
    if (sections.length === 0) {
      return;
    }

    const positions: SectionPosition[] = sections.map(item => {
      const element = document.getElementById(item.anchor);
      return {
        anchor: item.anchor,
        top: element ? element.getBoundingClientRect().top : Number.POSITIVE_INFINITY
      };
    });

    const scrolledToBottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 4;
    const anchor = scrolledToBottom
      ? sections[sections.length - 1].anchor
      : activeSectionAnchor(positions, 140);

    if (!anchor) {
      return;
    }

    const activeItem = sections.find(item => item.anchor === anchor);
    if (activeItem) {
      const collapsed = this.collapsedSections();
      const next = new Set(collapsed);
      let changed = false;

      for (const parentId of activeItem.ancestorIds) {
        if (next.delete(parentId)) {
          changed = true;
        }
      }

      if (changed) {
        this.collapsedSections.set(next);
      }
    }

    if (this.activeAnchor() !== anchor) {
      this.activeAnchor.set(anchor);
      this.ensureActiveLinkVisible(anchor);
    }
  }

  private ensureActiveLinkVisible(anchor: string): void {
    if (typeof window === 'undefined') {
      return;
    }

    const reveal = () => {
      const links = this.host.nativeElement.querySelectorAll<HTMLElement>(
        `[data-section-anchor="${anchor}"]`
      );

      links.forEach(link => {
        const container = link.closest<HTMLElement>('.docs-nav-scroll');
        if (!container) {
          return;
        }

        const containerRect = container.getBoundingClientRect();
        const linkRect = link.getBoundingClientRect();

        if (linkRect.top < containerRect.top) {
          container.scrollTop -= containerRect.top - linkRect.top + 8;
        } else if (linkRect.bottom > containerRect.bottom) {
          container.scrollTop += linkRect.bottom - containerRect.bottom + 8;
        }
      });
    };

    if (typeof queueMicrotask !== 'undefined') {
      queueMicrotask(reveal);
    } else {
      window.setTimeout(reveal);
    }
  }
}

