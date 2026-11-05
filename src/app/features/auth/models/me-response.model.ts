export interface MeResponse {
  userId: string | null;
  userName: string | null;
  email: string | null;
  roles: string[];
  accessTokenExpiresAtUtc: string | null;
  csrfToken: string;
}
