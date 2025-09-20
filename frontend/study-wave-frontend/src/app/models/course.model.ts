import { User } from './user.model';

export interface Course {
  id: number;
  title: string;
  description: string;
  instructor: User;
  price: number;
  thumbnailUrl?: string;
  status: CourseStatus;
  level: CourseLevel;
  category?: string;
  duration?: number;
  createdAt: string;
  updatedAt: string;
  lessons?: Lesson[];
  enrolledStudents?: User[];
  enrollments?: Enrollment[];
}

export enum CourseStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED'
}

export enum CourseLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED'
}

export interface Lesson {
  id: number;
  title: string;
  description: string;
  content: string;
  type: LessonType;
  order: number;
  duration: number;
  course: Course;
  createdAt: string;
  updatedAt: string;
}

export enum LessonType {
  VIDEO = 'VIDEO',
  TEXT = 'TEXT',
  QUIZ = 'QUIZ',
  ASSIGNMENT = 'ASSIGNMENT'
}

export interface Enrollment {
  id: number;
  user: User;
  course: Course;
  status: EnrollmentStatus;
  enrolledAt: string;
  completedAt?: string;
}

export enum EnrollmentStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED'
}
