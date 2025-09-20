package com.studywave.repository;

import com.studywave.model.Course;
import com.studywave.model.Review;
import com.studywave.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    Page<Review> findByCourse(Course course, Pageable pageable);
    Optional<Review> findByCourseAndUser(Course course, User user);
    long countByCourse(Course course);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.course.id = :courseId")
    Double averageRatingByCourseId(@Param("courseId") Long courseId);
}
