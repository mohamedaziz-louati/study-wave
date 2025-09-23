import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
    MatGridListModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">Welcome to Study Wave</h1>
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
              <div class="feature-icon-wrap">
                <mat-icon class="feature-icon">video_library</mat-icon>
              </div>
              <h3 class="feature-title">Interactive Learning</h3>
              <p>Engage with high-quality video content and interactive lessons</p>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
        <mat-grid-tile>
          <mat-card class="feature-card card-elevation">
            <mat-card-content>
              <div class="feature-icon-wrap">
                <mat-icon class="feature-icon">schedule</mat-icon>
              </div>
              <h3 class="feature-title">Flexible Schedule</h3>
              <p>Learn at your own pace with 24/7 access to all content</p>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
        <mat-grid-tile>
          <mat-card class="feature-card card-elevation">
            <mat-card-content>
              <div class="feature-icon-wrap">
                <mat-icon class="feature-icon">support</mat-icon>
              </div>
              <h3 class="feature-title">Expert Support</h3>
              <p>Get help from experienced instructors and community</p>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
      </mat-grid-list>
    </div>

    <div class="courses-section">
      <h2 class="section-title">Featured Courses</h2>

      <div class="loading-container" *ngIf="isLoading">
        <mat-progress-spinner mode="indeterminate" diameter="48"></mat-progress-spinner>
        <p>Loading featured courses...</p>
      </div>

      <div class="courses-grid" *ngIf="!isLoading && featuredCourses.length > 0">
        <mat-card *ngFor="let course of featuredCourses" class="course-card card-elevation">
          <div class="course-image-wrapper">
            <img
              mat-card-image
              [src]="course.thumbnailUrl || '/assets/images/course-placeholder.jpg'"
              [alt]="course.title"
              class="course-image"
            >
            <div class="course-image-overlay">
              <span class="course-level">{{ course.level }}</span>
            </div>
          </div>
          <mat-card-content>
            <h3 class="course-title">{{ course.title }}</h3>
            <p class="course-description">{{ course.description | slice:0:100 }}...</p>
            <div class="course-meta">
              <span class="course-price">\${{ course.price }}</span>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-stroked-button color="primary" class="course-view-btn" [routerLink]="['/courses', course.id]">
              View Details
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <div class="no-courses" *ngIf="!isLoading && featuredCourses.length === 0">
        <mat-icon class="no-courses-icon">school</mat-icon>
        <h3>No featured courses right now</h3>
        <p>Check back later or browse all available courses.</p>
        <button mat-raised-button color="primary" routerLink="/courses">
          Browse Courses
        </button>
      </div>
    </div>
  `,
  styles: [`
    .hero-section {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 80px 20px;
      text-align: center;
      margin: 0 0 40px 0;
    }

    .hero-content {
      max-width: 800px;
      margin: 0 auto;
    }

    .hero-title {
      font-size: 3.5rem;
      font-weight: bold;
      margin-bottom: 20px;
      color: #ffffff;
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

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      padding: 40px 20px;
    }

    .loading-container p {
      color: #666;
      margin: 0;
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
      display: block;
    }

    .no-courses h3 {
      font-size: 1.5rem;
      margin-bottom: 10px;
      color: #333;
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
      border-radius: 18px;
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(0, 0, 0, 0.05);
      overflow: hidden;
      transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
    }

    .feature-card:hover {
      transform: translateY(-6px);
      border-color: rgba(102, 126, 234, 0.35);
      box-shadow: 0 16px 30px rgba(102, 126, 234, 0.18);
    }

    .feature-icon-wrap {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      margin: 0 auto 18px auto;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.25);
    }

    .feature-icon {
      font-size: 3rem;
      color: #ffffff;
    }

    .feature-title {
      font-size: 1.5rem;
      margin-bottom: 12px;
      color: #2b2b2b;
      font-weight: 700;
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

    .course-card {
      border-radius: 18px;
      overflow: hidden;
      background: rgba(255, 255, 255, 0.92);
      border: 1px solid rgba(0, 0, 0, 0.06);
      transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
      box-shadow: 0 10px 20px rgba(0, 0, 0, 0.06);
      cursor: default;
      height: 100%;
    }

    .course-card:hover {
      transform: translateY(-6px);
      border-color: rgba(102, 126, 234, 0.35);
      box-shadow: 0 20px 40px rgba(102, 126, 234, 0.14);
    }

    .course-image-wrapper {
      position: relative;
      height: 180px;
      background: #f0f0f0;
    }

    .course-image {
      object-fit: cover;
      width: 100%;
      height: 100%;
    }

    .course-image-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.35) 100%);
      display: flex;
      align-items: flex-start;
      justify-content: flex-start;
      padding: 14px;
      pointer-events: none;
    }

    .course-title {
      font-size: 1.3rem;
      font-weight: bold;
      margin: 16px 0 8px 0;
      color: #1f2937;
    }

    .course-description {
      color: #666;
      margin-bottom: 0;
      line-height: 1.5;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .course-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 14px 0 6px 0;
    }

    .course-level {
      background: rgba(255, 255, 255, 0.92);
      color: #2a5db0;
      padding: 6px 12px;
      border-radius: 20px;
      font-size: 0.85rem;
      font-weight: 500;
      box-shadow: 0 10px 20px rgba(0,0,0,0.06);
    }

    .course-price {
      font-size: 1.15rem;
      font-weight: bold;
      color: #2e7d32;
    }

    .course-card mat-card-content {
      padding: 0 16px 0 16px;
    }

    .course-card mat-card-actions {
      padding: 14px 16px 16px 16px;
    }

    .course-view-btn {
      width: 100%;
      border-radius: 14px;
      padding: 10px 14px;
      font-weight: 600;
      transition: background 0.2s ease, border-color 0.2s ease, color 0.2s ease;
    }

    .course-card:hover .course-view-btn {
      background: rgba(102, 126, 234, 0.12);
      border-color: rgba(102, 126, 234, 0.55);
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
  isLoading = false;

  constructor(
    private courseService: CourseService,
    public authService: AuthService
  ) { }

  ngOnInit() {
    this.loadFeaturedCourses();
  }

  private loadFeaturedCourses() {
    this.isLoading = true;
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.featuredCourses = courses.slice(0, 6); // Show first 6 published courses
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading featured courses:', error);
        this.isLoading = false;
      }
    });
  }
}
