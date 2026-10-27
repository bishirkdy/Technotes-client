import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  userName = '';
  email = '';
  password = '';
  loading = false;
  error = '';

  submit(): void {
    this.error = '';

    if (this.userName.trim().length < 3) {
      this.error = 'Username must contain at least 3 characters.';
      return;
    }

    if (!this.email.trim() || this.password.length < 8) {
      this.error = 'Enter a valid email and a password of at least 8 characters.';
      return;
    }

    this.loading = true;
    this.auth.register(this.userName.trim(), this.email.trim(), this.password).subscribe({
      next: () => {
        this.loading = false;
        void this.router.navigate(['/app/dashboard']);
      },
      error: err => {
        this.loading = false;
        this.error = err?.error?.detail || err?.error?.message || 'Registration failed.';
      }
    });
  }
}
