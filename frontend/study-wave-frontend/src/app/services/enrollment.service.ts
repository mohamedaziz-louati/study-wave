import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enrollment, EnrollmentStatus } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {
  private readonly API_URL = 'http://localhost:8080/api/enrollments';

  constructor(private http: HttpClient) { }

  enrollInCourse(courseId: number): Observable<Enrollment> {
    return this.http.post<Enrollment>(`${this.API_URL}/enroll`, { courseId });
  }

  getEnrollmentsByUser(userId: number): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.API_URL}/user/${userId}`);
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
    return this.http.get<boolean>(`${this.API_URL}/check/${courseId}`);
  }
}
