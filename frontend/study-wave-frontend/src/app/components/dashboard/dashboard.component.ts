import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { AuthService } from '../../services/auth.service';
import { CourseService } from '../../services/course.service';
import { EnrollmentService } from '../../services/enrollment.service';
import { User } from '../../models/user.model';
import { Course } from '../../models/course.model';
import { Enrollment } from '../../models/enrollment.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTabsModule,
    MatChipsModule,
    MatProgressBarModule
  ],
  template: `
    <section class="dashboard-section">
      <div class="container">
        <div class="welcome-section">
          <h1 class="welcome-title">
            Welcome back, {{ currentUser?.firstName }}! 👋
          </h1>
          <p class="welcome-subtitle">Ready to continue your learning journey?</p>
        </div>

        <mat-tab-group class="dashboard-tabs">
          <!-- Student Dashboard -->
          <mat-tab label="My Courses" *ngIf="currentUser?.role === 'STUDENT'">
            <div class="tab-panel">
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-icon">
                    <mat-icon>school</mat-icon>
                  </div>
                  <div class="stat-content">
                    <h3>{{ enrolledCourses.length }}</h3>
                    <p>Enrolled Courses</p>
                  </div>
                </div>
                
                <div class="stat-card">
                  <div class="stat-icon">
                    <mat-icon>check_circle</mat-icon>
                  </div>
                  <div class="stat-content">
                    <h3>{{ completedCourses.length }}</h3>
                    <p>Completed</p>
                  </div>
                </div>
                
                <div class="stat-card">
                  <div class="stat-icon">
                    <mat-icon>schedule</mat-icon>
                  </div>
                  <div class="stat-content">
                    <h3>{{ inProgressCourses.length }}</h3>
                    <p>In Progress</p>
                  </div>
                </div>
              </div>

              <div class="courses-section">
                <h2>My Enrolled Courses</h2>
                <div class="courses-grid" *ngIf="enrolledCourses.length > 0; else noCourses">
                  <div *ngFor="let enrollment of enrolledCourses" class="course-card enrolled">
                    <div class="course-image">
                      <img [src]="enrollment.course.thumbnailUrl || 'assets/images/course-placeholder.jpg'" 
                           [alt]="enrollment.course.title">
                      <div class="course-badge" [ngClass]="enrollment.status.toLowerCase()">
                        {{ enrollment.status }}
                      </div>
                    </div>
                    <div class="course-content">
                      <h3 class="course-title">{{ enrollment.course.title }}</h3>
                      <p class="course-description">{{ enrollment.course.description | slice:0:100 }}...</p>
                      <div class="course-meta">
                        <span class="course-level">{{ enrollment.course.level }}</span>
                        <span class="course-price">${{ enrollment.course.price }}</span>
                      </div>
                      <div class="course-progress" *ngIf="enrollment.status === 'IN_PROGRESS'">
                        <div class="progress-bar">
                          <div class="progress-fill" [style.width.%]="getProgressPercentage(enrollment)"></div>
                        </div>
                        <span class="progress-text">{{ getProgressPercentage(enrollment) }}% Complete</span>
                      </div>
                      <div class="course-actions">
                        <button mat-button color="primary" [routerLink]="['/courses', enrollment.course.id]">
                          Continue Learning
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <ng-template #noCourses>
                  <div class="no-courses">
                    <mat-icon class="no-courses-icon">school</mat-icon>
                    <h3>No enrolled courses yet</h3>
                    <p>Start your learning journey by exploring our courses</p>
                    <button mat-raised-button color="primary" routerLink="/courses">
                      Browse Courses
                    </button>
                  </div>
                </ng-template>
              </div>
            </div>
          </mat-tab>

          <!-- Instructor Dashboard -->
          <mat-tab label="My Courses" *ngIf="currentUser?.role === 'INSTRUCTOR'">
            <div class="tab-panel">
              <div class="instructor-actions">
                <button mat-raised-button color="primary" routerLink="/create-course">
                  <mat-icon>add</mat-icon>
                  Create New Course
                </button>
              </div>

              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-icon">
                    <mat-icon>book</mat-icon>
                  </div>
                  <div class="stat-content">
                    <h3>{{ myCourses.length }}</h3>
                    <p>My Courses</p>
                  </div>
                </div>
                
                <div class="stat-card">
                  <div class="stat-icon">
                    <mat-icon>people</mat-icon>
                  </div>
                  <div class="stat-content">
                    <h3>{{ totalStudents }}</h3>
                    <p>Total Students</p>
                  </div>
                </div>
                
                <div class="stat-card">
                  <div class="stat-icon">
                    <mat-icon>trending_up</mat-icon>
                  </div>
                  <div class="stat-content">
                    <h3>{{ publishedCourses }}</h3>
                    <p>Published</p>
                  </div>
                </div>
              </div>

              <div class="courses-section">
                <h2>My Courses</h2>
                <div class="courses-grid" *ngIf="myCourses.length > 0; else noMyCourses">
                  <div *ngFor="let course of myCourses" class="course-card">
                    <div class="course-image">
                      <img [src]="course.thumbnailUrl || 'assets/images/course-placeholder.jpg'" 
                           [alt]="course.title">
                      <div class="course-badge" [ngClass]="course.status.toLowerCase()">
                        {{ course.status }}
                      </div>
                    </div>
                    <div class="course-content">
                      <h3 class="course-title">{{ course.title }}</h3>
                      <p class="course-description">{{ course.description | slice:0:100 }}...</p>
                      <div class="course-meta">
                        <span class="course-level">{{ course.level }}</span>
                        <span class="course-students">{{ course.enrolledStudents?.length || 0 }} students</span>
                      </div>
                      <div class="course-actions">
                        <button mat-button color="primary" [routerLink]="['/courses', course.id]">
                          View Course
                        </button>
                        <button mat-button color="accent">
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                
                <ng-template #noMyCourses>
                  <div class="no-courses">
                    <mat-icon class="no-courses-icon">book</mat-icon>
                    <h3>No courses created yet</h3>
                    <p>Start sharing your knowledge by creating your first course</p>
                    <button mat-raised-button color="primary" routerLink="/create-course">
                      Create Course
                    </button>
                  </div>
                </ng-template>
              </div>
            </div>
          </mat-tab>

          <!-- Progress Tab -->
          <mat-tab label="Progress">
            <div class="tab-panel">
              <div class="progress-chart">
                <h3>Learning Progress</h3>
                <div class="chart-container">
                  <div class="chart-bars">
                    <div class="chart-bar" *ngFor="let course of enrolledCourses">
                      <div class="bar-label">{{ course.course.title }}</div>
                      <div class="bar-value">
                        <div class="progress-bar">
                          <div class="progress-fill" [style.width.%]="getProgressPercentage(course)"></div>
                        </div>
                        <span>{{ getProgressPercentage(course) }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </mat-tab>

          <!-- Achievements Tab -->
          <mat-tab label="Achievements">
            <div class="tab-panel">
              <div class="achievements-grid">
                <div class="achievement-card">
                  <div class="achievement-icon">🏆</div>
                  <div class="achievement-content">
                    <h4>First Course</h4>
                    <p>Completed your first course</p>
                  </div>
                </div>
                <div class="achievement-card">
                  <div class="achievement-icon">📚</div>
                  <div class="achievement-content">
                    <h4>Knowledge Seeker</h4>
                    <p>Enrolled in 5 courses</p>
                  </div>
                </div>
                <div class="achievement-card">
                  <div class="achievement-icon">⭐</div>
                  <div class="achievement-content">
                    <h4>Top Student</h4>
                    <p>Completed 10 courses</p>
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
    .dashboard-section {
      min-height: calc(100vh - 80px);
      background: #f8f9fa;
      padding: 40px 20px;
    }

    .container {
      max-width: 1200px;
      margin: 0 auto;
    }

    .welcome-section {
      text-align: center;
      margin-bottom: 40px;
    }

    .welcome-title {
      font-size: 2.5rem;
      font-weight: bold;
      color: #333;
      margin-bottom: 10px;
    }

    .welcome-subtitle {
      font-size: 1.2rem;
      color: #666;
    }

    .dashboard-tabs {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      overflow: hidden;
    }

    .tab-panel {
      padding: 30px;
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
      margin-bottom: 40px;
    }

    .stat-card {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 30px;
      border-radius: 12px;
      display: flex;
      align-items: center;
      gap: 20px;
    }

    .stat-icon {
      font-size: 2.5rem;
      opacity: 0.8;
    }

    .stat-content h3 {
      font-size: 2rem;
      font-weight: bold;
      margin: 0 0 5px 0;
    }

    .stat-content p {
      margin: 0;
      opacity: 0.9;
    }

    .instructor-actions {
      margin-bottom: 30px;
    }

    .courses-section h2 {
      font-size: 1.8rem;
      color: #333;
      margin-bottom: 20px;
    }

    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 20px;
    }

    .course-card {
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      overflow: hidden;
      transition: transform 0.3s ease;
    }

    .course-card:hover {
      transform: translateY(-5px);
    }

    .course-image {
      position: relative;
      height: 200px;
      overflow: hidden;
    }

    .course-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .course-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
      text-transform: uppercase;
    }

    .course-badge.enrolled {
      background: #e3f2fd;
      color: #1976d2;
    }

    .course-badge.completed {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .course-badge.published {
      background: #e8f5e8;
      color: #2e7d32;
    }

    .course-badge.draft {
      background: #fff3e0;
      color: #f57c00;
    }

    .course-content {
      padding: 20px;
    }

    .course-title {
      font-size: 1.3rem;
      font-weight: bold;
      color: #333;
      margin-bottom: 10px;
    }

    .course-description {
      color: #666;
      margin-bottom: 15px;
      line-height: 1.5;
    }

    .course-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .course-level {
      background: #f5f5f5;
      color: #666;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.9rem;
    }

    .course-price {
      font-size: 1.2rem;
      font-weight: bold;
      color: #2e7d32;
    }

    .course-students {
      color: #666;
      font-size: 0.9rem;
    }

    .course-progress {
      margin-bottom: 15px;
    }

    .progress-bar {
      width: 100%;
      height: 8px;
      background: #e0e0e0;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 5px;
    }

    .progress-fill {
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      transition: width 0.3s ease;
    }

    .progress-text {
      font-size: 0.9rem;
      color: #666;
    }

    .course-actions {
      display: flex;
      gap: 10px;
    }

    .no-courses {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .no-courses-icon {
      font-size: 4rem;
      color: #ccc;
      margin-bottom: 20px;
    }

    .no-courses h3 {
      font-size: 1.5rem;
      margin-bottom: 10px;
      color: #333;
    }

    .progress-chart {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }

    .progress-chart h3 {
      margin-bottom: 20px;
      color: #333;
    }

    .chart-container {
      margin-top: 20px;
    }

    .chart-bars {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .chart-bar {
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .bar-label {
      min-width: 150px;
      font-weight: 500;
      color: #333;
    }

    .bar-value {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .bar-value .progress-bar {
      flex: 1;
    }

    .achievements-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }

    .achievement-card {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
      text-align: center;
      transition: transform 0.3s ease;
    }

    .achievement-card:hover {
      transform: translateY(-5px);
    }

    .achievement-icon {
      font-size: 3rem;
      margin-bottom: 15px;
    }

    .achievement-content h4 {
      font-size: 1.2rem;
      color: #333;
      margin-bottom: 5px;
    }

    .achievement-content p {
      color: #666;
      margin: 0;
    }

    @media (max-width: 768px) {
      .dashboard-section {
        padding: 20px 10px;
      }
      
      .welcome-title {
        font-size: 2rem;
      }
      
      .stats-grid {
        grid-template-columns: 1fr;
      }
      
      .courses-grid {
        grid-template-columns: 1fr;
      }
      
      .chart-bar {
        flex-direction: column;
        align-items: flex-start;
      }
      
      .bar-label {
        min-width: auto;
      }
    }
  `]
})
export class DashboardComponent implements OnInit {
  currentUser: User | null = null;
  enrolledCourses: Enrollment[] = [];
  myCourses: Course[] = [];
  completedCourses: Enrollment[] = [];
  inProgressCourses: Enrollment[] = [];
  totalStudents = 0;
  publishedCourses = 0;

  constructor(
    private authService: AuthService,
    private courseService: CourseService,
    private enrollmentService: EnrollmentService
  ) {}

  ngOnInit() {
    this.currentUser = this.authService.getCurrentUser();
    if (this.currentUser) {
      this.loadDashboardData();
    }
  }

  private loadDashboardData() {
    if (this.currentUser?.role === 'STUDENT') {
      this.loadStudentData();
    } else if (this.currentUser?.role === 'INSTRUCTOR') {
      this.loadInstructorData();
    }
  }

  private loadStudentData() {
    this.enrollmentService.getUserEnrollments().subscribe({
      next: (enrollments) => {
        this.enrolledCourses = enrollments;
        this.completedCourses = enrollments.filter(e => e.status === 'COMPLETED');
        this.inProgressCourses = enrollments.filter(e => e.status === 'IN_PROGRESS');
      },
      error: (error) => {
        console.error('Error loading enrollments:', error);
      }
    });
  }

  private loadInstructorData() {
    this.courseService.getInstructorCourses().subscribe({
      next: (courses) => {
        this.myCourses = courses;
        this.publishedCourses = courses.filter(c => c.status === 'PUBLISHED').length;
        this.totalStudents = courses.reduce((total, course) => total + (course.enrolledStudents?.length || 0), 0);
      },
      error: (error) => {
        console.error('Error loading instructor courses:', error);
      }
    });
  }

  getProgressPercentage(enrollment: Enrollment): number {
    // This would be calculated based on completed lessons
    return Math.floor(Math.random() * 100); // Placeholder
  }
}