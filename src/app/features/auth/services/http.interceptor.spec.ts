import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { vi } from 'vitest';
import { environment } from '../../../../environments/environment';
import { AuthResponse } from '../models/auth-response.model';
import { MeResponse } from '../models/me-response.model';
import { AuthService, SILENT_AUTH_CHECK } from './auth.service';
import { httpInterceptor } from './http.interceptor';

describe('httpInterceptor', () => {
  let service: AuthService;
  let http: HttpTestingController;

  const authBase = `${environment.apiUrl}/auth`;
  const futureExpiry = () => new Date(Date.now() + 15 * 60 * 1000).toISOString();

  const meResponse: MeResponse = {
    userId: 'user-1',
    userName: 'bishir',
    email: 'bishir@example.com',
    roles: ['User'],
    accessTokenExpiresAtUtc: futureExpiry(),
    csrfToken: 'csrf-token'
  };

  const authResponse: AuthResponse = {
    accessTokenExpiresAtUtc: futureExpiry(),
    csrfToken: 'csrf-token',
    userId: 'user-1',
    userName: 'bishir',
    email: 'bishir@example.com',
    roles: ['User']
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        provideHttpClient(withInterceptors([httpInterceptor])),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    service.clearAuth();
    http.verify();
  });

  const signIn = (csrfToken = 'csrf-token'): void => {
    service.login('bishir@example.com', 'password123').subscribe();
    http.expectOne(`${authBase}/login`).flush({ ...authResponse, csrfToken });
  };

  it('sends cookie credentials without an Authorization header', () => {
    signIn();
    service.getMe().subscribe(result => expect(result).toEqual(meResponse));

    const request = http.expectOne(`${authBase}/me`);
    expect(request.request.headers.has('Authorization')).toBe(false);
    expect(request.request.withCredentials).toBe(true);
    request.flush(meResponse);
  });

  it('adds the CSRF header to unsafe authenticated requests', () => {
    signIn();
    service.logout().subscribe();

    const request = http.expectOne(`${authBase}/logout`);
    expect(request.request.headers.get('X-XSRF-TOKEN')).toBe('csrf-token');
    expect(request.request.withCredentials).toBe(true);
    request.flush(null, { status: 204, statusText: 'No Content' });
  });

  it('fetches a missing CSRF token before sending an unsafe request', () => {
    signIn('');
    service.logout().subscribe();

    const profile = http.expectOne(`${authBase}/me`);
    profile.flush({ ...meResponse, csrfToken: 'csrf-token-2' });

    const request = http.expectOne(`${authBase}/logout`);
    expect(request.request.headers.get('X-XSRF-TOKEN')).toBe('csrf-token-2');
    request.flush(null, { status: 204, statusText: 'No Content' });
  });

  it('refreshes an expired cookie session and retries the profile request', () => {
    service.getMe().subscribe(result => expect(result).toEqual(meResponse));

    const profile = http.expectOne(`${authBase}/me`);
    profile.flush({}, { status: 401, statusText: 'Unauthorized' });

    const refresh = http.expectOne(`${authBase}/refresh`);
    expect(refresh.request.withCredentials).toBe(true);
    refresh.flush(authResponse);

    const retried = http.expectOne(`${authBase}/me`);
    expect(retried.request.headers.has('Authorization')).toBe(false);
    expect(retried.request.withCredentials).toBe(true);
    retried.flush(meResponse);
  });

  it('keeps the refreshed session when the retried request fails', () => {
    service.getMe().subscribe({ error: () => undefined });

    const profile = http.expectOne(`${authBase}/me`);
    profile.flush({}, { status: 401, statusText: 'Unauthorized' });

    const refresh = http.expectOne(`${authBase}/refresh`);
    refresh.flush(authResponse);

    const retried = http.expectOne(`${authBase}/me`);
    retried.flush({}, { status: 500, statusText: 'Server Error' });

    expect(service.isUserLoggedIn()).toBe(true);
    expect(service.user).not.toBeNull();
  });

  it('clears the session when the retried request is unauthorized', () => {
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);

    signIn();
    service.getMe().subscribe({ error: () => undefined });

    const profile = http.expectOne(`${authBase}/me`);
    profile.flush({}, { status: 401, statusText: 'Unauthorized' });

    const refresh = http.expectOne(`${authBase}/refresh`);
    refresh.flush(authResponse);

    const retried = http.expectOne(`${authBase}/me`);
    retried.flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(service.isUserLoggedIn()).toBe(false);
    expect(service.user).toBeNull();
    expect(navigate).toHaveBeenCalledWith(['/login'], { queryParams: { returnUrl: '/' } });
  });

  it('clears the session when refreshing with cookies fails', () => {
    service.getMe().subscribe({ error: () => undefined });

    const profile = http.expectOne(`${authBase}/me`);
    profile.flush({}, { status: 401, statusText: 'Unauthorized' });

    const refresh = http.expectOne(`${authBase}/refresh`);
    refresh.flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(service.isUserLoggedIn()).toBe(false);
    expect(service.user).toBeNull();
  });

  it('keeps the session when a refresh fails due to a network error', () => {
    signIn();
    service.getMe().subscribe({ error: () => undefined });

    const profile = http.expectOne(`${authBase}/me`);
    profile.flush({}, { status: 401, statusText: 'Unauthorized' });

    const refresh = http.expectOne(`${authBase}/refresh`);
    refresh.flush({}, { status: 0, statusText: 'Unknown Error' });

    expect(service.isUserLoggedIn()).toBe(true);
    expect(service.user).not.toBeNull();
  });

  it('does not redirect when a silent session restore fails', () => {
    const router = TestBed.inject(Router);
    const navigate = vi.spyOn(router, 'navigate').mockResolvedValue(true);
    let restored = true;

    service.restoreSession().subscribe(value => {
      restored = value;
    });

    const profile = http.expectOne(`${authBase}/me`);
    expect(profile.request.context.get(SILENT_AUTH_CHECK)).toBe(true);
    profile.flush({}, { status: 401, statusText: 'Unauthorized' });

    const refresh = http.expectOne(`${authBase}/refresh`);
    refresh.flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(restored).toBe(false);
    expect(navigate).not.toHaveBeenCalled();
  });
});
