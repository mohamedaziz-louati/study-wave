package com.studywave.service;

import com.studywave.model.Course;
import com.studywave.model.Review;
import com.studywave.model.User;
import com.studywave.repository.CourseRepository;
import com.studywave.repository.ReviewRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private EnrollmentService enrollmentService;

    public Page<Review> getCourseReviews(Course course, Pageable pageable) {
        return reviewRepository.findByCourse(course, pageable);
    }

    public Optional<Review> getUserReviewForCourse(Course course, User user) {
        return reviewRepository.findByCourseAndUser(course, user);
    }

    @Transactional
    public Review addOrUpdateReview(Course course, User user, int rating, String comment) {
        // Ensure user is enrolled in the course
        if (!enrollmentService.isEnrolled(user, course)) {
            throw new IllegalArgumentException("User must be enrolled in the course to leave a review");
        }

        Review review = reviewRepository.findByCourseAndUser(course, user)
                .orElse(new Review(course, user, rating, comment));
        review.setRating(rating);
        review.setComment(comment);

        Review saved = reviewRepository.save(review);

        // Update aggregates on Course
        updateCourseAggregates(course);

        return saved;
    }

    @Transactional
    public void updateCourseAggregates(Course course) {
        Long courseId = course.getId();
        if (courseId == null) return;
        Double avg = reviewRepository.averageRatingByCourseId(courseId);
        long count = reviewRepository.countByCourse(course);
        course.setAverageRating(avg != null ? Math.round(avg * 100.0) / 100.0 : null);
        course.setReviewCount((int) count);
        courseRepository.save(course);
    }
}
