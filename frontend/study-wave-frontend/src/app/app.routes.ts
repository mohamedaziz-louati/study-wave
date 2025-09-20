import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/auth/login/login.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { CourseListComponent } from './components/course/course-list/course-list.component';
import { CourseDetailComponent } from './components/course/course-detail/course-detail.component';
import { CourseCreateComponent } from './components/course/course-create/course-create.component';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from './guards/auth.guard';
import { instructorGuard } from './guards/instructor.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'courses', 
    component: CourseListComponent 
  },
  { 
    path: 'courses/:id', 
    component: CourseDetailComponent 
  },
  { 
    path: 'create-course', 
    component: CourseCreateComponent, 
    canActivate: [authGuard, instructorGuard] 
  },
  { 
    path: 'profile', 
    component: ProfileComponent, 
    canActivate: [authGuard] 
  },
  { path: '**', redirectTo: '' }
];
