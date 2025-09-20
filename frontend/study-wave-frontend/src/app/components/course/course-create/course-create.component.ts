import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { CourseService } from '../../../services/course.service';
import { AuthService } from '../../../services/auth.service';
import { Course, CourseLevel, CourseStatus } from '../../../models/course.model';

@Component({
  selector: 'app-course-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatSnackBarModule,
    MatStepperModule
  ],
  template: `
    <div class="course-create-container">
      <div class="header-section">
        <h1 class="page-title">Create New Course</h1>
        <p class="page-subtitle">Share your knowledge with the world</p>
      </div>

      <mat-card class="create-card card-elevation">
        <mat-card-content>
          <form [formGroup]="courseForm" (ngSubmit)="onSubmit()" class="course-form">
            <mat-stepper #stepper>
              <!-- Step 1: Basic Information -->
              <mat-step [stepControl]="courseForm.get('basicInfo')" label="Basic Information">
                <ng-template matStepContent>
                  <div formGroupName="basicInfo" class="step-content">
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Course Title</mat-label>
                      <input matInput formControlName="title" required>
                      <mat-icon matSuffix>title</mat-icon>
                      <mat-error *ngIf="courseForm.get('basicInfo.title')?.hasError('required')">
                        Course title is required
                      </mat-error>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Course Description</mat-label>
                      <textarea matInput formControlName="description" rows="4" required></textarea>
                      <mat-icon matSuffix>description</mat-icon>
                      <mat-error *ngIf="courseForm.get('basicInfo.description')?.hasError('required')">
                        Course description is required
                      </mat-error>
                    </mat-form-field>

                    <div class="form-row">
                      <mat-form-field appearance="outline" class="half-width">
                        <mat-label>Category</mat-label>
                        <input matInput formControlName="category" placeholder="e.g., Programming, Design, Business">
                        <mat-icon matSuffix>category</mat-icon>
                      </mat-form-field>

                      <mat-form-field appearance="outline" class="half-width">
                        <mat-label>Duration (minutes)</mat-label>
                        <input matInput type="number" formControlName="duration" min="1">
                        <mat-icon matSuffix>schedule</mat-icon>
                      </mat-form-field>
                    </div>

                    <div class="form-row">
                      <mat-form-field appearance="outline" class="half-width">
                        <mat-label>Course Level</mat-label>
                        <mat-select formControlName="level" required>
                          <mat-option value="BEGINNER">Beginner</mat-option>
                          <mat-option value="INTERMEDIATE">Intermediate</mat-option>
                          <mat-option value="ADVANCED">Advanced</mat-option>
                        </mat-select>
                        <mat-icon matSuffix>trending_up</mat-icon>
                      </mat-form-field>

                      <mat-form-field appearance="outline" class="half-width">
                        <mat-label>Price ($)</mat-label>
                        <input matInput type="number" formControlName="price" min="0" step="0.01" required>
                        <mat-icon matSuffix>attach_money</mat-icon>
                        <mat-error *ngIf="courseForm.get('basicInfo.price')?.hasError('required')">
                          Price is required
                        </mat-error>
                        <mat-error *ngIf="courseForm.get('basicInfo.price')?.hasError('min')">
                          Price must be positive
                        </mat-error>
                      </mat-form-field>
                    </div>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Thumbnail URL</mat-label>
                      <input matInput formControlName="thumbnailUrl" placeholder="https://example.com/image.jpg">
                      <mat-icon matSuffix>image</mat-icon>
                    </mat-form-field>

                    <div class="step-actions">
                      <button mat-button matStepperNext color="primary">
                        Next
                        <mat-icon>arrow_forward</mat-icon>
                      </button>
                    </div>
                  </div>
                </ng-template>
              </mat-step>

              <!-- Step 2: Course Content -->
              <mat-step [stepControl]="courseForm.get('content')" label="Course Content">
                <ng-template matStepContent>
                  <div formGroupName="content" class="step-content">
                    <h3>Course Content Preview</h3>
                    <p>You can add lessons and content after creating the course. For now, let's set up the basic structure.</p>
                    
                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Learning Objectives (one per line)</mat-label>
                      <textarea matInput formControlName="objectives" rows="6" 
                                placeholder="Students will learn to...&#10;Students will be able to...&#10;Students will understand..."></textarea>
                      <mat-icon matSuffix>list</mat-icon>
                    </mat-form-field>

                    <mat-form-field appearance="outline" class="full-width">
                      <mat-label>Course Requirements</mat-label>
                      <textarea matInput formControlName="requirements" rows="4" 
                                placeholder="Basic computer skills&#10;Internet connection&#10;Dedication to learning"></textarea>
                      <mat-icon matSuffix>checklist</mat-icon>
                    </mat-form-field>

                    <div class="step-actions">
                      <button mat-button matStepperPrevious>
                        <mat-icon>arrow_back</mat-icon>
                        Back
                      </button>
                      <button mat-button matStepperNext color="primary">
                        Next
                        <mat-icon>arrow_forward</mat-icon>
                      </button>
                    </div>
                  </div>
                </ng-template>
              </mat-step>

              <!-- Step 3: Review & Publish -->
              <mat-step label="Review & Publish">
                <ng-template matStepContent>
                  <div class="step-content">
                    <h3>Review Your Course</h3>
                    <div class="review-section">
                      <mat-card class="review-card">
                        <mat-card-content>
                          <div class="course-preview">
                            <img [src]="courseForm.get('basicInfo.thumbnailUrl')?.value || '/assets/images/course-placeholder.jpg'" 
                                 [alt]="courseForm.get('basicInfo.title')?.value" class="preview-image">
                            <div class="preview-content">
                              <h4>{{ courseForm.get('basicInfo.title')?.value || 'Course Title' }}</h4>
                              <p>{{ courseForm.get('basicInfo.description')?.value || 'Course description...' }}</p>
                              <div class="preview-meta">
                                <mat-chip>{{ courseForm.get('basicInfo.level')?.value || 'Level' }}</mat-chip>
                                <span class="preview-price">${{ courseForm.get('basicInfo.price')?.value || '0' }}</span>
                              </div>
                            </div>
                          </div>
                        </mat-card-content>
                      </mat-card>

                      <div class="course-details">
                        <h4>Course Details</h4>
                        <div class="detail-item">
                          <strong>Category:</strong> {{ courseForm.get('basicInfo.category')?.value || 'Not specified' }}
                        </div>
                        <div class="detail-item">
                          <strong>Duration:</strong> {{ courseForm.get('basicInfo.duration')?.value || 'Not specified' }} minutes
                        </div>
                        <div class="detail-item">
                          <strong>Level:</strong> {{ courseForm.get('basicInfo.level')?.value || 'Not specified' }}
                        </div>
                        <div class="detail-item">
                          <strong>Price:</strong> ${{ courseForm.get('basicInfo.price')?.value || '0' }}
                        </div>
                      </div>
                    </div>

                    <div class="publish-options">
                      <h4>Publish Options</h4>
                      <mat-form-field appearance="outline" class="full-width">
                        <mat-label>Initial Status</mat-label>
                        <mat-select formControlName="status">
                          <mat-option value="DRAFT">Save as Draft</mat-option>
                          <mat-option value="PUBLISHED">Publish Immediately</mat-option>
                        </mat-select>
                      </mat-form-field>
                    </div>

                    <div class="step-actions">
                      <button mat-button matStepperPrevious>
                        <mat-icon>arrow_back</mat-icon>
                        Back
                      </button>
                      <button mat-raised-button color="primary" type="submit" 
                              [disabled]="courseForm.invalid || isCreating">
                        <mat-icon *ngIf="isCreating">refresh</mat-icon>
                        {{ isCreating ? 'Creating Course...' : 'Create Course' }}
                      </button>
                    </div>
                  </div>
                </ng-template>
              </mat-step>
            </mat-stepper>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .course-create-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
    }

    .header-section {
      text-align: center;
      margin-bottom: 40px;
      padding: 40px 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      border-radius: 12px;
    }

    .page-title {
      font-size: 2.5rem;
      margin-bottom: 10px;
    }

    .page-subtitle {
      font-size: 1.2rem;
      opacity: 0.9;
    }

    .create-card {
      padding: 20px;
    }

    .course-form {
      width: 100%;
    }

    .step-content {
      padding: 20px 0;
    }

    .form-row {
      display: flex;
      gap: 20px;
    }

    .half-width {
      flex: 1;
    }

    .full-width {
      width: 100%;
    }

    .step-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 30px;
    }

    .review-section {
      margin-bottom: 30px;
    }

    .review-card {
      margin-bottom: 20px;
    }

    .course-preview {
      display: flex;
      gap: 20px;
    }

    .preview-image {
      width: 150px;
      height: 100px;
      object-fit: cover;
      border-radius: 8px;
    }

    .preview-content {
      flex: 1;
    }

    .preview-content h4 {
      margin: 0 0 10px 0;
      color: #333;
    }

    .preview-content p {
      margin: 0 0 15px 0;
      color: #666;
      line-height: 1.5;
    }

    .preview-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .preview-price {
      font-size: 1.2rem;
      font-weight: bold;
      color: #2e7d32;
    }

    .course-details {
      background: #f5f5f5;
      padding: 20px;
      border-radius: 8px;
    }

    .course-details h4 {
      margin: 0 0 15px 0;
      color: #333;
    }

    .detail-item {
      margin-bottom: 8px;
      color: #666;
    }

    .publish-options {
      margin-top: 30px;
    }

    .publish-options h4 {
      margin: 0 0 15px 0;
      color: #333;
    }

    @media (max-width: 768px) {
      .page-title {
        font-size: 2rem;
      }
      
      .form-row {
        flex-direction: column;
      }
      
      .course-preview {
        flex-direction: column;
      }
      
      .preview-image {
        width: 100%;
        height: 200px;
      }
    }
  `]
})
export class CourseCreateComponent implements OnInit {
  courseForm: FormGroup;
  isCreating = false;

  constructor(
    private formBuilder: FormBuilder,
    private courseService: CourseService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.courseForm = this.formBuilder.group({
      basicInfo: this.formBuilder.group({
        title: ['', [Validators.required]],
        description: ['', [Validators.required]],
        category: [''],
        duration: [''],
        level: ['BEGINNER', [Validators.required]],
        price: ['', [Validators.required, Validators.min(0)]],
        thumbnailUrl: ['']
      }),
      content: this.formBuilder.group({
        objectives: [''],
        requirements: ['']
      }),
      status: ['DRAFT']
    });
  }

  ngOnInit() {
    // Component initialization
  }

  onSubmit() {
    if (this.courseForm.valid) {
      this.isCreating = true;
      const currentUser = this.authService.getCurrentUser();
      
      if (!currentUser) {
        this.snackBar.open('You must be logged in to create a course', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.isCreating = false;
        return;
      }

      const courseData = {
        title: this.courseForm.get('basicInfo.title')?.value,
        description: this.courseForm.get('basicInfo.description')?.value,
        category: this.courseForm.get('basicInfo.category')?.value,
        duration: this.courseForm.get('basicInfo.duration')?.value ? +this.courseForm.get('basicInfo.duration')?.value : null,
        level: this.courseForm.get('basicInfo.level')?.value,
        price: +this.courseForm.get('basicInfo.price')?.value,
        thumbnailUrl: this.courseForm.get('basicInfo.thumbnailUrl')?.value,
        status: this.courseForm.get('status')?.value,
        instructor: {
          id: currentUser.id
        }
      };

      this.courseService.createCourse(courseData).subscribe({
        next: (course) => {
          this.isCreating = false;
          this.snackBar.open('Course created successfully!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.router.navigate(['/courses', course.id]);
        },
        error: (error) => {
          this.isCreating = false;
          this.snackBar.open('Failed to create course. Please try again.', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          console.error('Course creation error:', error);
        }
      });
    }
  }
}
