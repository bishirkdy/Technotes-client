import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { NoteApiService } from '../../../notes/services/note-api.service';
import {
  noteCategoryName,
  noteCategoryParentName
} from '../../../notes/models/docs-navigation.helpers';

interface CategorySummary {
  name: string;
  count: number;
  children: Array<{ name: string; count: number }>;
}

@Component({
  selector: 'app-category-list',
  imports: [RouterLink, EmptyState],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css',
})
export class CategoryList {
  private readonly api = inject(NoteApiService);

  categories: CategorySummary[] = [];
  loading = true;
  error = '';

  ngOnInit(): void {
    this.api.getPublicNotes().subscribe({
      next: notes => {
        const groups = new Map<string, { count: number; children: Map<string, number> }>();

        for (const note of notes) {
          const name = noteCategoryParentName(note);
          const childName = noteCategoryName(note);
          const group = groups.get(name) ?? { count: 0, children: new Map<string, number>() };
          group.count += 1;
          group.children.set(childName, (group.children.get(childName) ?? 0) + 1);
          groups.set(name, group);
        }

        this.categories = [...groups.entries()]
          .map(([name, group]) => ({
            name,
            count: group.count,
            children: [...group.children.entries()]
              .map(([childName, count]) => ({ name: childName, count }))
              .sort((left, right) => left.name.localeCompare(right.name))
          }))
          .sort((a, b) => a.name.localeCompare(b.name))
          .slice(0, 8);
        this.loading = false;
      },
      error: () => {
        this.error = 'Categories are temporarily unavailable.';
        this.loading = false;
      }
    });
  }
}
