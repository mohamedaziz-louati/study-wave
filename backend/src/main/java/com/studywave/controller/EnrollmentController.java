package com.studywave.controller;

import com.studywave.model.Course;
import com.studywave.model.Enrollment;
import com.studywave.model.User;
import com.studywave.model.dto.MessageResponse;
import com.studywave.service.CourseService;
import com.studywave.service.EnrollmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/enrollments")
public class EnrollmentController {
    
    @Autowired
    private EnrollmentService enrollmentService;
    
    @Autowired
    private CourseService courseService;

    @PostMapping("/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> enrollInCourse(@PathVariable Long courseId, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Optional<Course> course = courseService.getCourseById(courseId);
        
        if (course.isPresent()) {
            if (enrollmentService.isEnrolled(user, course.get())) {
                return ResponseEntity.badRequest()
                        .body(new MessageResponse("You are already enrolled in this course!"));
            }
            
            Enrollment enrollment = enrollmentService.enrollUser(user, course.get());
            if (enrollment != null) {
                return ResponseEntity.ok(new MessageResponse("Successfully enrolled in the course!"));
            }
        }
        
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/my-enrollments")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<List<Enrollment>> getMyEnrollments(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Enrollment> enrollments = enrollmentService.getUserEnrollments(user);
        return ResponseEntity.ok(enrollments);
    }

    @GetMapping("/{courseId}")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Enrollment> getEnrollment(@PathVariable Long courseId, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Optional<Course> course = courseService.getCourseById(courseId);
        
        if (course.isPresent()) {
            Optional<Enrollment> enrollment = enrollmentService.getEnrollment(user, course.get());
            return enrollment.map(ResponseEntity::ok)
                    .orElse(ResponseEntity.notFound().build());
        }
        
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/{courseId}/progress")
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Enrollment> updateProgress(@PathVariable Long courseId, 
                                                   @RequestParam double progress, 
                                                   Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Optional<Course> course = courseService.getCourseById(courseId);
        
        if (course.isPresent()) {
            Optional<Enrollment> enrollment = enrollmentService.getEnrollment(user, course.get());
            if (enrollment.isPresent()) {
                Enrollment updatedEnrollment = enrollmentService.updateProgress(enrollment.get(), progress);
                return ResponseEntity.ok(updatedEnrollment);
            }
        }
        
        return ResponseEntity.notFound().build();
    }
}
