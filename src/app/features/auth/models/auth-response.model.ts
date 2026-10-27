export interface AuthResponse {
  accessToken: string | null;
  accessTokenExpiresAtUtc: string;
  userId: string;
  userName: string | null;
  email: string | null;
  roles: string[] | null;
}
