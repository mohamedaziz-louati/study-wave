import { User } from './user.model';
import { Course } from './course.model';

export interface Enrollment {
  id: number;
  user: User;
  course: Course;
  status: EnrollmentStatus;
  enrolledAt: string;
  completedAt?: string;
  progress?: number;
}

export enum EnrollmentStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  IN_PROGRESS = 'IN_PROGRESS'
}
