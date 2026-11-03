import { TestBed } from '@angular/core/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthResponse } from '../models/auth-response.model';
import { MeResponse } from '../models/me-response.model';
import { AuthService } from './auth.service';
import { httpInterceptor } from './http.interceptor';

describe('httpInterceptor', () => {
  let service: AuthService;
  let http: HttpTestingController;

  const authBase = `${environment.apiUrl}/auth`;
  const user: MeResponse = {
    userId: 'user-1',
    userName: 'bishir',
    email: 'bishir@example.com',
    roles: ['User']
  };
  const refreshed: AuthResponse = {
    accessToken: 'new-token',
    accessTokenExpiresAtUtc: '2030-01-01T00:00:00Z',
    userId: 'user-1',
    userName: 'bishir',
    email: 'bishir@example.com',
    roles: ['User']
  };

  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem('technotes_access_token', 'old-token');

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
    http.verify();
    localStorage.clear();
  });

  it('attaches the access token to the profile endpoint', () => {
    service.getMe().subscribe(result => expect(result).toEqual(user));

    const request = http.expectOne(`${authBase}/me`);
    expect(request.request.headers.get('Authorization')).toBe('Bearer old-token');
    expect(request.request.withCredentials).toBe(true);
    request.flush(user);
  });

  it('refreshes an expired token and retries the profile request', () => {
    service.getMe().subscribe(result => expect(result).toEqual(user));

    const profile = http.expectOne(`${authBase}/me`);
    profile.flush({}, { status: 401, statusText: 'Unauthorized' });

    const refresh = http.expectOne(`${authBase}/refresh`);
    expect(refresh.request.withCredentials).toBe(true);
    refresh.flush(refreshed);

    const retried = http.expectOne(`${authBase}/me`);
    expect(retried.request.headers.get('Authorization')).toBe('Bearer new-token');
    retried.flush(user);
  });

  it('clears the session when refreshing the profile token fails', () => {
    service.getMe().subscribe({ error: () => undefined });

    const profile = http.expectOne(`${authBase}/me`);
    profile.flush({}, { status: 401, statusText: 'Unauthorized' });

    const refresh = http.expectOne(`${authBase}/refresh`);
    refresh.flush({}, { status: 401, statusText: 'Unauthorized' });

    expect(service.accessToken).toBe('');
    expect(service.user).toBeNull();
  });
});
