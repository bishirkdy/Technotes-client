import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { CategoryApiService } from '../../services/category-api.service';
import {
  CategoryRequest,
  CategoryResponse,
  CategoryTreeResponse
} from '../../models/category.model';

interface CategoryForm {
  id: string | null;
  name: string;
  description: string;
  parentCategoryId: string | null;
  sortOrder: number;
}

@Component({
  selector: 'app-category-list',
  imports: [FormsModule, EmptyState, PageHeader],
  templateUrl: './category-list.html',
  styleUrl: './category-list.css'
})
export class CategoryList {
  private readonly api = inject(CategoryApiService);

  tree: CategoryTreeResponse[] = [];
  categories: CategoryResponse[] = [];
  loading = true;
  saving = false;
  error = '';
  success = '';

  form: CategoryForm = this.emptyForm();

  ngOnInit(): void {
    this.load();
  }

  get groups(): CategoryResponse[] {
    return this.categories.filter(category => !category.parentCategoryId);
  }

  get editing(): boolean {
    return this.form.id !== null;
  }

  get editingHasChildren(): boolean {
    if (!this.form.id) {
      return false;
    }

    const category = this.categories.find(item => item.id === this.form.id);
    return (category?.childCount ?? 0) > 0;
  }

  load(): void {
    this.loading = true;
    this.error = '';
    forkJoin({ tree: this.api.tree(), categories: this.api.list() }).subscribe({
      next: result => {
        this.tree = result.tree;
        this.categories = result.categories;
        this.loading = false;
      },
      error: err => {
        this.error = err?.error?.detail || 'Unable to load categories.';
        this.loading = false;
      }
    });
  }

  startCreate(parentCategoryId: string | null = null): void {
    const parent = this.categories.find(
      category => category.id === parentCategoryId
    );
    this.form = {
      ...this.emptyForm(),
      parentCategoryId,
      sortOrder: parent ? parent.childCount * 10 : this.groups.length * 10
    };
    this.success = '';
    this.error = '';
  }

  startEdit(category: CategoryResponse): void {
    this.form = {
      id: category.id,
      name: category.name,
      description: category.description ?? '',
      parentCategoryId: category.parentCategoryId,
      sortOrder: category.sortOrder
    };
    this.success = '';
    this.error = '';
  }

  cancel(): void {
    this.form = this.emptyForm();
  }

  save(): void {
    this.error = '';
    this.success = '';

    if (!this.form.name.trim()) {
      this.error = 'Category name is required.';
      return;
    }

    const request: CategoryRequest = {
      name: this.form.name.trim(),
      description: this.form.description.trim() || null,
      parentCategoryId: this.form.parentCategoryId,
      sortOrder: Number(this.form.sortOrder) || 0
    };

    this.saving = true;
    const action = this.form.id
      ? this.api.update(this.form.id, request)
      : this.api.create(request);

    action.subscribe({
      next: () => {
        this.saving = false;
        this.success = this.editing ? 'Category updated.' : 'Category created.';
        this.form = this.emptyForm();
        this.load();
      },
      error: err => {
        this.saving = false;
        this.error = err?.error?.detail || 'Unable to save category.';
      }
    });
  }

  remove(category: CategoryResponse): void {
    if (!confirm(`Delete "${category.name}"?`)) {
      return;
    }

    this.error = '';
    this.success = '';
    this.api.delete(category.id).subscribe({
      next: () => {
        this.success = 'Category deleted.';
        if (this.form.id === category.id) {
          this.form = this.emptyForm();
        }
        this.load();
      },
      error: err => {
        this.error = err?.error?.detail || 'Unable to delete category.';
      }
    });
  }

  asCategory(category: CategoryTreeResponse): CategoryResponse {
    return this.categories.find(item => item.id === category.id) ?? {
      id: category.id,
      name: category.name,
      description: category.description,
      parentCategoryId: null,
      parentCategoryName: null,
      sortOrder: category.sortOrder,
      noteCount: category.noteCount,
      childCount: category.children.length,
      createdAtUtc: ''
    };
  }

  private emptyForm(): CategoryForm {
    return {
      id: null,
      name: '',
      description: '',
      parentCategoryId: null,
      sortOrder: 0
    };
  }
}
