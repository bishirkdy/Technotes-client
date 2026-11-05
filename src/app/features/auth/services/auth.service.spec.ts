import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { AuthService, SILENT_AUTH_CHECK } from './auth.service';
import { AuthResponse } from '../models/auth-response.model';
import { MeResponse } from '../models/me-response.model';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  const authBase = `${environment.apiUrl}/auth`;
  const futureExpiry = () => new Date(Date.now() + 15 * 60 * 1000).toISOString();

  const response: AuthResponse = {
    accessTokenExpiresAtUtc: futureExpiry(),
    csrfToken: 'csrf-token',
    userId: 'user-1',
    userName: 'bishir',
    email: 'bishir@example.com',
    roles: ['User']
  };

  const meResponse: MeResponse = {
    userId: 'user-1',
    userName: 'bishir',
    email: 'bishir@example.com',
    roles: ['User'],
    accessTokenExpiresAtUtc: futureExpiry(),
    csrfToken: 'csrf-token'
  };

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()]
    });

    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    service.clearAuth();
    http.verify();
    localStorage.clear();
  });

  const signIn = (overrides: Partial<AuthResponse> = {}): void => {
    service.login('bishir@example.com', 'password123').subscribe();
    http.expectOne(`${authBase}/login`).flush({ ...response, ...overrides });
  };

  it('stores the user and CSRF token in memory after login', () => {
    service.login('bishir@example.com', 'password123').subscribe();

    const request = http.expectOne(`${authBase}/login`);
    expect(request.request.withCredentials).toBe(true);
    request.flush(response);

    expect(service.isUserLoggedIn()).toBe(true);
    expect(service.user?.email).toBe('bishir@example.com');
    expect(service.csrfToken).toBe('csrf-token');
    expect(service.accessTokenExpiresAt).toBe(response.accessTokenExpiresAtUtc);
    expect(localStorage.getItem('technotes_access_token')).toBeNull();
    expect(localStorage.getItem('technotes_user')).toBeNull();
  });

  it('shares one refresh request between concurrent callers', () => {
    service.refreshToken().subscribe();
    service.refreshToken().subscribe();

    const requests = http.match(`${authBase}/refresh`);
    expect(requests.length).toBe(1);

    requests[0].flush(response);

    expect(service.isUserLoggedIn()).toBe(true);
    expect(service.csrfToken).toBe('csrf-token');
  });

  it('clears the in-memory session', () => {
    signIn();
    service.clearAuth();

    expect(service.isUserLoggedIn()).toBe(false);
    expect(service.user).toBeNull();
    expect(service.csrfToken).toBe('');
    expect(service.accessTokenExpiresAt).toBe('');
  });

  it('restores a session from the auth cookie through the profile endpoint', () => {
    let restored = false;

    service.restoreSession().subscribe(value => {
      restored = value;
    });

    const request = http.expectOne(`${authBase}/me`);
    expect(request.request.withCredentials).toBe(true);
    expect(request.request.context.get(SILENT_AUTH_CHECK)).toBe(true);
    request.flush(meResponse);

    expect(restored).toBe(true);
    expect(service.isUserLoggedIn()).toBe(true);
    expect(service.user?.email).toBe('bishir@example.com');
    expect(service.csrfToken).toBe('csrf-token');
  });

  it('returns false and clears auth when the auth cookie cannot restore a session', () => {
    let restored = true;

    service.restoreSession().subscribe(value => {
      restored = value;
    });

    http.expectOne(`${authBase}/me`)
      .flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(restored).toBe(false);
    expect(service.isUserLoggedIn()).toBe(false);
    expect(service.user).toBeNull();
  });

  it('fetches a fresh CSRF token from the profile endpoint when it is missing', () => {
    signIn({ csrfToken: '' });
    let token = '';

    service.ensureCsrfToken().subscribe(value => {
      token = value;
    });

    const request = http.expectOne(`${authBase}/me`);
    request.flush({ ...meResponse, csrfToken: 'csrf-token-2' });

    expect(token).toBe('csrf-token-2');
    expect(service.csrfToken).toBe('csrf-token-2');
  });
});
