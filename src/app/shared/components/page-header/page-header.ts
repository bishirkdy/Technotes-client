import { Component, input } from '@angular/core';

@Component({
  selector: 'app-page-header',
  template: `
    <header class="flex flex-col gap-6 border-b border-white/10 pb-8 md:flex-row md:items-end md:justify-between">
      <div class="max-w-3xl">
        @if (eyebrow()) {
          <p class="eyebrow">{{ eyebrow() }}</p>
        }
        <h1 class="mt-4 text-4xl font-semibold tracking-[-0.045em] text-mist-50 sm:text-5xl">
          {{ title() }}
        </h1>
        @if (description()) {
          <p class="mt-3 max-w-2xl text-sm leading-7 text-mist-300 sm:text-base">{{ description() }}</p>
        }
      </div>
      <div class="flex shrink-0 flex-wrap items-center gap-3">
        <ng-content />
      </div>
    </header>
  `
})
export class PageHeader {
  readonly eyebrow = input('');
  readonly title = input('');
  readonly description = input('');
}
