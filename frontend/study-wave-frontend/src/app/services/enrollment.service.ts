import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';
import { Enrollment, EnrollmentStatus } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  // Use relative URL so the Angular dev-server proxy can route to the backend.
  private readonly API_URL = '/api/enrollments';

  constructor(private http: HttpClient) { }

  enrollInCourse(courseId: number): Observable<any> {
    // Backend: POST /api/enrollments/{courseId}
    return this.http.post<any>(`${this.API_URL}/${courseId}`, {});
  }

  getEnrollmentsByUser(userId: number): Observable<Enrollment[]> {
    // Not supported by backend in the current version.
    return this.http.get<Enrollment[]>(`${this.API_URL}/my-enrollments`);
  }

  getUserEnrollments(): Observable<Enrollment[]> {
    // Backend: GET /api/enrollments/my-enrollments
    return this.http.get<Enrollment[]>(`${this.API_URL}/my-enrollments`);
  }

  getEnrollmentsByCourse(courseId: number): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.API_URL}/course/${courseId}`);
  }

  updateEnrollmentStatus(enrollmentId: number, status: EnrollmentStatus): Observable<Enrollment> {
    return this.http.put<Enrollment>(`${this.API_URL}/${enrollmentId}/status`, { status });
  }

  cancelEnrollment(enrollmentId: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${enrollmentId}`);
  }

  isEnrolled(courseId: number): Observable<boolean> {
    // Backend: GET /api/enrollments/{courseId} returns 404 if not enrolled.
    return this.http.get<Enrollment>(`${this.API_URL}/${courseId}`).pipe(
      map(() => true),
      catchError((err: HttpErrorResponse) => {
        // 404 = not enrolled. For other errors (e.g. 403), treat as not enrolled for UI stability.
        return of(false);
      })
    );
  }
}
