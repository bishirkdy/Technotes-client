import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, finalize, shareReplay, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthResponse } from '../models/auth-response.model';
import { LoginRequest } from '../models/login-request.model';
import { MeResponse } from '../models/me-response.model';
import { RegisterRequest } from '../models/register-request.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly tokenKey = 'technotes_access_token';
  private readonly userKey = 'technotes_user';

  private _accessToken = this.readToken();
  private _user = this.readUser();
  private refreshRequest$: Observable<AuthResponse> | null = null;

  get accessToken(): string {
    return this._accessToken;
  }

  get user(): MeResponse | null {
    return this._user;
  }

  isUserLoggedIn(): boolean {
    return !!this._accessToken;
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

  // The backend rotates the refresh token, so parallel 401s must share one request.
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

  getMe(): Observable<MeResponse> {
    return this.http.get<MeResponse>(`${this.apiUrl}/me`).pipe(
      tap(user => {
        this._user = user;
        this.persistUser(user);
      })
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      finalize(() => this.clearAuth())
    );
  }

  clearAuth(): void {
    this._accessToken = '';
    this._user = null;
    this.refreshRequest$ = null;

    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.tokenKey);
      localStorage.removeItem(this.userKey);
    }
  }

  private storeAuth(response: AuthResponse): void {
    this._accessToken = response.accessToken ?? '';
    this._user = {
      userId: response.userId,
      userName: response.userName,
      email: response.email,
      roles: response.roles ?? []
    };

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.tokenKey, this._accessToken);
      localStorage.setItem(this.userKey, JSON.stringify(this._user));
    }
  }

  private readToken(): string {
    return typeof localStorage === 'undefined' ? '' : localStorage.getItem(this.tokenKey) ?? '';
  }

  private readUser(): MeResponse | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const value = localStorage.getItem(this.userKey);
    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value) as MeResponse;
    } catch {
      localStorage.removeItem(this.userKey);
      return null;
    }
  }

  private persistUser(user: MeResponse): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.userKey, JSON.stringify(user));
    }
  }
}
