import { inject } from '@angular/core';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from './auth.service';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const authBase = `${environment.apiUrl}/auth`;
  const anonymousAuthEndpoints = new Set([
    `${authBase}/login`,
    `${authBase}/register`,
    `${authBase}/refresh`
  ]);
  const isAnonymousAuth = anonymousAuthEndpoints.has(req.url);
  const token = auth.accessToken;

  const request = !isAnonymousAuth && token
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${token}` },
        withCredentials: true
      })
    : req;

  return next(request).pipe(
    catchError((error: unknown) => {
      if (!(error instanceof HttpErrorResponse) || error.status !== 401 || isAnonymousAuth || !token) {
        return throwError(() => error);
      }

      return auth.refreshToken().pipe(
        switchMap(response => {
          if (!response.accessToken) {
            return throwError(() => error);
          }

          return next(
            req.clone({
              setHeaders: { Authorization: `Bearer ${response.accessToken}` },
              withCredentials: true
            })
          );
        }),
        catchError(refreshError => {
          auth.clearAuth();

          if (!router.url.startsWith('/login')) {
            void router.navigate(['/login'], {
              queryParams: { returnUrl: router.url }
            });
          }

          return throwError(() => refreshError);
        })
      );
    })
  );
};
