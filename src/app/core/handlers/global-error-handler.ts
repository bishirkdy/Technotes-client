import { ErrorHandler, Injectable, inject } from '@angular/core';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private readonly notifications = inject(NotificationService);

  handleError(error: unknown): void {
    console.error(error);
    this.notifications.error(
      'An unexpected client error occurred. Reload the page if the problem continues.',
      'Application error'
    );
  }
}
