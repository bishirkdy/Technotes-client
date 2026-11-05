import { inject } from '@angular/core';
import {
  HttpContextToken,
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthService, SILENT_AUTH_CHECK } from './auth.service';

const REFRESH_ATTEMPTED = new HttpContextToken<boolean>(() => false);
const CSRF_HEADER = 'X-XSRF-TOKEN';
const SAFE_METHODS = new Set(['GET', 'HEAD', 'OPTIONS', 'TRACE']);

function isUnsafeMethod(method: string): boolean {
  return !SAFE_METHODS.has(method.toUpperCase());
}

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

  const withCredentialsAndCsrf = (request: HttpRequest<unknown>): HttpRequest<unknown> => {
    const headers: Record<string, string> = {};

    if (!isAnonymousAuth && isUnsafeMethod(request.method) && auth.csrfToken) {
      headers[CSRF_HEADER] = auth.csrfToken;
    }

    return request.clone({
      withCredentials: true,
      ...(Object.keys(headers).length > 0 ? { setHeaders: headers } : {})
    });
  };

  const handleUnauthorized = (request: HttpRequest<unknown>): void => {
    const silent = request.context.get(SILENT_AUTH_CHECK);
    auth.clearAuth();

    if (!silent && !router.url.startsWith('/login')) {
      void router.navigate(['/login'], {
        queryParams: { returnUrl: router.url }
      });
    }
  };

  const sendWithRefresh = (request: HttpRequest<unknown>): Observable<HttpEvent<unknown>> =>
    next(withCredentialsAndCsrf(request)).pipe(
      catchError((error: unknown) => {
        if (
          !(error instanceof HttpErrorResponse) ||
          error.status !== 401 ||
          isAnonymousAuth ||
          request.context.get(REFRESH_ATTEMPTED)
        ) {
          return throwError(() => error);
        }

        return auth.refreshToken().pipe(
          catchError((refreshError: unknown) => {
            if (refreshError instanceof HttpErrorResponse && refreshError.status === 401) {
              handleUnauthorized(request);
            }

            return throwError(() => refreshError);
          }),
          switchMap(() =>
            next(
              withCredentialsAndCsrf(
                request.clone({
                  context: request.context.set(REFRESH_ATTEMPTED, true)
                })
              )
            ).pipe(
              catchError((retryError: unknown) => {
                if (retryError instanceof HttpErrorResponse && retryError.status === 401) {
                  handleUnauthorized(request);
                }

                return throwError(() => retryError);
              })
            )
          )
        );
      })
    );

  if (
    !isAnonymousAuth &&
    isUnsafeMethod(req.method) &&
    auth.isUserLoggedIn() &&
    !auth.csrfToken
  ) {
    return auth.ensureCsrfToken().pipe(switchMap(() => sendWithRefresh(req)));
  }

  return sendWithRefresh(req);
};
