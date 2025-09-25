# STUDY WAVE - E-Learning Platform

A modern e-learning platform built with Spring Boot and Angular, designed to deliver educational content and facilitate remote learning experiences.

## Features

- **User Authentication**: Secure JWT-based login and registration system
- **Course Management**: Create, browse, and manage courses with lessons and reviews
- **Enrollment System**: Students can enroll in courses and track progress
- **Instructor Dashboard**: Course creation, management, and analytics tools
- **Student Dashboard**: Track learning progress and view enrolled courses
- **Modern UI**: Responsive design with Angular Material components
- **Real-time Analytics**: Course statistics and user engagement metrics
- **Role-based Access Control**: Admin, Instructor, and Student roles

## Tech Stack

### Backend
- **Spring Boot 3.2.0** - Main framework
- **Spring Security** with JWT authentication
- **Spring Data JPA** with Hibernate
- **H2 Database** (in-memory for development)
- **Maven** for dependency management
- **Jackson** with Hibernate6 module for JSON serialization
- **Java 17** runtime requirement

### Frontend
- **Angular 17** with TypeScript
- **Angular Material** for UI components
- **Angular CDK** for advanced components
- **RxJS** for reactive programming
- **SCSS** for styling
- **Angular Service Worker** for PWA capabilities

## Project Structure

```
study-wave/
├── backend/                    # Spring Boot backend
│   ├── src/main/java/com/studywave/
│   │   ├── config/            # Configuration classes
│   │   ├── controller/        # REST API controllers
│   │   ├── model/            # JPA entities and DTOs
│   │   ├── repository/       # JPA repositories
│   │   ├── security/         # Security configuration
│   │   └── service/         # Business logic services
│   ├── src/main/resources/
│   │   └── application.yml   # Application configuration
│   └── pom.xml               # Maven dependencies
└── frontend/
    └── study-wave-frontend/   # Angular application
        ├── src/app/
        │   ├── components/   # Angular components
        │   ├── guards/       # Route guards
        │   ├── interceptors/ # HTTP interceptors
        │   ├── models/       # TypeScript models
        │   └── services/     # Angular services
        ├── proxy.conf.json    # Development proxy configuration
        └── package.json      # Node.js dependencies
```

## Prerequisites

- **Java 17** or higher
- **Node.js 18** or higher
- **Maven 3.6** or higher
- **Angular CLI 17** (installed globally)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/mohamedaziz-louati/study-wave.git
cd study-wave
```

### 2. Backend Setup

The backend uses Spring profiles with sensible defaults:

- `dev` (default): H2 in-memory database, auto schema creation, H2 console enabled
- `prod`: Production-ready configuration with external database support

#### Development Mode

1. Navigate to the backend directory:
```bash
cd backend
```

2. Run the application:
```bash
mvn spring-boot:run
```

3. The backend will be available at **http://localhost:8081**

4. Access the H2 Database Console at **http://localhost:8081/h2-console**
   - JDBC URL: `jdbc:h2:mem:studywavedb`
   - Username: `sa`
   - Password: (leave empty)

#### Production Mode

```bash
mvn spring-boot:run -Dspring-boot.run.profiles=prod
```

#### Environment Variables

- `JWT_SECRET` — Secret key for JWT signing (defaults to dev secret in dev mode)
- `CORS_ALLOWED_ORIGINS` — Allowed CORS origins (defaults to `http://localhost:4200`)

### 3. Frontend Setup

The Angular development server is configured with a proxy to forward API calls to the backend.

1. Navigate to the frontend directory:
```bash
cd frontend/study-wave-frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. The frontend will be available at **http://localhost:4200**

**Note**: The frontend proxy configuration automatically forwards `/api` and `/h2-console` requests to `http://localhost:8081`, preventing CORS issues.

### 4. Access the Application

- **Frontend Application**: http://localhost:4200
- **Backend API**: http://localhost:8081/api
- **H2 Database Console**: http://localhost:8081/h2-console

## API Endpoints

### Authentication
- `POST /api/auth/signin` - User login
- `POST /api/auth/signup` - User registration

### Courses
- `GET /api/courses` - Get all courses (public)
- `GET /api/courses/{id}` - Get course by ID (public)
- `POST /api/courses` - Create course (instructor/admin only)
- `PUT /api/courses/{id}` - Update course (instructor/admin only)
- `DELETE /api/courses/{id}` - Delete course (admin only)

### Lessons
- `GET /api/lessons/course/{courseId}` - Get lessons for a course
- `POST /api/lessons` - Create lesson (instructor only)
- `PUT /api/lessons/{id}` - Update lesson (instructor only)

### Enrollments
- `POST /api/enrollments/enroll` - Enroll in course
- `GET /api/enrollments/user/{userId}` - Get user enrollments
- `GET /api/enrollments/course/{courseId}` - Get course enrollments

### Reviews
- `POST /api/reviews` - Add course review
- `GET /api/reviews/course/{courseId}` - Get course reviews

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard statistics (admin only)

## Default Users

The application comes with pre-configured users for testing:

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Instructor | instructor | instructor123 |
| Student | student | student123 |

## Database Schema

The application uses the following main entities:

- **Users**: User accounts with roles (ADMIN, INSTRUCTOR, STUDENT)
- **Courses**: Course information with title, description, level, and status
- **Lessons**: Course content with different types (VIDEO, TEXT, QUIZ)
- **Enrollments**: Student course enrollments with status tracking
- **Reviews**: Course ratings and feedback

## Development Notes

### Backend Configuration

- Server runs on port **8081** (configurable in `application.yml`)
- JWT tokens expire after 24 hours
- CORS is configured for `http://localhost:4200` in development
- H2 database schema is auto-created/updated in development mode

### Frontend Configuration

- Angular dev server runs on port **4200**
- Proxy configuration forwards API calls to backend
- Angular Material theme provides consistent styling
- Route guards protect authenticated and role-based routes

### Security Features

- JWT-based authentication
- Password encryption with BCrypt
- Role-based authorization
- CORS protection
- Input validation and sanitization

## Building for Production

### Backend

```bash
cd backend
mvn clean package
java -jar target/study-wave-backend-0.0.1-SNAPSHOT.jar
```

### Frontend

```bash
cd frontend/study-wave-frontend
npm run build
```

The built frontend files will be in the `dist/study-wave-frontend/` directory.

## Troubleshooting

### Common Issues

1. **Port conflicts**: Ensure ports 8081 and 4200 are available
2. **CORS errors**: Verify the proxy configuration in `proxy.conf.json`
3. **Database connection**: Check H2 console credentials if database errors occur
4. **Maven build failures**: Ensure Java 17 is being used (`java -version`)

### Development Tips

- Use the H2 console to inspect the database during development
- Check browser console for frontend errors
- Review backend logs for API issues
- Use Angular CLI commands for component generation

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details
