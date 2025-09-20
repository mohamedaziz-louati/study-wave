import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { CourseService } from '../../services/course.service';
import { AuthService } from '../../services/auth.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatGridListModule
  ],
  template: `
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title text-gradient">Welcome to Study Wave</h1>
        <p class="hero-subtitle">Your gateway to endless learning opportunities</p>
        <div class="hero-actions">
          <button mat-raised-button color="primary" routerLink="/courses" class="hero-button">
            <mat-icon>school</mat-icon>
            Explore Courses
          </button>
          <button mat-stroked-button color="primary" routerLink="/register" class="hero-button" *ngIf="!authService.isAuthenticated()">
            <mat-icon>person_add</mat-icon>
            Get Started
          </button>
        </div>
      </div>
    </div>

    <div class="features-section">
      <h2 class="section-title">Why Choose Study Wave?</h2>
      <mat-grid-list cols="3" rowHeight="200px" gutterSize="20px">
        <mat-grid-tile>
          <mat-card class="feature-card card-elevation">
            <mat-card-content>
              <mat-icon class="feature-icon">video_library</mat-icon>
              <h3>Interactive Learning</h3>
              <p>Engage with high-quality video content and interactive lessons</p>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
        <mat-grid-tile>
          <mat-card class="feature-card card-elevation">
            <mat-card-content>
              <mat-icon class="feature-icon">schedule</mat-icon>
              <h3>Flexible Schedule</h3>
              <p>Learn at your own pace with 24/7 access to all content</p>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
        <mat-grid-tile>
          <mat-card class="feature-card card-elevation">
            <mat-card-content>
              <mat-icon class="feature-icon">support</mat-icon>
              <h3>Expert Support</h3>
              <p>Get help from experienced instructors and community</p>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
      </mat-grid-list>
    </div>

    <div class="courses-section" *ngIf="featuredCourses.length > 0">
      <h2 class="section-title">Featured Courses</h2>
      <div class="courses-grid">
        <mat-card *ngFor="let course of featuredCourses" class="course-card card-elevation">
          <img mat-card-image [src]="course.thumbnailUrl || '/assets/images/course-placeholder.jpg'" 
               [alt]="course.title" class="course-image">
          <mat-card-content>
            <h3 class="course-title">{{ course.title }}</h3>
            <p class="course-description">{{ course.description | slice:0:100 }}...</p>
            <div class="course-meta">
              <span class="course-level">{{ course.level }}</span>
              <span class="course-price">${{ course.price }}</span>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" [routerLink]="['/courses', course.id]">
              View Details
            </button>
          </mat-card-actions>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 80px 20px;
      text-align: center;
      margin: -20px -20px 40px -20px;
    }

    .hero-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: bold;
      margin-bottom: 20px;
    }

    .hero-subtitle {
      font-size: 1.2rem;
      margin-bottom: 40px;
      opacity: 0.9;
    }

    .hero-actions {
      display: flex;
      gap: 20px;
      justify-content: center;
      flex-wrap: wrap;
    }

    .hero-button {
      padding: 12px 24px;
      font-size: 1.1rem;
    }

    .features-section, .courses-section {
      margin: 60px 0;
    }

    .section-title {
      text-align: center;
      font-size: 2.5rem;
      margin-bottom: 40px;
      color: #333;
    }

    .feature-card {
      height: 100%;
      text-align: center;
    }

    .feature-icon {
      font-size: 3rem;
      color: #667eea;
      margin-bottom: 20px;
    }

    .feature-card h3 {
      font-size: 1.5rem;
      margin-bottom: 15px;
      color: #333;
    }

    .feature-card p {
      color: #666;
      line-height: 1.6;
    }

    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 30px;
      margin-top: 40px;
    }

    .course-image {
      height: 200px;
      object-fit: cover;
    }

    .course-title {
      font-size: 1.3rem;
      font-weight: bold;
      margin-bottom: 10px;
      color: #333;
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
      background: #e3f2fd;
      color: #1976d2;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.9rem;
      font-weight: 500;
    }

    .course-price {
      font-size: 1.2rem;
      font-weight: bold;
      color: #2e7d32;
    }

    @media (max-width: 768px) {
      .hero-title {
        font-size: 2.5rem;
      }
      
      .hero-actions {
        flex-direction: column;
        align-items: center;
      }
      
      .courses-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class HomeComponent implements OnInit {
  featuredCourses: Course[] = [];

  constructor(
    private courseService: CourseService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.loadFeaturedCourses();
  }

  private loadFeaturedCourses() {
    this.courseService.getCoursesByStatus('PUBLISHED' as any).subscribe({
      next: (courses) => {
        this.featuredCourses = courses.slice(0, 6); // Show first 6 published courses
      },
      error: (error) => {
        console.error('Error loading featured courses:', error);
      }
    });
  }
}
