package com.studywave.service;

import com.studywave.model.Course;
import com.studywave.model.Enrollment;
import com.studywave.model.User;
import com.studywave.repository.EnrollmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EnrollmentService {
    
    @Autowired
    private EnrollmentRepository enrollmentRepository;

    public boolean isEnrolled(User user, Course course) {
        return enrollmentRepository.existsByUserAndCourse(user, course);
    }

    public Enrollment enrollUser(User user, Course course) {
        if (!isEnrolled(user, course)) {
            Enrollment enrollment = new Enrollment(user, course);
            return enrollmentRepository.save(enrollment);
        }
        return null; // Already enrolled
    }

    public List<Enrollment> getUserEnrollments(User user) {
        return enrollmentRepository.findByUser(user);
    }

    public Optional<Enrollment> getEnrollment(User user, Course course) {
        return enrollmentRepository.findByUserAndCourse(user, course);
    }

    public Enrollment updateProgress(Enrollment enrollment, double progress) {
        enrollment.setProgress(java.math.BigDecimal.valueOf(progress));
        if (progress >= 100) {
            enrollment.setCompletedAt(java.time.LocalDateTime.now());
        }
        return enrollmentRepository.save(enrollment);
    }
}
