import { Injectable, signal } from '@angular/core';

type Theme = 'mono' | 'signal';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly key = 'scribly_theme';
  private readonly current = signal<Theme>(this.read());

  readonly theme = this.current.asReadonly();

  constructor() {
    this.apply(this.current());
  }

  toggle(): void {
    const next: Theme = this.current() === 'signal' ? 'mono' : 'signal';
    this.current.set(next);

    try {
      localStorage.setItem(this.key, next);
    } catch {}

    this.apply(next);
  }

  private read(): Theme {
    try {
      return localStorage.getItem(this.key) === 'signal' ? 'signal' : 'mono';
    } catch {
      return 'mono';
    }
  }

  private apply(theme: Theme): void {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('theme-signal', theme === 'signal');
    }
  }
}
