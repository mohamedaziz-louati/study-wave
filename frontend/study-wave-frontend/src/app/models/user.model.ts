export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  profilePicture?: string;
  bio?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}

export enum Role {
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR',
  ADMIN = 'ADMIN'
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface JwtResponse {
  // Backend (JwtResponse) uses `getAccessToken()` -> serialized as `accessToken`
  accessToken: string;
  // Keep `token` optional for compatibility if backend response changes.
  token?: string;
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
}

export interface MessageResponse {
  message: string;
}
