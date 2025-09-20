package com.studywave.service;

import com.studywave.model.Course;
import com.studywave.model.CourseStatus;
import com.studywave.model.Enrollment;
import com.studywave.model.Review;
import com.studywave.repository.CourseRepository;
import com.studywave.repository.EnrollmentRepository;
import com.studywave.repository.ReviewRepository;
import com.studywave.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EnrollmentRepository enrollmentRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private UserRepository userRepository;

    public Map<String, Object> getSummary() {
        Map<String, Object> m = new LinkedHashMap<>();
        long totalUsers = userRepository.count();
        long totalCourses = courseRepository.count();
        long totalPublished = courseRepository.findByStatus(CourseStatus.PUBLISHED).size();
        long totalEnrollments = enrollmentRepository.count();

        m.put("totalUsers", totalUsers);
        m.put("totalCourses", totalCourses);
        m.put("totalPublishedCourses", totalPublished);
        m.put("totalEnrollments", totalEnrollments);
        m.put("topRated", topRatedCourses(5));
        m.put("byCategory", coursesByCategory());
        return m;
    }

    public List<Map<String, Object>> topRatedCourses(int limit) {
        return courseRepository.findByStatus(CourseStatus.PUBLISHED, PageRequest.of(0, limit, Sort.by(Sort.Direction.DESC, "averageRating")))
                .getContent()
                .stream()
                .map(c -> Map.of(
                        "id", c.getId(),
                        "title", c.getTitle(),
                        "averageRating", c.getAverageRating(),
                        "reviewCount", c.getReviewCount()
                ))
                .collect(Collectors.toList());
    }

    public List<Map<String, Object>> coursesByCategory() {
        List<Course> all = courseRepository.findAll();
        Map<String, Long> counts = all.stream()
                .filter(c -> c.getCategory() != null)
                .collect(Collectors.groupingBy(Course::getCategory, Collectors.counting()));
        return counts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .map(e -> Map.of("category", e.getKey(), "count", e.getValue()))
                .collect(Collectors.toList());
    }

    public Map<LocalDate, Long> enrollmentsByDay(int days) {
        LocalDateTime since = LocalDateTime.now().minusDays(days);
        List<Enrollment> all = enrollmentRepository.findAll();
        return all.stream()
                .filter(en -> en.getCreatedAt() != null && en.getCreatedAt().isAfter(since))
                .collect(Collectors.groupingBy(en -> en.getCreatedAt().toLocalDate(), TreeMap::new, Collectors.counting()));
    }

    public Map<LocalDate, Long> reviewsByDay(int days) {
        LocalDateTime since = LocalDateTime.now().minusDays(days);
        List<Review> all = reviewRepository.findAll();
        return all.stream()
                .filter(rv -> rv.getCreatedAt() != null && rv.getCreatedAt().isAfter(since))
                .collect(Collectors.groupingBy(rv -> rv.getCreatedAt().toLocalDate(), TreeMap::new, Collectors.counting()));
    }
}
