export interface AuthCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
}

export interface AuthSession {
  accessToken: string;
  user: AuthUser;
}

interface LoginResponseData {
  userID: string;
  email: string;
  accessToken: string;
}

export interface LoginResponse {
  code: number;
  message: string;
  data: LoginResponseData | [] | null;
}
