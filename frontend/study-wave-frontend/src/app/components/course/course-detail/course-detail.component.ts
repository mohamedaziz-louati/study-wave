import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { CourseService } from '../../../services/course.service';
import { EnrollmentService } from '../../../services/enrollment.service';
import { AuthService } from '../../../services/auth.service';
import { Course, CourseLevel, Lesson, LessonType } from '../../../models/course.model';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatTabsModule,
    MatProgressBarModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  template: `
    <div class="course-detail-container" *ngIf="course">
      <!-- Course Header -->
      <div class="course-header">
        <div class="course-hero">
          <img [src]="course.thumbnailUrl || '/assets/images/course-placeholder.jpg'" 
               [alt]="course.title" class="course-hero-image">
          <div class="course-hero-overlay">
            <div class="course-hero-content">
              <mat-chip [color]="getLevelColor(course.level)" selected class="level-chip">
                {{ course.level }}
              </mat-chip>
              <h1 class="course-title">{{ course.title }}</h1>
              <p class="course-subtitle">{{ course.description }}</p>
              <div class="course-meta">
                <div class="instructor-info">
                  <mat-icon>person</mat-icon>
                  <span>{{ course.instructor.firstName }} {{ course.instructor.lastName }}</span>
                </div>
                <div class="course-stats">
                  <span *ngIf="course.duration">
                    <mat-icon>schedule</mat-icon>
                    {{ course.duration }} minutes
                  </span>
                  <span *ngIf="course.enrolledStudents">
                    <mat-icon>people</mat-icon>
                    {{ course.enrolledStudents.length }} students
                  </span>
                  <span *ngIf="course.category">
                    <mat-icon>category</mat-icon>
                    {{ course.category }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="course-content">
        <div class="course-main">
          <!-- Course Tabs -->
          <mat-tab-group class="course-tabs">
            <mat-tab label="Overview">
              <div class="tab-content">
                <mat-card class="overview-card">
                  <mat-card-header>
                    <mat-card-title>About This Course</mat-card-title>
                  </mat-card-header>
                  <mat-card-content>
                    <p class="course-description">{{ course.description }}</p>
                    
                    <div class="course-details">
                      <h3>What You'll Learn</h3>
                      <ul class="learning-objectives">
                        <li>Master the fundamentals of the subject</li>
                        <li>Apply practical skills in real-world scenarios</li>
                        <li>Build confidence through hands-on projects</li>
                        <li>Join a community of learners and professionals</li>
                      </ul>

                      <h3>Course Requirements</h3>
                      <ul class="requirements">
                        <li>Basic computer skills</li>
                        <li>Internet connection</li>
                        <li>Dedication to learning</li>
                      </ul>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </mat-tab>

            <mat-tab label="Curriculum" *ngIf="course.lessons && course.lessons.length > 0">
              <div class="tab-content">
                <mat-card class="curriculum-card">
                  <mat-card-header>
                    <mat-card-title>Course Curriculum</mat-card-title>
                    <mat-card-subtitle>{{ course.lessons.length }} lessons</mat-card-subtitle>
                  </mat-card-header>
                  <mat-card-content>
                    <div class="lessons-list">
                      <div *ngFor="let lesson of sortedLessons; let i = index" 
                           class="lesson-item" 
                           [class.completed]="isLessonCompleted(lesson)">
                        <div class="lesson-number">{{ i + 1 }}</div>
                        <div class="lesson-content">
                          <div class="lesson-header">
                            <h4 class="lesson-title">{{ lesson.title }}</h4>
                            <div class="lesson-meta">
                              <mat-chip [color]="getLessonTypeColor(lesson.type)" selected>
                                {{ lesson.type }}
                              </mat-chip>
                              <span class="lesson-duration">{{ lesson.duration }} min</span>
                            </div>
                          </div>
                          <p class="lesson-description">{{ lesson.description }}</p>
                        </div>
                        <div class="lesson-actions">
                          <button mat-icon-button [disabled]="!isEnrolled">
                            <mat-icon>play_arrow</mat-icon>
                          </button>
                        </div>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </mat-tab>

            <mat-tab label="Instructor">
              <div class="tab-content">
                <mat-card class="instructor-card">
                  <mat-card-content>
                    <div class="instructor-profile">
                      <div class="instructor-avatar">
                        <mat-icon>account_circle</mat-icon>
                      </div>
                      <div class="instructor-info">
                        <h3>{{ course.instructor.firstName }} {{ course.instructor.lastName }}</h3>
                        <p class="instructor-title">Course Instructor</p>
                        <p class="instructor-bio">
                          Experienced instructor with years of expertise in the field. 
                          Passionate about sharing knowledge and helping students succeed.
                        </p>
                        <div class="instructor-stats">
                          <div class="stat">
                            <span class="stat-number">{{ course.instructor.createdCourses?.length || 0 }}</span>
                            <span class="stat-label">Courses</span>
                          </div>
                          <div class="stat">
                            <span class="stat-number">{{ totalStudents }}</span>
                            <span class="stat-label">Students</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </mat-card-content>
                </mat-card>
              </div>
            </mat-tab>
          </mat-tab-group>
        </div>

        <!-- Course Sidebar -->
        <div class="course-sidebar">
          <mat-card class="enrollment-card">
            <mat-card-content>
              <div class="price-section">
                <span class="course-price">${{ course.price }}</span>
                <span class="price-label">One-time payment</span>
              </div>
              
              <div class="enrollment-actions">
                <button *ngIf="!isEnrolled && authService.isAuthenticated()" 
                        mat-raised-button 
                        color="primary" 
                        class="enroll-button"
                        (click)="enrollInCourse()"
                        [disabled]="isEnrolling">
                  <mat-icon>school</mat-icon>
                  {{ isEnrolling ? 'Enrolling...' : 'Enroll Now' }}
                </button>
                
                <button *ngIf="!isEnrolled && !authService.isAuthenticated()" 
                        mat-raised-button 
                        color="primary" 
                        class="enroll-button"
                        routerLink="/login">
                  <mat-icon>login</mat-icon>
                  Login to Enroll
                </button>
                
                <button *ngIf="isEnrolled" 
                        mat-raised-button 
                        color="accent" 
                        class="enroll-button"
                        routerLink="/dashboard">
                  <mat-icon>play_arrow</mat-icon>
                  Continue Learning
                </button>
              </div>

              <div class="course-features">
                <h4>What's Included:</h4>
                <ul>
                  <li>
                    <mat-icon>video_library</mat-icon>
                    {{ course.lessons?.length || 0 }} video lessons
                  </li>
                  <li>
                    <mat-icon>schedule</mat-icon>
                    {{ course.duration || 0 }} minutes of content
                  </li>
                  <li>
                    <mat-icon>download</mat-icon>
                    Downloadable resources
                  </li>
                  <li>
                    <mat-icon>support</mat-icon>
                    Instructor support
                  </li>
                  <li>
                    <mat-icon>certificate</mat-icon>
                    Certificate of completion
                  </li>
                </ul>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div *ngIf="!course && !isLoading" class="loading-container">
      <mat-icon class="loading-icon">error</mat-icon>
      <h3>Course not found</h3>
      <p>The course you're looking for doesn't exist or has been removed.</p>
      <button mat-raised-button color="primary" routerLink="/courses">
        Browse All Courses
      </button>
    </div>

    <div *ngIf="isLoading" class="loading-container">
      <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      <p>Loading course details...</p>
    </div>
  `,
  styles: [`
    .course-detail-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    .course-header {
      margin-bottom: 30px;
    }

    .course-hero {
      position: relative;
      height: 400px;
      border-radius: 12px;
      overflow: hidden;
    }

    .course-hero-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .course-hero-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%);
      display: flex;
      align-items: center;
      padding: 40px;
    }

    .course-hero-content {
      color: white;
      max-width: 600px;
    }

    .level-chip {
      margin-bottom: 20px;
    }

    .course-title {
      font-size: 3rem;
      font-weight: bold;
      margin-bottom: 20px;
      line-height: 1.2;
    }

    .course-subtitle {
      font-size: 1.2rem;
      margin-bottom: 30px;
      opacity: 0.9;
      line-height: 1.5;
    }

    .course-meta {
      display: flex;
      gap: 30px;
      flex-wrap: wrap;
    }

    .instructor-info, .course-stats {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .course-stats span {
      display: flex;
      align-items: center;
      gap: 4px;
      margin-right: 20px;
    }

    .course-content {
      display: grid;
      grid-template-columns: 1fr 350px;
      gap: 30px;
    }

    .course-tabs {
      background: white;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .tab-content {
      padding: 30px;
    }

    .overview-card, .curriculum-card, .instructor-card {
      box-shadow: none;
    }

    .course-description {
      font-size: 1.1rem;
      line-height: 1.6;
      margin-bottom: 30px;
      color: #333;
    }

    .course-details h3 {
      font-size: 1.3rem;
      margin-bottom: 15px;
      color: #333;
    }

    .learning-objectives, .requirements {
      list-style: none;
      padding: 0;
    }

    .learning-objectives li, .requirements li {
      padding: 8px 0;
      padding-left: 25px;
      position: relative;
    }

    .learning-objectives li::before {
      content: '✓';
      position: absolute;
      left: 0;
      color: #4caf50;
      font-weight: bold;
    }

    .requirements li::before {
      content: '•';
      position: absolute;
      left: 0;
      color: #2196f3;
      font-weight: bold;
    }

    .lessons-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .lesson-item {
      display: flex;
      align-items: center;
      padding: 20px;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
      transition: all 0.2s ease;
    }

    .lesson-item:hover {
      background: #f5f5f5;
    }

    .lesson-item.completed {
      background: #e8f5e8;
      border-color: #4caf50;
    }

    .lesson-number {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: #2196f3;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      margin-right: 20px;
      flex-shrink: 0;
    }

    .lesson-content {
      flex: 1;
    }

    .lesson-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }

    .lesson-title {
      margin: 0;
      font-size: 1.1rem;
      color: #333;
    }

    .lesson-meta {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .lesson-duration {
      font-size: 0.9rem;
      color: #666;
    }

    .lesson-description {
      margin: 0;
      color: #666;
      font-size: 0.9rem;
    }

    .lesson-actions {
      margin-left: 20px;
    }

    .instructor-profile {
      display: flex;
      gap: 20px;
    }

    .instructor-avatar {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      background: #e0e0e0;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .instructor-avatar mat-icon {
      font-size: 3rem;
      color: #666;
    }

    .instructor-info h3 {
      margin: 0 0 5px 0;
      color: #333;
    }

    .instructor-title {
      margin: 0 0 15px 0;
      color: #666;
      font-style: italic;
    }

    .instructor-bio {
      margin: 0 0 20px 0;
      line-height: 1.5;
      color: #666;
    }

    .instructor-stats {
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
      color: #2196f3;
    }

    .stat-label {
      font-size: 0.9rem;
      color: #666;
    }

    .course-sidebar {
      position: sticky;
      top: 20px;
    }

    .enrollment-card {
      position: sticky;
      top: 20px;
    }

    .price-section {
      text-align: center;
      margin-bottom: 20px;
    }

    .course-price {
      font-size: 2.5rem;
      font-weight: bold;
      color: #2e7d32;
      display: block;
    }

    .price-label {
      font-size: 0.9rem;
      color: #666;
    }

    .enrollment-actions {
      margin-bottom: 30px;
    }

    .enroll-button {
      width: 100%;
      height: 50px;
      font-size: 1.1rem;
    }

    .course-features h4 {
      margin-bottom: 15px;
      color: #333;
    }

    .course-features ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .course-features li {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 0;
      color: #666;
    }

    .course-features mat-icon {
      color: #4caf50;
      font-size: 1.2rem;
    }

    .loading-container {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .loading-icon {
      font-size: 4rem;
      color: #ccc;
      margin-bottom: 20px;
    }

    .loading-container h3 {
      font-size: 1.5rem;
      margin-bottom: 10px;
      color: #333;
    }

    .loading-container p {
      margin-bottom: 20px;
    }

    @media (max-width: 768px) {
      .course-content {
        grid-template-columns: 1fr;
      }
      
      .course-hero-overlay {
        padding: 20px;
      }
      
      .course-title {
        font-size: 2rem;
      }
      
      .course-meta {
        flex-direction: column;
        gap: 15px;
      }
      
      .instructor-profile {
        flex-direction: column;
        text-align: center;
      }
    }
  `]
})
export class CourseDetailComponent implements OnInit {
  course: Course | null = null;
  isLoading = false;
  isEnrolled = false;
  isEnrolling = false;
  totalStudents = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseService: CourseService,
    private enrollmentService: EnrollmentService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.loadCourse();
  }

  private loadCourse() {
    this.isLoading = true;
    const courseId = this.route.snapshot.paramMap.get('id');
    
    if (courseId) {
      this.courseService.getCourseById(+courseId).subscribe({
        next: (course) => {
          this.course = course;
          this.totalStudents = course.enrolledStudents?.length || 0;
          this.checkEnrollmentStatus();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading course:', error);
          this.isLoading = false;
        }
      });
    }
  }

  private checkEnrollmentStatus() {
    if (this.course && this.authService.isAuthenticated()) {
      this.enrollmentService.isEnrolled(this.course.id).subscribe({
        next: (enrolled) => {
          this.isEnrolled = enrolled;
        },
        error: (error) => {
          console.error('Error checking enrollment status:', error);
        }
      });
    }
  }

  enrollInCourse() {
    if (this.course) {
      this.isEnrolling = true;
      this.enrollmentService.enrollInCourse(this.course.id).subscribe({
        next: (enrollment) => {
          this.isEnrolling = false;
          this.isEnrolled = true;
          this.snackBar.open('Successfully enrolled in course!', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
        },
        error: (error) => {
          this.isEnrolling = false;
          this.snackBar.open('Failed to enroll in course. Please try again.', 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
          console.error('Enrollment error:', error);
        }
      });
    }
  }

  get sortedLessons(): Lesson[] {
    if (!this.course?.lessons) return [];
    return [...this.course.lessons].sort((a, b) => a.order - b.order);
  }

  isLessonCompleted(lesson: Lesson): boolean {
    // This would be implemented based on your progress tracking logic
    return false;
  }

  getLevelColor(level: CourseLevel): 'primary' | 'accent' | 'warn' {
    switch (level) {
      case CourseLevel.BEGINNER:
        return 'primary';
      case CourseLevel.INTERMEDIATE:
        return 'accent';
      case CourseLevel.ADVANCED:
        return 'warn';
      default:
        return 'primary';
    }
  }

  getLessonTypeColor(type: LessonType): 'primary' | 'accent' | 'warn' {
    switch (type) {
      case LessonType.VIDEO:
        return 'primary';
      case LessonType.TEXT:
        return 'accent';
      case LessonType.QUIZ:
        return 'warn';
      case LessonType.ASSIGNMENT:
        return 'warn';
      default:
        return 'primary';
    }
  }
}
