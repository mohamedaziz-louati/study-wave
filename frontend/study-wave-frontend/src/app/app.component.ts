import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from './services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  template: `
    <div class="study-wave-container">
      <nav class="navbar">
        <div class="nav-container">
          <div class="nav-brand">
            <span class="brand-icon">🌊</span>
            <span class="brand-text">STUDY WAVE</span>
          </div>
          <div class="nav-menu">
            <a routerLink="/" class="nav-link" [class.active]="isActiveRoute('/')">Home</a>
            <a routerLink="/courses" class="nav-link" [class.active]="isActiveRoute('/courses')">Courses</a>
            <a routerLink="/dashboard" class="nav-link" [class.active]="isActiveRoute('/dashboard')">Dashboard</a>
            
            <ng-container *ngIf="authService.isAuthenticated(); else notAuthenticated">
              <div class="nav-user">
                <img [src]="getUserAvatar()" [alt]="getUserName()" class="user-avatar" 
                     (error)="onImageError($event)">
                <span class="user-name">{{ getUserName() }}</span>
                <div class="user-dropdown">
                  <a routerLink="/profile">Profile</a>
                  <a routerLink="/dashboard">Dashboard</a>
                  <a (click)="logout()">Logout</a>
                </div>
              </div>
            </ng-container>
            
            <ng-template #notAuthenticated>
              <a routerLink="/login" class="nav-link">Login</a>
              <a routerLink="/register" class="nav-link">Register</a>
            </ng-template>
          </div>
        </div>
      </nav>
      
      <main>
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .study-wave-container {
      min-height: 100vh;
      background: #f8f9fa;
    }

    .navbar {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 1rem 0;
      position: fixed;
      top: 0;
      width: 100%;
      z-index: 1000;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1.5rem;
      font-weight: bold;
    }

    .brand-icon {
      font-size: 2rem;
    }

    .nav-menu {
      display: flex;
      align-items: center;
      gap: 30px;
    }

    .nav-link {
      color: white;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 20px;
      transition: all 0.3s ease;
    }

    .nav-link:hover,
    .nav-link.active {
      background: rgba(255,255,255,0.2);
    }

    .nav-user {
      position: relative;
      display: flex;
      align-items: center;
      gap: 10px;
      cursor: pointer;
      padding: 8px 16px;
      border-radius: 20px;
      transition: all 0.3s ease;
    }

    .nav-user:hover {
      background: rgba(255,255,255,0.1);
    }

    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      object-fit: cover;
    }

    .user-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      background: white;
      color: #333;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      min-width: 150px;
      opacity: 0;
      visibility: hidden;
      transform: translateY(-10px);
      transition: all 0.3s ease;
    }

    .nav-user:hover .user-dropdown {
      opacity: 1;
      visibility: visible;
      transform: translateY(0);
    }

    .user-dropdown a {
      display: block;
      padding: 12px 16px;
      color: #333;
      text-decoration: none;
      transition: background 0.3s ease;
    }

    .user-dropdown a:hover {
      background: #f5f5f5;
    }

    main {
      padding-top: 80px;
      min-height: calc(100vh - 80px);
    }

    @media (max-width: 768px) {
      .nav-menu {
        gap: 15px;
      }
      
      .nav-link {
        padding: 6px 12px;
        font-size: 0.9rem;
      }
    }
  `]
})
export class AppComponent {
  title = 'Study Wave';

  constructor(
    public authService: AuthService,
    private router: Router
  ) {}

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }

  getUserName(): string {
    const user = this.authService.getCurrentUser();
    return user ? `${user.firstName} ${user.lastName}` : 'User';
  }

  getUserAvatar(): string {
    const user = this.authService.getCurrentUser();
    return user?.profilePicture || 'assets/images/default-avatar.jpg';
  }

  onImageError(event: any) {
    event.target.style.display = 'none';
    event.target.nextElementSibling.style.display = 'flex';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
