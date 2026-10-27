import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../../../features/auth/services/auth.service';
import { MeResponse } from '../../../../features/auth/models/me-response.model';

@Component({
  selector: 'app-profile',
  imports: [],
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
        this.error = err?.error?.detail || 'Unable to load profile.';
      }
    });
  }
}
