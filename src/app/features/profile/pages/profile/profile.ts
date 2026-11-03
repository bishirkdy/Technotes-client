import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../../../features/auth/services/auth.service';
import { MeResponse } from '../../../../features/auth/models/me-response.model';
import { PageHeader } from '../../../../shared/components/page-header/page-header';
import { EmptyState } from '../../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-profile',
  imports: [PageHeader, EmptyState],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {
  readonly auth = inject(AuthService);

  loading = false;
  error = '';

  get user(): MeResponse | null {
    return this.auth.user;
  }

  get initials(): string {
    return (this.user?.userName || this.user?.email || 'U').slice(0, 2).toUpperCase();
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.loading = true;
    this.error = '';
    this.auth.getMe().subscribe({
      next: () => {
        this.loading = false;
      },
      error: err => {
        this.loading = false;
        this.error = err?.error?.detail
          || err?.error?.message
          || err?.error?.title
          || 'Unable to load profile.';
      }
    });
  }
}
