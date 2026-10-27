import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  email = '';
  password = '';
  loading = false;
  error = '';

  submit(): void {
    this.error = '';

    if (!this.email.trim() || !this.password) {
      this.error = 'Email and password are required.';
      return;
    }

    this.loading = true;
    this.auth.login(this.email.trim(), this.password).subscribe({
      next: () => {
        this.loading = false;
        void this.router.navigateByUrl(this.returnUrl());
      },
      error: err => {
        this.loading = false;
        this.error = err?.error?.detail || err?.error?.message || 'Invalid email or password.';
      }
    });
  }

  private returnUrl(): string {
    const value = this.route.snapshot.queryParamMap.get('returnUrl');
    return value && value.startsWith('/') && !value.startsWith('//')
      ? value
      : '/app/dashboard';
  }
}
