import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface AuthResponse {
  accessToken: string | null;
  accessTokenExpiresAtUtc: string;
  userId: string;
  userName: string | null;
  email: string | null;
  roles: string[] | null;
}

export interface MeResponse {
  userId: string | null;
  userName: string | null;
  email: string | null;
  roles: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly tokenKey = 'technotes_access_token';
  private readonly userKey = 'technotes_user';

  private _accessToken = this.readToken();
  private _user = this.readUser();

  get accessToken(): string {
    return this._accessToken;
  }

  get user(): MeResponse | null {
    return this._user;
  }

  isUserLoggedIn(): boolean {
    return !!this._accessToken;
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }, { withCredentials: true }).pipe(
      tap(response => this.storeAuth(response))
    );
  }

  register(userName: string, email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { userName, email, password }, { withCredentials: true }).pipe(
      tap(response => this.storeAuth(response))
    );
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh`, {}, { withCredentials: true }).pipe(
      tap(response => this.storeAuth(response))
    );
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
      tap(() => this.clearAuth())
    );
  }

  clearAuth(): void {
    this._accessToken = '';
    this._user = null;
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
    if (typeof localStorage === 'undefined') return null;
    const value = localStorage.getItem(this.userKey);
    if (!value) return null;
    try { return JSON.parse(value) as MeResponse; } catch { return null; }
  }

  private persistUser(user: MeResponse): void {
    if (typeof localStorage !== 'undefined') localStorage.setItem(this.userKey, JSON.stringify(user));
  }
}
