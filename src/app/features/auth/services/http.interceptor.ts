import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const isAuthEndpoint = req.url.includes('/api/v1/auth/');
  const isRefresh = req.url.endsWith('/auth/refresh');

  const authenticatedRequest = !isAuthEndpoint && !!auth.accessToken;
  const request = authenticatedRequest
    ? req.clone({ setHeaders: { Authorization: `Bearer ${auth.accessToken}` }, withCredentials: true })
    : req;

  return next(request).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse) || error.status !== 401 || isAuthEndpoint || isRefresh || !auth.accessToken) {
        return throwError(() => error);
      }

      return auth.refreshToken().pipe(
        switchMap(response => {
          if (!response.accessToken) return throwError(() => error);
          return next(req.clone({ setHeaders: { Authorization: `Bearer ${response.accessToken}` }, withCredentials: true }));
        }),
        catchError(refreshError => {
          auth.clearAuth();
          return throwError(() => refreshError);
        })
      );
    })
  );
};
