import { inject } from '@angular/core';
import {
  HttpContextToken,
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService } from './auth.service';

const REFRESH_ATTEMPTED = new HttpContextToken<boolean>(() => false);

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

  const request = isAnonymousAuth
    ? req
    : token
      ? req.clone({
          setHeaders: { Authorization: `Bearer ${token}` },
          withCredentials: true
        })
      : req.clone({ withCredentials: true });

  return next(request).pipe(
    catchError((error: unknown) => {
      if (
        !(error instanceof HttpErrorResponse) ||
        error.status !== 401 ||
        isAnonymousAuth ||
        req.context.get(REFRESH_ATTEMPTED)
      ) {
        return throwError(() => error);
      }

      return auth.refreshToken().pipe(
        catchError(refreshError => {
          auth.clearAuth();

          if (!router.url.startsWith('/login')) {
            void router.navigate(['/login'], {
              queryParams: { returnUrl: router.url }
            });
          }

          return throwError(() => refreshError);
        }),
        switchMap(response => {
          if (!response.accessToken) {
            return throwError(() => error);
          }

          return next(
            req.clone({
              setHeaders: { Authorization: `Bearer ${response.accessToken}` },
              withCredentials: true,
              context: req.context.set(REFRESH_ATTEMPTED, true)
            })
          );
        })
      );
    })
  );
};
