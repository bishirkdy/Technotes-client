import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { NotificationService } from '../services/notification.service';

interface ApiProblem {
  title?: string;
  detail?: string;
  message?: string;
}

export const errorInterceptor: HttpInterceptorFn = (request, next) => {
  const notifications = inject(NotificationService);

  return next(request).pipe(
    catchError((error: unknown) => {
      if (error instanceof HttpErrorResponse && shouldNotify(request.url, error)) {
        notifications.error(extractMessage(error), extractTitle(error));
      }

      return throwError(() => error);
    })
  );
};

function shouldNotify(url: string, error: HttpErrorResponse): boolean {
  if (error.status === 0) {
    return true;
  }

  if (error.status === 401 || error.status === 499) {
    return false;
  }

  if (error.status === 403) {
    return true;
  }

  return !url.includes('/auth/');
}

function extractTitle(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'API unavailable';
  }

  const problem = error.error as ApiProblem | null;
  return problem?.title?.trim() || `Request failed (${error.status})`;
}

function extractMessage(error: HttpErrorResponse): string {
  if (error.status === 0) {
    return 'The API could not be reached. Check your connection and try again.';
  }

  const problem = error.error as ApiProblem | null;
  return problem?.detail?.trim()
    || problem?.message?.trim()
    || error.message
    || 'Please try again.';
}
