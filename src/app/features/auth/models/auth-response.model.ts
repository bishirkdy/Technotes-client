export interface AuthResponse {
  accessTokenExpiresAtUtc: string;
  csrfToken: string;
  userId: string;
  userName: string | null;
  email: string | null;
  roles: string[] | null;
}
