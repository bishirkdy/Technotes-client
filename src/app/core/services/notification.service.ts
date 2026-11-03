import { Injectable, signal } from '@angular/core';

export type NotificationKind = 'error' | 'success' | 'info';

export interface AppNotification {
  id: number;
  kind: NotificationKind;
  title: string;
  message?: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private nextId = 1;
  private readonly items = signal<AppNotification[]>([]);
  readonly notifications = this.items.asReadonly();

  show(kind: NotificationKind, title: string, message?: string): number {
    const id = this.nextId++;
    this.items.update(items => [...items, { id, kind, title, message }].slice(-4));

    if (typeof window !== 'undefined') {
      window.setTimeout(() => this.dismiss(id), kind === 'error' ? 7000 : 4500);
    }

    return id;
  }

  success(message: string, title = 'Saved'): number {
    return this.show('success', title, message);
  }

  info(message: string, title = 'Heads up'): number {
    return this.show('info', title, message);
  }

  error(message: string, title = 'Something went wrong'): number {
    return this.show('error', title, message);
  }

  dismiss(id: number): void {
    this.items.update(items => items.filter(item => item.id !== id));
  }

  clear(): void {
    this.items.set([]);
  }
}
