import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, LoginRequest, SignupRequest, JwtResponse, Role } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Use relative URL so the Angular dev-server proxy can route to the backend.
  private readonly API_URL = '/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.loadUserFromStorage();
  }

  login(loginRequest: LoginRequest): Observable<JwtResponse> {
    return this.http.post<JwtResponse>(`${this.API_URL}/signin`, loginRequest)
      .pipe(
        tap(response => {
          const token = response.accessToken ?? response.token ?? '';
          localStorage.setItem('token', token);
          // Backend returns roles like "ROLE_STUDENT". Strip the prefix to match our Role enum values.
          const normalizedRoles = (response.roles ?? []).map(r =>
            r?.startsWith('ROLE_') ? r.slice('ROLE_'.length) : r
          );
          const role = (normalizedRoles.find(r => Object.values(Role).includes(r as Role)) ?? Role.STUDENT) as Role;
          const user: User = {
            id: response.id,
            username: response.username,
            email: response.email,
            firstName: response.firstName,
            lastName: response.lastName,
            role,
            createdAt: '',
            updatedAt: ''
          };
          this.currentUserSubject.next(user);
          localStorage.setItem('user', JSON.stringify(user));
        })
      );
  }

  register(signupRequest: SignupRequest): Observable<any> {
    return this.http.post(`${this.API_URL}/signup`, signupRequest);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isInstructor(): boolean {
    const user = this.getCurrentUser();
    return user?.role === Role.INSTRUCTOR || user?.role === Role.ADMIN;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === Role.ADMIN;
  }

  private loadUserFromStorage(): void {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      this.currentUserSubject.next(user);
    }
  }
}
