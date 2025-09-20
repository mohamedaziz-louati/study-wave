import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../../services/auth.service';
import { SignupRequest } from '../../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
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
              <mat-icon>person_add</mat-icon>
              Join Study Wave
            </h1>
            <p class="auth-subtitle">Create your account and start learning today!</p>
          </div>
          
          <div class="auth-content">
            <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="auth-form">
              <div class="form-row">
                <div class="form-group">
                  <label for="firstName">First Name</label>
                  <input type="text" id="firstName" formControlName="firstName" placeholder="Enter your first name" required>
                </div>
                <div class="form-group">
                  <label for="lastName">Last Name</label>
                  <input type="text" id="lastName" formControlName="lastName" placeholder="Enter your last name" required>
                </div>
              </div>

              <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" formControlName="username" placeholder="Choose a username" required>
              </div>

              <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" formControlName="email" placeholder="Enter your email" required>
              </div>

              <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" formControlName="password" placeholder="Create a password" required>
              </div>

              <div class="form-group">
                <label for="confirmPassword">Confirm Password</label>
                <input type="password" id="confirmPassword" formControlName="confirmPassword" placeholder="Confirm your password" required>
              </div>

              <div class="form-group">
                <label for="role">Role</label>
                <select id="role" formControlName="role" required>
                  <option value="">Select your role</option>
                  <option value="STUDENT">Student</option>
                  <option value="INSTRUCTOR">Instructor</option>
                </select>
              </div>

              <div class="form-options">
                <label class="checkbox-label">
                  <input type="checkbox" formControlName="terms" required>
                  <span class="checkmark"></span>
                  I agree to the <a href="#terms">Terms of Service</a>
                </label>
              </div>

              <button type="submit" class="btn btn-primary btn-large full-width" 
                      [disabled]="registerForm.invalid || isLoading">
                <mat-icon *ngIf="isLoading">refresh</mat-icon>
                {{ isLoading ? 'Creating account...' : 'Create Account' }}
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
              <p>Already have an account? <a routerLink="/login">Sign in here</a></p>
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
      max-width: 500px;
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

    .form-row {
      display: flex;
      gap: 15px;
    }

    .form-group {
      margin-bottom: 20px;
      flex: 1;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
    }

    .form-group input,
    .form-group select {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }

    .form-group input:focus,
    .form-group select:focus {
      outline: none;
      border-color: #667eea;
    }

    .form-options {
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

    .checkbox-label a {
      color: #667eea;
      text-decoration: none;
    }

    .checkbox-label a:hover {
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

    @media (max-width: 600px) {
      .form-row {
        flex-direction: column;
      }
      
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
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      role: ['STUDENT', [Validators.required]],
      terms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');
    
    if (password && confirmPassword && password.value !== confirmPassword.value) {
      return { passwordMismatch: true };
    }
    
    return null;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const signupRequest: SignupRequest = {
        firstName: this.registerForm.value.firstName,
        lastName: this.registerForm.value.lastName,
        username: this.registerForm.value.username,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password
      };

      this.authService.register(signupRequest).subscribe({
        next: (response) => {
          this.isLoading = false;
          this.snackBar.open('Account created successfully! Please login.', 'Close', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/login']);
        },
        error: (error) => {
          this.isLoading = false;
          this.snackBar.open('Registration failed. Please try again.', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          console.error('Registration error:', error);
        }
      });
    }
  }
}