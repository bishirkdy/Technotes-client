import { Component, inject } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-global-feedback',
  templateUrl: './global-feedback.html'
})
export class GlobalFeedback {
  readonly loading = inject(LoadingService);
  readonly notifications = inject(NotificationService);
}
