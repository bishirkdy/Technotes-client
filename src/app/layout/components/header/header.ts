import { Component, EventEmitter, Output, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { ThemeToggle } from '../../../shared/components/theme-toggle/theme-toggle';

@Component({
  selector: 'app-header',
  imports: [RouterLink, ThemeToggle],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  private readonly auth = inject(AuthService);

  @Output() menuToggled = new EventEmitter<void>();

  get isAdmin(): boolean {
    return this.auth.isAdmin;
  }

  get firstName(): string {
    const name = this.auth.user?.userName || this.auth.user?.email || 'there';
    return name.split(/[@\s]/)[0];
  }
}
