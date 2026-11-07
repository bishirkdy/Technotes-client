import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  inject,
  signal
} from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { ThemeToggle } from '../theme-toggle/theme-toggle';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, ThemeToggle],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit, OnDestroy {
  @Input() autoHide = false;

  private readonly router = inject(Router);
  readonly auth = inject(AuthService);
  readonly menuOpen = signal(false);
  readonly query = signal('');
  readonly headerHidden = signal(false);

  private lastScrollY = 0;
  private frame = 0;

  ngOnInit(): void {
    this.lastScrollY = this.currentScrollY();
  }

  ngOnDestroy(): void {
    if (typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.frame);
    }
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    if (!this.autoHide) {
      return;
    }

    if (typeof window === 'undefined') {
      return;
    }

    if (typeof requestAnimationFrame === 'undefined') {
      this.updateHeaderVisibility();
      return;
    }

    cancelAnimationFrame(this.frame);
    this.frame = requestAnimationFrame(() => this.updateHeaderVisibility());
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    if (!this.isCompactViewport()) {
      this.setHeaderHidden(false);
    }
    this.lastScrollY = this.currentScrollY();
  }

  toggleMenu(): void {
    this.menuOpen.update(value => !value);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  setQuery(value: string): void {
    this.query.set(value);
  }

  search(event: Event): void {
    event.preventDefault();
    const term = this.query().trim();
    this.closeMenu();
    void this.router.navigate(['/notes'], {
      queryParams: term ? { q: term } : {}
    });
  }

  private updateHeaderVisibility(): void {
    const scrollY = this.currentScrollY();

    if (!this.autoHide || this.menuOpen()) {
      this.lastScrollY = scrollY;
      return;
    }

    if (!this.isCompactViewport()) {
      this.setHeaderHidden(false);
      this.lastScrollY = scrollY;
      return;
    }

    const delta = scrollY - this.lastScrollY;

    if (scrollY <= 24) {
      this.setHeaderHidden(false);
    } else if (delta > 6) {
      this.setHeaderHidden(true);
    } else if (delta < -6) {
      this.setHeaderHidden(false);
    }

    this.lastScrollY = scrollY;
  }

  private setHeaderHidden(hidden: boolean): void {
    if (this.headerHidden() === hidden) {
      return;
    }

    this.headerHidden.set(hidden);
    if (hidden) {
      this.closeMenu();
    }
  }

  private isCompactViewport(): boolean {
    if (typeof window === 'undefined') {
      return false;
    }

    if (typeof window.matchMedia === 'function') {
      return window.matchMedia('(max-width: 1023px)').matches;
    }

    return window.innerWidth < 1024;
  }

  private currentScrollY(): number {
    if (typeof window === 'undefined') {
      return 0;
    }

    return window.scrollY || document.documentElement.scrollTop || 0;
  }
}
