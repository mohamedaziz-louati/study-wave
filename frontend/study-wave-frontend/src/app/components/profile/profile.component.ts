import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatSnackBarModule
  ],
  template: `
    <section class="profile-section">
      <div class="container">
        <div class="profile-header">
          <div class="profile-avatar-section">
            <div class="profile-avatar">
              <img [src]="getUserAvatar()" [alt]="getUserName()" (error)="onImageError($event)">
              <div class="avatar-fallback" *ngIf="!currentUser?.profilePicture">👤</div>
              <button class="avatar-edit-btn" mat-icon-button>
                <mat-icon>camera_alt</mat-icon>
              </button>
            </div>
          </div>
          <div class="profile-info">
            <h1 class="profile-name">{{ getUserName() }}</h1>
            <p class="profile-title">{{ currentUser?.role }}</p>
            <p class="profile-email">{{ currentUser?.email }}</p>
            <div class="profile-stats">
              <div class="stat">
                <span class="stat-number">12</span>
                <span class="stat-label">Courses</span>
              </div>
              <div class="stat">
                <span class="stat-number">8</span>
                <span class="stat-label">Completed</span>
              </div>
              <div class="stat">
                <span class="stat-number">4</span>
                <span class="stat-label">In Progress</span>
              </div>
            </div>
          </div>
        </div>

        <mat-tab-group class="profile-tabs">
          <mat-tab label="Personal Info">
            <div class="tab-panel">
              <div class="profile-card">
                <div class="card-header">
                  <h3>Personal Information</h3>
                  <button mat-button color="primary" (click)="editMode = !editMode">
                    {{ editMode ? 'Cancel' : 'Edit' }}
                  </button>
                </div>
                <div class="card-content">
                  <form [formGroup]="profileForm" *ngIf="editMode; else viewMode" class="profile-form">
                    <div class="form-row">
                      <div class="form-group">
                        <label for="firstName">First Name</label>
                        <input type="text" id="firstName" formControlName="firstName" required>
                      </div>
                      <div class="form-group">
                        <label for="lastName">Last Name</label>
                        <input type="text" id="lastName" formControlName="lastName" required>
                      </div>
                    </div>
                    
                    <div class="form-group">
                      <label for="email">Email</label>
                      <input type="email" id="email" formControlName="email" required>
                    </div>
                    
                    <div class="form-group">
                      <label for="bio">Bio</label>
                      <textarea id="bio" formControlName="bio" rows="4" placeholder="Tell us about yourself"></textarea>
                    </div>
                    
                    <div class="form-group">
                      <label for="location">Location</label>
                      <input type="text" id="location" formControlName="location" placeholder="City, Country">
                    </div>
                    
                    <div class="form-actions">
                      <button type="button" mat-button (click)="editMode = false">Cancel</button>
                      <button type="submit" mat-raised-button color="primary" [disabled]="profileForm.invalid">
                        Save Changes
                      </button>
                    </div>
                  </form>
                  
                  <ng-template #viewMode>
                    <div class="info-grid">
                      <div class="info-item">
                        <label>First Name</label>
                        <span>{{ currentUser?.firstName }}</span>
                      </div>
                      <div class="info-item">
                        <label>Last Name</label>
                        <span>{{ currentUser?.lastName }}</span>
                      </div>
                      <div class="info-item">
                        <label>Email</label>
                        <span>{{ currentUser?.email }}</span>
                      </div>
                      <div class="info-item">
                        <label>Bio</label>
                        <span>{{ currentUser?.bio || 'No bio provided' }}</span>
                      </div>
                      <div class="info-item">
                        <label>Location</label>
                        <span>{{ currentUser?.location || 'Not specified' }}</span>
                      </div>
                      <div class="info-item">
                        <label>Member Since</label>
                        <span>{{ currentUser?.createdAt | date:'mediumDate' }}</span>
                      </div>
                    </div>
                  </ng-template>
                </div>
              </div>
            </div>
          </mat-tab>

          <mat-tab label="Security">
            <div class="tab-panel">
              <div class="profile-card">
                <div class="card-header">
                  <h3>Security Settings</h3>
                </div>
                <div class="card-content">
                  <div class="security-options">
                    <div class="option-item">
                      <div class="option-info">
                        <h4>Change Password</h4>
                        <p>Update your password to keep your account secure</p>
                      </div>
                      <button mat-button color="primary">Change Password</button>
                    </div>
                    
                    <div class="option-item">
                      <div class="option-info">
                        <h4>Two-Factor Authentication</h4>
                        <p>Add an extra layer of security to your account</p>
                      </div>
                      <div class="switch">
                        <input type="checkbox" id="2fa">
                        <label for="2fa" class="slider"></label>
                      </div>
                    </div>
                    
                    <div class="option-item">
                      <div class="option-info">
                        <h4>Login Notifications</h4>
                        <p>Get notified when someone logs into your account</p>
                      </div>
                      <div class="switch">
                        <input type="checkbox" id="notifications" checked>
                        <label for="notifications" class="slider"></label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </mat-tab>

          <mat-tab label="Preferences">
            <div class="tab-panel">
              <div class="profile-card">
                <div class="card-header">
                  <h3>Preferences</h3>
                </div>
                <div class="card-content">
                  <div class="preferences-section">
                    <div class="option-item">
                      <div class="option-info">
                        <h4>Email Notifications</h4>
                        <p>Receive updates about your courses and account</p>
                      </div>
                      <div class="switch">
                        <input type="checkbox" id="email-notifications" checked>
                        <label for="email-notifications" class="slider"></label>
                      </div>
                    </div>
                    
                    <div class="option-item">
                      <div class="option-info">
                        <h4>Course Recommendations</h4>
                        <p>Get personalized course suggestions</p>
                      </div>
                      <div class="switch">
                        <input type="checkbox" id="recommendations" checked>
                        <label for="recommendations" class="slider"></label>
                      </div>
                    </div>
                    
                    <div class="option-item">
                      <div class="option-info">
                        <h4>Dark Mode</h4>
                        <p>Switch to dark theme for better viewing</p>
                      </div>
                      <div class="switch">
                        <input type="checkbox" id="dark-mode">
                        <label for="dark-mode" class="slider"></label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </mat-tab>

          <mat-tab label="Activity">
            <div class="tab-panel">
              <div class="profile-card">
                <div class="card-header">
                  <h3>Recent Activity</h3>
                </div>
                <div class="card-content">
                  <div class="activity-timeline">
                    <div class="activity-item">
                      <div class="activity-icon">
                        <mat-icon>play_circle</mat-icon>
                      </div>
                      <div class="activity-content">
                        <h4>Completed lesson: Introduction to React</h4>
                        <p>Advanced JavaScript Course</p>
                        <span class="activity-time">2 hours ago</span>
                      </div>
                    </div>
                    
                    <div class="activity-item">
                      <div class="activity-icon">
                        <mat-icon>school</mat-icon>
                      </div>
                      <div class="activity-content">
                        <h4>Enrolled in: Python for Beginners</h4>
                        <p>Started a new course</p>
                        <span class="activity-time">1 day ago</span>
                      </div>
                    </div>
                    
                    <div class="activity-item">
                      <div class="activity-icon">
                        <mat-icon>check_circle</mat-icon>
                      </div>
                      <div class="activity-content">
                        <h4>Completed course: Web Development Basics</h4>
                        <p>Congratulations! You've completed the course</p>
                        <span class="activity-time">3 days ago</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </mat-tab>
        </mat-tab-group>
      </div>
    </section>
  `,
  styles: [`
    .profile-section {
      min-height: calc(100vh - 80px);
      background: #f8f9fa;
      padding: 40px 20px;
    }

    .container {
      max-width: 1000px;
      margin: 0 auto;
    }

    .profile-header {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      padding: 40px;
      margin-bottom: 30px;
      display: flex;
      align-items: center;
      gap: 30px;
    }

    .profile-avatar-section {
      position: relative;
    }

    .profile-avatar {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      overflow: hidden;
      position: relative;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .profile-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .avatar-fallback {
      font-size: 3rem;
      color: #ccc;
    }

    .avatar-edit-btn {
      position: absolute;
      bottom: 0;
      right: 0;
      background: #667eea;
      color: white;
      width: 36px;
      height: 36px;
      border-radius: 50%;
    }

    .profile-info {
      flex: 1;
    }

    .profile-name {
      font-size: 2rem;
      font-weight: bold;
      color: #333;
      margin: 0 0 5px 0;
    }

    .profile-title {
      font-size: 1.1rem;
      color: #667eea;
      margin: 0 0 5px 0;
      text-transform: capitalize;
    }

    .profile-email {
      color: #666;
      margin: 0 0 20px 0;
    }

    .profile-stats {
      display: flex;
      gap: 30px;
    }

    .stat {
      text-align: center;
    }

    .stat-number {
      display: block;
      font-size: 1.5rem;
      font-weight: bold;
      color: #333;
    }

    .stat-label {
      font-size: 0.9rem;
      color: #666;
    }

    .profile-tabs {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .tab-panel {
      padding: 30px;
    }

    .profile-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px 30px;
      border-bottom: 1px solid #eee;
    }

    .card-header h3 {
      margin: 0;
      color: #333;
    }

    .card-content {
      padding: 30px;
    }

    .profile-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .form-row {
      display: flex;
      gap: 20px;
    }

    .form-group {
      flex: 1;
    }

    .form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: #333;
    }

    .form-group input,
    .form-group textarea {
      width: 100%;
      padding: 12px;
      border: 1px solid #ddd;
      border-radius: 8px;
      font-size: 1rem;
      transition: border-color 0.3s ease;
    }

    .form-group input:focus,
    .form-group textarea:focus {
      outline: none;
      border-color: #667eea;
    }

    .form-actions {
      display: flex;
      gap: 15px;
      justify-content: flex-end;
    }

    .info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .info-item {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .info-item label {
      font-weight: 500;
      color: #666;
      font-size: 0.9rem;
    }

    .info-item span {
      color: #333;
      font-size: 1rem;
    }

    .security-options,
    .preferences-section {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .option-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 20px;
      border: 1px solid #eee;
      border-radius: 8px;
    }

    .option-info h4 {
      margin: 0 0 5px 0;
      color: #333;
    }

    .option-info p {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .switch {
      position: relative;
      display: inline-block;
      width: 50px;
      height: 24px;
    }

    .switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #ccc;
      transition: .4s;
      border-radius: 24px;
    }

    .slider:before {
      position: absolute;
      content: "";
      height: 18px;
      width: 18px;
      left: 3px;
      bottom: 3px;
      background-color: white;
      transition: .4s;
      border-radius: 50%;
    }

    input:checked + .slider {
      background-color: #667eea;
    }

    input:checked + .slider:before {
      transform: translateX(26px);
    }

    .activity-timeline {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .activity-item {
      display: flex;
      gap: 15px;
      padding: 20px;
      border: 1px solid #eee;
      border-radius: 8px;
    }

    .activity-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #f5f5f5;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #667eea;
    }

    .activity-content {
      flex: 1;
    }

    .activity-content h4 {
      margin: 0 0 5px 0;
      color: #333;
      font-size: 1rem;
    }

    .activity-content p {
      margin: 0 0 5px 0;
      color: #666;
      font-size: 0.9rem;
    }

    .activity-time {
      color: #999;
      font-size: 0.8rem;
    }

    @media (max-width: 768px) {
      .profile-header {
        flex-direction: column;
        text-align: center;
        gap: 20px;
      }
      
      .profile-stats {
        justify-content: center;
      }
      
      .form-row {
        flex-direction: column;
      }
      
      .info-grid {
        grid-template-columns: 1fr;
      }
      
      .option-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 15px;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  currentUser: User | null = null;
  profileForm: FormGroup;
  editMode = false;

  constructor(
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.profileForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      bio: [''],
      location: ['']
    });
  }

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.profileForm.patchValue({
        firstName: this.currentUser.firstName,
        lastName: this.currentUser.lastName,
        email: this.currentUser.email,
        bio: this.currentUser.bio || '',
        location: this.currentUser.location || ''
      });
    }
  }

  getUserName(): string {
    return this.currentUser ? `${this.currentUser.firstName} ${this.currentUser.lastName}` : 'User';
  }

  getUserAvatar(): string {
    return this.currentUser?.profilePicture || 'assets/images/default-avatar.jpg';
  }

  onImageError(event: any) {
    event.target.style.display = 'none';
    event.target.nextElementSibling.style.display = 'flex';
  }

  onSaveProfile() {
    if (this.profileForm.valid) {
      // Here you would call a service to update the profile
      this.snackBar.open('Profile updated successfully!', 'Close', {
        duration: 3000,
        panelClass: ['success-snackbar']
      });
      this.editMode = false;
    }
  }
}