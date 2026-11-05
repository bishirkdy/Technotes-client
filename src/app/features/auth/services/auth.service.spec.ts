import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { environment } from '../../../../environments/environment';
import { AuthService } from './auth.service';
import { AuthResponse } from '../models/auth-response.model';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  const response: AuthResponse = {
    accessToken: 'access-token',
    accessTokenExpiresAtUtc: '2030-01-01T00:00:00Z',
    userId: 'user-1',
    userName: 'bishir',
    email: 'bishir@example.com',
    roles: ['User']
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
    http.verify();
    localStorage.clear();
  });

  it('stores the access token and user after login', () => {
    service.login('bishir@example.com', 'password123').subscribe();

    const request = http.expectOne(`${environment.apiUrl}/auth/login`);
    expect(request.request.withCredentials).toBe(true);
    request.flush(response);

    expect(service.accessToken).toBe('access-token');
    expect(service.user?.email).toBe('bishir@example.com');
    expect(service.isUserLoggedIn()).toBe(true);
  });

  it('shares one refresh request between concurrent callers', () => {
    service.refreshToken().subscribe();
    service.refreshToken().subscribe();

    const requests = http.match(`${environment.apiUrl}/auth/refresh`);
    expect(requests.length).toBe(1);

    requests[0].flush(response);
    expect(service.accessToken).toBe('access-token');
  });

  it('clears the stored session', () => {
    service.login('bishir@example.com', 'password123').subscribe();
    http.expectOne(`${environment.apiUrl}/auth/login`).flush(response);

    service.clearAuth();

    expect(service.accessToken).toBe('');
    expect(service.user).toBeNull();
    expect(localStorage.getItem('technotes_access_token')).toBeNull();
  });

  it('restores a session from the refresh cookie when no access token exists', () => {
    service.clearAuth();
    let restored = false;

    service.restoreSession().subscribe(value => {
      restored = value;
    });

    const request = http.expectOne(`${environment.apiUrl}/auth/refresh`);
    expect(request.request.withCredentials).toBe(true);
    request.flush(response);

    expect(restored).toBe(true);
    expect(service.accessToken).toBe('access-token');
    expect(service.isUserLoggedIn()).toBe(true);
  });

  it('returns false and clears auth when the refresh cookie cannot restore a session', () => {
    service.clearAuth();
    let restored = true;

    service.restoreSession().subscribe(value => {
      restored = value;
    });

    http.expectOne(`${environment.apiUrl}/auth/refresh`)
      .flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(restored).toBe(false);
    expect(service.accessToken).toBe('');
    expect(service.user).toBeNull();
  });
});
