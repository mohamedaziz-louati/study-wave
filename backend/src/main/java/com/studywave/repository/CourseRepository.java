package com.studywave.repository;

import com.studywave.model.Course;
import com.studywave.model.CourseStatus;
import com.studywave.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByStatus(CourseStatus status);
    List<Course> findByInstructor(User instructor);
    List<Course> findByCategory(String category);
    List<Course> findByLevel(String level);
    
    @Query("SELECT c FROM Course c WHERE c.status = :status AND (c.title LIKE %:keyword% OR c.description LIKE %:keyword%)")
    List<Course> searchByKeyword(@Param("keyword") String keyword, @Param("status") CourseStatus status);
    
    @Query("SELECT c FROM Course c JOIN c.enrolledStudents s WHERE s.id = :userId")
    List<Course> findByEnrolledStudent(@Param("userId") Long userId);

    // Pageable variants
    Page<Course> findByStatus(CourseStatus status, Pageable pageable);
    Page<Course> findByCategoryAndStatus(String category, CourseStatus status, Pageable pageable);

    @Query("SELECT c FROM Course c WHERE c.status = :status AND (LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(c.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Course> searchByKeyword(@Param("keyword") String keyword, @Param("status") CourseStatus status, Pageable pageable);
}
