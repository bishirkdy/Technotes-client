import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpContext, HttpContextToken, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, finalize, map, of, shareReplay, tap, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthResponse } from '../models/auth-response.model';
import { LoginRequest } from '../models/login-request.model';
import { MeResponse } from '../models/me-response.model';
import { RegisterRequest } from '../models/register-request.model';

export const SILENT_AUTH_CHECK = new HttpContextToken<boolean>(() => false);

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private _authenticated = false;
  private _user: MeResponse | null = null;
  private _accessTokenExpiresAt = '';
  private _csrfToken = '';
  private refreshRequest$: Observable<AuthResponse> | null = null;
  private restoreRequest$: Observable<boolean> | null = null;
  private csrfRequest$: Observable<string> | null = null;
  private refreshTimer: ReturnType<typeof setTimeout> | null = null;

  get user(): MeResponse | null {
    return this._user;
  }

  get csrfToken(): string {
    return this._csrfToken;
  }

  get accessTokenExpiresAt(): string {
    return this._accessTokenExpiresAt;
  }

  isUserLoggedIn(): boolean {
    return this._authenticated;
  }

  get isAdmin(): boolean {
    return this._user?.roles?.some(role => role.toLowerCase() === 'admin') ?? false;
  }

  login(email: string, password: string): Observable<AuthResponse> {
    const request: LoginRequest = { email, password };
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/login`, request, { withCredentials: true })
      .pipe(tap(response => this.storeAuth(response)));
  }

  register(userName: string, email: string, password: string): Observable<AuthResponse> {
    const request: RegisterRequest = { userName, email, password };
    return this.http
      .post<AuthResponse>(`${this.apiUrl}/register`, request, { withCredentials: true })
      .pipe(tap(response => this.storeAuth(response)));
  }

  refreshToken(): Observable<AuthResponse> {
    if (this.refreshRequest$) {
      return this.refreshRequest$;
    }

    this.refreshRequest$ = this.http
      .post<AuthResponse>(`${this.apiUrl}/refresh`, {}, { withCredentials: true })
      .pipe(
        tap(response => this.storeAuth(response)),
        finalize(() => {
          this.refreshRequest$ = null;
        }),
        shareReplay(1)
      );

    return this.refreshRequest$;
  }

  restoreSession(): Observable<boolean> {
    if (this._authenticated) {
      return of(true);
    }

    if (this.restoreRequest$) {
      return this.restoreRequest$;
    }

    this.restoreRequest$ = this.getMe({ silent: true }).pipe(
      map(() => true),
      catchError(() => {
        this.clearAuth();
        return of(false);
      }),
      finalize(() => {
        this.restoreRequest$ = null;
      }),
      shareReplay(1)
    );

    return this.restoreRequest$;
  }

  getMe(options: { silent?: boolean } = {}): Observable<MeResponse> {
    const context = new HttpContext();
    if (options.silent) {
      context.set(SILENT_AUTH_CHECK, true);
    }

    return this.http
      .get<MeResponse>(`${this.apiUrl}/me`, { context, withCredentials: true })
      .pipe(
        tap(user => {
          this._authenticated = !!user.userId;
          this._user = user;
          this._accessTokenExpiresAt = user.accessTokenExpiresAtUtc ?? '';
          this._csrfToken = user.csrfToken ?? '';

          if (this._authenticated) {
            this.scheduleRefresh();
          } else {
            this.clearRefreshTimer();
          }
        })
      );
  }

  ensureCsrfToken(): Observable<string> {
    if (this._csrfToken) {
      return of(this._csrfToken);
    }

    if (!this._authenticated) {
      return throwError(() => new Error('No authenticated session is available.'));
    }

    if (this.csrfRequest$) {
      return this.csrfRequest$;
    }

    this.csrfRequest$ = this.getMe({ silent: true }).pipe(
      map(user => {
        if (!user.csrfToken) {
          throw new Error('The server did not return a CSRF token.');
        }

        return user.csrfToken;
      }),
      finalize(() => {
        this.csrfRequest$ = null;
      }),
      shareReplay(1)
    );

    return this.csrfRequest$;
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      finalize(() => this.clearAuth())
    );
  }

  clearAuth(): void {
    this._authenticated = false;
    this._user = null;
    this._accessTokenExpiresAt = '';
    this._csrfToken = '';
    this.refreshRequest$ = null;
    this.restoreRequest$ = null;
    this.csrfRequest$ = null;
    this.clearRefreshTimer();
  }

  private storeAuth(response: AuthResponse): void {
    this._authenticated = !!response.userId;
    this._user = {
      userId: response.userId,
      userName: response.userName,
      email: response.email,
      roles: response.roles ?? [],
      accessTokenExpiresAtUtc: response.accessTokenExpiresAtUtc,
      csrfToken: response.csrfToken
    };
    this._accessTokenExpiresAt = response.accessTokenExpiresAtUtc ?? '';
    this._csrfToken = response.csrfToken ?? '';
    this.scheduleRefresh();
  }

  private scheduleRefresh(): void {
    this.clearRefreshTimer();

    if (!this._authenticated || !this._accessTokenExpiresAt) {
      return;
    }

    const expiresAt = Date.parse(this._accessTokenExpiresAt);
    if (Number.isNaN(expiresAt)) {
      return;
    }

    const maxDelay = 2_147_483_647;
    const delay = Math.min(Math.max(expiresAt - Date.now() - 60_000, 0), maxDelay);
    if (delay <= 0) {
      return;
    }

    this.refreshTimer = setTimeout(() => {
      this.refreshTimer = null;

      if (!this._authenticated) {
        return;
      }

      this.refreshToken().subscribe({
        error: (error: unknown) => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            this.clearAuth();
          }
        }
      });
    }, delay);
  }

  private clearRefreshTimer(): void {
    if (this.refreshTimer !== null) {
      clearTimeout(this.refreshTimer);
      this.refreshTimer = null;
    }
  }
}
