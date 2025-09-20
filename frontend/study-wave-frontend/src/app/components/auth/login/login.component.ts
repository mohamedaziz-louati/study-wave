import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';
import { LoginRequest } from '../../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <section class="auth-section">
      <div class="auth-container">
        <div class="auth-card">
          <div class="auth-header">
            <h1 class="auth-title">
              <mat-icon>login</mat-icon>
              Sign In to Study Wave
            </h1>
            <p class="auth-subtitle">Welcome back! Please sign in to your account.</p>
          </div>
          
          <div class="auth-content">
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="auth-form">
              <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" formControlName="username" placeholder="Enter your username" required>
              </div>

              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" formControlName="password" placeholder="Enter your password" required>
              </div>

              <div class="form-options">
                <label class="checkbox-label">
                  <input type="checkbox" formControlName="remember">
                  <span class="checkmark"></span>
                  Remember me
                </label>
                <a href="#forgot" class="forgot-link">Forgot password?</a>
              </div>

              <button type="submit" class="btn btn-primary btn-large full-width" 
                      [disabled]="loginForm.invalid || isLoading">
                <mat-icon *ngIf="isLoading">refresh</mat-icon>
                {{ isLoading ? 'Signing in...' : 'Sign In' }}
              </button>
            </form>

            <div class="auth-divider">
              <span>or</span>
            </div>

            <div class="social-auth">
              <button class="btn btn-social google">
                <mat-icon>account_circle</mat-icon>
                Continue with Google
              </button>
              <button class="btn btn-social facebook">
                <mat-icon>facebook</mat-icon>
                Continue with Facebook
              </button>
            </div>

            <div class="auth-footer">
              <p>Don't have an account? <a routerLink="/register">Sign up here</a></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .auth-section {
      min-height: calc(100vh - 80px);
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
    }

    .auth-container {
      width: 100%;
      max-width: 400px;
    }

    .auth-card {
      background: white;
      border-radius: 16px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .auth-header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 30px;
      text-align: center;
    }

    .auth-title {
      font-size: 1.8rem;
      font-weight: bold;
      margin: 0 0 10px 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .auth-subtitle {
      margin: 0;
      opacity: 0.9;
      font-size: 1rem;
    }

    .auth-content {
      padding: 40px 30px;
    }

    .auth-form {
      margin-bottom: 30px;
    }

    .form-group {
      margin-bottom: 20px;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
    }

    .form-group input {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }

    .form-group input:focus {
      outline: none;
      border-color: #667eea;
    }

    .form-options {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 25px;
    }

    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 8px;
      cursor: pointer;
      font-size: 0.9rem;
      color: #666;
    }

    .forgot-link {
      color: #667eea;
      text-decoration: none;
      font-size: 0.9rem;
    }

    .forgot-link:hover {
      text-decoration: underline;
    }

    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 24px;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;
      text-decoration: none;
      text-align: center;
    }

    .btn-primary {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3);
    }

    .btn-large {
      padding: 14px 24px;
      font-size: 1.1rem;
    }

    .full-width {
      width: 100%;
    }

    .auth-divider {
      text-align: center;
      margin: 30px 0;
      position: relative;
    }

    .auth-divider::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: #ddd;
    }

    .auth-divider span {
      background: white;
      padding: 0 20px;
      color: #666;
      font-size: 0.9rem;
    }

    .social-auth {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 30px;
    }

    .btn-social {
      background: #f8f9fa;
      color: #333;
      border: 1px solid #ddd;
    }

    .btn-social:hover {
      background: #e9ecef;
    }

    .btn-social.google {
      background: #db4437;
      color: white;
      border-color: #db4437;
    }

    .btn-social.facebook {
      background: #3b5998;
      color: white;
      border-color: #3b5998;
    }

    .auth-footer {
      text-align: center;
    }

    .auth-footer p {
      margin: 0;
      color: #666;
    }

    .auth-footer a {
      color: #667eea;
      text-decoration: none;
      font-weight: 500;
    }

    .auth-footer a:hover {
      text-decoration: underline;
    }

    @media (max-width: 480px) {
      .auth-section {
        padding: 20px 10px;
      }
      
      .auth-header {
        padding: 30px 20px;
      }
      
      .auth-content {
        padding: 30px 20px;
      }
    }
  `]
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      remember: [false]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const loginRequest: LoginRequest = this.loginForm.value;

      this.authService.login(loginRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open('Login successful!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open('Login failed. Please check your credentials.', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          console.error('Login error:', error);
        }
      });
    }
  }
}
