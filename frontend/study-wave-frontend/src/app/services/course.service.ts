import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Course, CourseStatus, CourseLevel } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {
  // Use relative URLs so the Angular dev-server proxy can route to the backend.
  private readonly API_URL = '/api/courses';

  constructor(private http: HttpClient) { }

  getAllCourses(): Observable<Course[]> {
    // Backend exposes only published courses at this route.
    return this.http.get<Course[]>(`${this.API_URL}/public`);
  }

  getCourseById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.API_URL}/public/${id}`);
  }

  createCourse(course: Partial<Course>): Observable<Course> {
    return this.http.post<Course>(this.API_URL, course);
  }

  updateCourse(id: number, course: Partial<Course>): Observable<Course> {
    return this.http.put<Course>(`${this.API_URL}/${id}`, course);
  }

  deleteCourse(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  getCoursesByInstructor(instructorId: number): Observable<Course[]> {
    // Backend doesn't support querying by arbitrary instructorId.
    // Use the authenticated instructor endpoint instead.
    return this.http.get<Course[]>(`${this.API_URL}/instructor`);
  }

  getCoursesByStatus(status: CourseStatus): Observable<Course[]> {
    return this.getAllCourses().pipe(
      map(courses => courses.filter(course => course.status === status))
    );
  }

  getCoursesByLevel(level: CourseLevel): Observable<Course[]> {
    return this.getAllCourses().pipe(
      map(courses => courses.filter(course => course.level === level))
    );
  }

  searchCourses(query: string): Observable<Course[]> {
    const keyword = encodeURIComponent(query);
    return this.http.get<Course[]>(`${this.API_URL}/public/search?keyword=${keyword}`);
  }

  getInstructorCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.API_URL}/instructor`);
  }
}
