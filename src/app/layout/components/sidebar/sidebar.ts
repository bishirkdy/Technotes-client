import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';

interface NavItem {
  label: string;
  path: string;
  glyph: string;
}

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  @Input() open = false;
  @Output() closed = new EventEmitter<void>();

  get primary(): NavItem[] {
    const items: NavItem[] = [{ label: 'Dashboard', path: '/app/dashboard', glyph: '◫' }];
    if (this.auth.isAdmin) {
      items.push(
        { label: 'My notes', path: '/app/notes', glyph: '▤' },
        { label: 'Shared with me', path: '/app/shared', glyph: '⇄' }
      );
    }
    items.push({ label: 'Favorites', path: '/app/favorites', glyph: '★' });
    return items;
  }

  get library(): NavItem[] {
    if (!this.auth.isAdmin) {
      return [];
    }

    return [
      { label: 'Categories', path: '/app/categories', glyph: '◈' },
      { label: 'Tags', path: '/app/tags', glyph: '#' },
      { label: 'Activity', path: '/app/activity', glyph: '∿' }
    ];
  }

  get user() {
    return this.auth.user;
  }

  get isAdmin(): boolean {
    return this.auth.isAdmin;
  }

  get initials(): string {
    const value = this.user?.userName || this.user?.email || 'U';
    return value.slice(0, 2).toUpperCase();
  }

  close(): void {
    this.closed.emit();
  }

  logout(): void {
    this.auth.logout().subscribe({
      next: () => void this.router.navigate(['/']),
      error: () => {
        this.auth.clearAuth();
        void this.router.navigate(['/']);
      }
    });
  }
}
