import { Injectable, computed, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private readonly pending = signal(0);
  readonly isLoading = computed(() => this.pending() > 0);

  begin(): void {
    this.pending.update(value => value + 1);
  }

  end(): void {
    this.pending.update(value => Math.max(0, value - 1));
  }
}
