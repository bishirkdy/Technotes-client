import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeToggle } from '../theme-toggle/theme-toggle';

@Component({
  selector: 'app-auth-shell',
  imports: [RouterLink, ThemeToggle],
  template: `
    <div class="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
      <aside class="relative hidden overflow-hidden border-r border-white/10 p-10 lg:flex lg:flex-col lg:justify-between xl:p-14">
        <a routerLink="/" class="relative z-10 flex items-center gap-3">
          <img src="logo.png" alt="" class="h-11 w-auto" />
          <span class="text-lg font-semibold tracking-[-0.03em] text-mist-50">Scribly</span>
        </a>

        <div class="relative z-10 max-w-xl">
          <p class="eyebrow">A quiet reading room</p>
          <p class="mt-6 text-5xl font-semibold leading-[0.98] tracking-[-0.055em] text-mist-50 xl:text-6xl">
            Read deeply.
            <span class="text-gradient">Remember more.</span>
          </p>
          <p class="mt-6 max-w-md text-sm leading-7 text-mist-300">
            Structured notes, clean typography, and your place saved across every device.
          </p>

          <ul class="mt-10 space-y-3 text-sm text-mist-300">
            <li class="flex items-center gap-3">
              <span class="h-1.5 w-1.5 rounded-full bg-acid-400"></span>
              Track how far you have read
            </li>
            <li class="flex items-center gap-3">
              <span class="h-1.5 w-1.5 rounded-full bg-cyan-300"></span>
              Keep a personal shelf of favorites
            </li>
            <li class="flex items-center gap-3">
              <span class="h-1.5 w-1.5 rounded-full bg-mist-400"></span>
              Switch between mono and signal
            </li>
          </ul>
        </div>

        <p class="relative z-10 text-xs text-mist-500">© {{ year }} Scribly</p>

        <div class="pointer-events-none absolute -right-24 top-20 h-80 w-80 rounded-full border border-acid-400/15"></div>
        <div class="pointer-events-none absolute -right-10 top-36 h-56 w-56 rounded-[3rem] border border-dashed border-white/10"></div>
        <div class="pointer-events-none absolute bottom-10 right-16 h-40 w-40 rounded-full bg-cyan-300/[0.06] blur-3xl"></div>
      </aside>

      <main class="relative flex min-h-screen items-center justify-center px-4 py-10 sm:px-6">
        <div class="absolute right-4 top-4 sm:right-6">
          <app-theme-toggle />
        </div>
        <div class="w-full max-w-md">
          <a routerLink="/" class="mb-8 flex items-center gap-3 lg:hidden">
            <img src="logo.png" alt="" class="h-10 w-auto" />
            <span class="text-base font-semibold tracking-[-0.03em] text-mist-50">Scribly</span>
          </a>

          <div class="glass-panel rounded-4xl p-6 sm:p-8">
            <p class="eyebrow">{{ eyebrow() }}</p>
            <h1 class="mt-4 text-3xl font-semibold tracking-[-0.04em] text-mist-50">{{ title() }}</h1>
            <p class="mt-2 text-sm leading-6 text-mist-400">{{ subtitle() }}</p>
            <div class="mt-7">
              <ng-content />
            </div>
          </div>
        </div>
      </main>
    </div>
  `
})
export class AuthShell {
  readonly eyebrow = input('');
  readonly title = input('');
  readonly subtitle = input('');
  readonly year = new Date().getFullYear();
}
