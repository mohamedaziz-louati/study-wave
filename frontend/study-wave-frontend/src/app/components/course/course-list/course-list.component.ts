import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CourseService } from '../../../services/course.service';
import { Course, CourseLevel, CourseStatus } from '../../../models/course.model';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="course-list-container">
      <div class="header-section">
        <h1 class="page-title">Explore Courses</h1>
        <p class="page-subtitle">Discover amazing learning opportunities</p>
      </div>

      <!-- Search and Filter Section -->
      <div class="search-filter-section">
        <mat-form-field appearance="outline" class="search-field">
          <mat-label>Search courses</mat-label>
          <input matInput [(ngModel)]="searchQuery" (input)="onSearch()" 
                 placeholder="Enter course title, instructor, or topic...">
          <mat-icon matSuffix>search</mat-icon>
        </mat-form-field>

        <div class="filter-controls">
          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>Level</mat-label>
            <mat-select [(ngModel)]="selectedLevel" (selectionChange)="applyFilters()">
              <mat-option value="">All Levels</mat-option>
              <mat-option value="BEGINNER">Beginner</mat-option>
              <mat-option value="INTERMEDIATE">Intermediate</mat-option>
              <mat-option value="ADVANCED">Advanced</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="filter-field">
            <mat-label>Category</mat-label>
            <mat-select [(ngModel)]="selectedCategory" (selectionChange)="applyFilters()">
              <mat-option value="">All Categories</mat-option>
              <mat-option *ngFor="let category of categories" [value]="category">
                {{ category }}
              </mat-option>
            </mat-select>
          </mat-form-field>

          <button mat-stroked-button (click)="clearFilters()" class="clear-filters-btn">
            <mat-icon>clear</mat-icon>
            Clear Filters
          </button>
        </div>
      </div>

      <!-- Results Section -->
      <div class="results-section">
        <div class="results-header">
          <h2>{{ filteredCourses.length }} courses found</h2>
          <div class="sort-controls">
            <mat-form-field appearance="outline" class="sort-field">
              <mat-label>Sort by</mat-label>
              <mat-select [(ngModel)]="sortBy" (selectionChange)="applySorting()">
                <mat-option value="title">Title</mat-option>
                <mat-option value="price">Price</mat-option>
                <mat-option value="createdAt">Newest</mat-option>
                <mat-option value="level">Level</mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </div>

        <!-- Loading Spinner -->
        <div *ngIf="isLoading" class="loading-container">
          <mat-spinner></mat-spinner>
          <p>Loading courses...</p>
        </div>

        <!-- Courses Grid -->
        <div *ngIf="!isLoading && filteredCourses.length > 0" class="courses-grid">
          <mat-card *ngFor="let course of filteredCourses" class="course-card card-elevation">
            <img mat-card-image [src]="course.thumbnailUrl || '/assets/images/course-placeholder.jpg'" 
                 [alt]="course.title" class="course-image">
            <mat-card-content>
              <div class="course-header">
                <h3 class="course-title">{{ course.title }}</h3>
                <mat-chip [color]="getLevelColor(course.level)" selected>
                  {{ course.level }}
                </mat-chip>
              </div>
              <p class="course-description">{{ course.description | slice:0:120 }}...</p>
              <div class="course-meta">
                <div class="instructor-info">
                  <mat-icon class="instructor-icon">person</mat-icon>
                  <span>{{ course.instructor.firstName }} {{ course.instructor.lastName }}</span>
                </div>
                <div class="course-stats">
                  <span class="course-duration" *ngIf="course.duration">
                    <mat-icon>schedule</mat-icon>
                    {{ course.duration }} min
                  </span>
                  <span class="course-students" *ngIf="course.enrolledStudents">
                    <mat-icon>people</mat-icon>
                    {{ course.enrolledStudents.length }} students
                  </span>
                </div>
              </div>
              <div class="course-footer">
                <span class="course-price">${{ course.price }}</span>
                <span class="course-category" *ngIf="course.category">{{ course.category }}</span>
              </div>
            </mat-card-content>
            <mat-card-actions>
              <button mat-button color="primary" [routerLink]="['/courses', course.id]">
                View Details
              </button>
              <button mat-icon-button [matMenuTriggerFor]="courseMenu" class="menu-button">
                <mat-icon>more_vert</mat-icon>
              </button>
              <mat-menu #courseMenu="matMenu">
                <button mat-menu-item>
                  <mat-icon>favorite_border</mat-icon>
                  Add to Wishlist
                </button>
                <button mat-menu-item>
                  <mat-icon>share</mat-icon>
                  Share
                </button>
              </mat-menu>
            </mat-card-actions>
          </mat-card>
        </div>

        <!-- No Results -->
        <div *ngIf="!isLoading && filteredCourses.length === 0" class="no-results">
          <mat-icon class="no-results-icon">search_off</mat-icon>
          <h3>No courses found</h3>
          <p>Try adjusting your search criteria or browse all courses</p>
          <button mat-raised-button color="primary" (click)="clearFilters()">
            Show All Courses
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .course-list-container {
      max-width: 1200px;
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

    .search-filter-section {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      margin-bottom: 30px;
    }

    .search-field {
      width: 100%;
      margin-bottom: 20px;
    }

    .filter-controls {
      display: flex;
      gap: 20px;
      align-items: center;
      flex-wrap: wrap;
    }

    .filter-field {
      min-width: 150px;
    }

    .clear-filters-btn {
      margin-left: auto;
    }

    .results-section {
      background: white;
      padding: 30px;
      border-radius: 12px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .results-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      flex-wrap: wrap;
      gap: 20px;
    }

    .results-header h2 {
      margin: 0;
      color: #333;
    }

    .sort-field {
      min-width: 150px;
    }

    .loading-container {
      text-align: center;
      padding: 60px 20px;
    }

    .courses-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 30px;
    }

    .course-card {
      transition: transform 0.2s ease-in-out;
      cursor: pointer;
    }

    .course-card:hover {
      transform: translateY(-4px);
    }

    .course-image {
      height: 200px;
      object-fit: cover;
    }

    .course-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
    }

    .course-title {
      font-size: 1.3rem;
      font-weight: bold;
      margin: 0;
      color: #333;
      flex: 1;
      margin-right: 10px;
    }

    .course-description {
      color: #666;
      margin-bottom: 15px;
      line-height: 1.5;
    }

    .course-meta {
      margin-bottom: 15px;
    }

    .instructor-info {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 8px;
      color: #666;
    }

    .instructor-icon {
      font-size: 1.2rem;
    }

    .course-stats {
      display: flex;
      gap: 20px;
      color: #666;
      font-size: 0.9rem;
    }

    .course-stats span {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .course-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 15px;
    }

    .course-price {
      font-size: 1.4rem;
      font-weight: bold;
      color: #2e7d32;
    }

    .course-category {
      background: #e3f2fd;
      color: #1976d2;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
    }

    .menu-button {
      margin-left: auto;
    }

    .no-results {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .no-results-icon {
      font-size: 4rem;
      color: #ccc;
      margin-bottom: 20px;
    }

    .no-results h3 {
      font-size: 1.5rem;
      margin-bottom: 10px;
      color: #333;
    }

    .no-results p {
      margin-bottom: 20px;
    }

    @media (max-width: 768px) {
      .page-title {
        font-size: 2rem;
      }
      
      .filter-controls {
        flex-direction: column;
        align-items: stretch;
      }
      
      .clear-filters-btn {
        margin-left: 0;
      }
      
      .results-header {
        flex-direction: column;
        align-items: stretch;
      }
      
      .courses-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CourseListComponent implements OnInit {
  courses: Course[] = [];
  filteredCourses: Course[] = [];
  isLoading = false;
  searchQuery = '';
  selectedLevel = '';
  selectedCategory = '';
  categories: string[] = [];
  sortBy = 'title';

  constructor(private courseService: CourseService) { }

  ngOnInit() {
    this.loadCourses();
  }

  private loadCourses() {
    this.isLoading = true;
    this.courseService.getAllCourses().subscribe({
      next: (courses) => {
        this.courses = courses.filter(c => c.status === CourseStatus.PUBLISHED);
        this.filteredCourses = [...this.courses];
        this.extractCategories();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading courses:', error);
        this.isLoading = false;
      }
    });
  }

  private extractCategories() {
    const categorySet = new Set<string>();
    this.courses.forEach(course => {
      if (course.category) {
        categorySet.add(course.category);
      }
    });
    this.categories = Array.from(categorySet).sort();
  }

  onSearch() {
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.courses];

    // Search filter
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query) ||
        course.instructor.firstName.toLowerCase().includes(query) ||
        course.instructor.lastName.toLowerCase().includes(query) ||
        (course.category && course.category.toLowerCase().includes(query))
      );
    }

    // Level filter
    if (this.selectedLevel) {
      filtered = filtered.filter(course => course.level === this.selectedLevel);
    }

    // Category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(course => course.category === this.selectedCategory);
    }

    this.filteredCourses = filtered;
    this.applySorting();
  }

  applySorting() {
    this.filteredCourses.sort((a, b) => {
      switch (this.sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'price':
          return a.price - b.price;
        case 'createdAt':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'level':
          const levelOrder = { 'BEGINNER': 1, 'INTERMEDIATE': 2, 'ADVANCED': 3 };
          return levelOrder[a.level] - levelOrder[b.level];
        default:
          return 0;
      }
    });
  }

  clearFilters() {
    this.searchQuery = '';
    this.selectedLevel = '';
    this.selectedCategory = '';
    this.sortBy = 'title';
    this.filteredCourses = [...this.courses];
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
}
