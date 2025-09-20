package com.studywave.config;

import com.studywave.model.*;
import com.studywave.repository.CourseRepository;
import com.studywave.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.List;

@Configuration
@Profile("dev")
public class DataInitializer {

    @Bean
    CommandLineRunner initData(UserRepository userRepository,
                               CourseRepository courseRepository,
                               PasswordEncoder passwordEncoder) {
        return args -> {
            // Seed users if not present
            if (userRepository.count() == 0) {
                User admin = new User("admin", "admin@example.com", passwordEncoder.encode("admin123"), "Admin", "User");
                admin.setRole(Role.ADMIN);

                User instructor = new User("instructor", "instructor@example.com", passwordEncoder.encode("instructor123"), "Jane", "Instructor");
                instructor.setRole(Role.INSTRUCTOR);

                User student = new User("student", "student@example.com", passwordEncoder.encode("student123"), "John", "Student");
                student.setRole(Role.STUDENT);

                userRepository.saveAll(List.of(admin, instructor, student));
            }

            // Seed a few courses if none exist
            if (courseRepository.count() == 0) {
                User instructor = userRepository.findByUsername("instructor").orElse(null);
                if (instructor != null) {
                    Course c1 = new Course("Angular Fundamentals",
                            "Learn the basics of Angular and build modern SPAs.",
                            instructor,
                            new BigDecimal("49.99"));
                    c1.setStatus(CourseStatus.PUBLISHED);
                    c1.setLevel(CourseLevel.BEGINNER);
                    c1.setCategory("Programming");
                    c1.setDuration(180);

                    Course c2 = new Course("Spring Boot API Development",
                            "Build robust REST APIs with Spring Boot.",
                            instructor,
                            new BigDecimal("59.99"));
                    c2.setStatus(CourseStatus.PUBLISHED);
                    c2.setLevel(CourseLevel.INTERMEDIATE);
                    c2.setCategory("Backend");
                    c2.setDuration(240);

                    Course c3 = new Course("Advanced TypeScript",
                            "Master advanced TypeScript patterns.",
                            instructor,
                            new BigDecimal("39.99"));
                    c3.setStatus(CourseStatus.DRAFT);
                    c3.setLevel(CourseLevel.ADVANCED);
                    c3.setCategory("Programming");
                    c3.setDuration(200);

                    courseRepository.saveAll(List.of(c1, c2, c3));
                }
            }
        };
    }
}
