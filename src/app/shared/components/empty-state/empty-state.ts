import { Component, input } from '@angular/core';

@Component({
  selector: 'app-empty-state',
  template: `
    <div class="glass-panel flex flex-col items-center rounded-4xl px-6 py-14 text-center">
      <div class="flex h-14 w-14 items-center justify-center rounded-2xl border border-acid-400/20 bg-acid-400/10 text-xl text-acid-300">
        ◇
      </div>
      <h3 class="mt-5 text-lg font-semibold text-mist-50">{{ title() }}</h3>
      <p class="mt-2 max-w-md text-sm leading-6 text-mist-300">{{ message() }}</p>
      <div class="mt-6">
        <ng-content />
      </div>
    </div>
  `
})
export class EmptyState {
  readonly title = input('Nothing here yet');
  readonly message = input('Real content will appear here as soon as it is available.');
}
