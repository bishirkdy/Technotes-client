import { Component, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  template: `
    <button
      type="button"
      class="icon-button"
      (click)="theme.toggle()"
      [attr.title]="theme.theme() === 'signal' ? 'Switch to mono' : 'Switch to signal'"
      [attr.aria-label]="theme.theme() === 'signal' ? 'Switch to mono theme' : 'Switch to signal theme'"
    >
      <span class="text-xs">{{ theme.theme() === 'signal' ? '◉' : '○' }}</span>
    </button>
  `
})
export class ThemeToggle {
  readonly theme = inject(ThemeService);
}
