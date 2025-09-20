# STUDY WAVE - E-Learning Platform

An e-learning platform built using Spring Boot and Angular, designed to deliver educational content and facilitate remote learning experiences.

## Features

- **User Authentication**: Secure login and registration system
- **Course Management**: Create, browse, and manage courses
- **Enrollment System**: Students can enroll in courses
- **Instructor Dashboard**: Course creation and management tools
- **Student Dashboard**: Track learning progress
- **Modern UI**: Responsive design with Angular Material

## Tech Stack

### Backend
- Spring Boot 3.2.0
- Spring Security with JWT
- Spring Data JPA
- H2 Database (in-memory)
- Maven

### Frontend
- Angular 17
- Angular Material
- TypeScript
- SCSS

## Getting Started

### Prerequisites
- Java 17+
- Node.js 18+
- Maven 3.6+

### Backend Setup
The backend uses Spring profiles with sensible defaults:

- `dev` (default): H2 in-memory DB, schema auto created/dropped, H2 console enabled at `/h2-console`.
- `prod`: No schema auto DDL, quieter logging. Configure a real datasource via env vars.

Env variables:

- `JWT_SECRET` — secret key for signing/validating JWTs (defaults to `dev-secret` in dev).
- `CORS_ALLOWED_ORIGINS` — comma-separated list of allowed origins (defaults to `http://localhost:4200`).

Run (Dev):

1. Navigate to the `backend/` directory
2. Run: `mvn spring-boot:run`
3. Backend will be available at http://localhost:8080

Run (Prod profile example):

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=prod -Dspring-boot.run.jvmArguments="-DJWT_SECRET=change-me -DCORS_ALLOWED_ORIGINS=https://your-domain"
```

### Frontend Setup
The Angular dev server is configured with a proxy to the backend, so calls to `/api` and `/h2-console` are forwarded to `http://localhost:8080` without CORS issues.

1. Navigate to `frontend/study-wave-frontend`
2. Run: `npm install`
3. Run: `npm start`
4. Frontend will be available at http://localhost:4200

## API Endpoints

### Authentication
- POST `/api/auth/signin` - User login
- POST `/api/auth/signup` - User registration

### Courses
- GET `/api/courses` - Get all courses
- GET `/api/courses/{id}` - Get course by ID
- POST `/api/courses` - Create course (instructor only)
- PUT `/api/courses/{id}` - Update course (instructor only)

### Enrollments
- POST `/api/enrollments/enroll` - Enroll in course
- GET `/api/enrollments/user/{userId}` - Get user enrollments

## Default Users
- Username: admin, Password: admin123 (Admin)
- Username: instructor, Password: instructor123 (Instructor)
- Username: student, Password: student123 (Student)

## License
MIT License
