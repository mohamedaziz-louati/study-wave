package com.studywave.service;

import com.studywave.model.Course;
import com.studywave.model.CourseStatus;
import com.studywave.model.User;
import com.studywave.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class CourseService {
    
    @Autowired
    private CourseRepository courseRepository;

    public List<Course> getAllPublishedCourses() {
        return courseRepository.findByStatus(CourseStatus.PUBLISHED);
    }

    public Page<Course> getAllPublishedCourses(Pageable pageable) {
        return courseRepository.findByStatus(CourseStatus.PUBLISHED, pageable);
    }

    public List<Course> getCoursesByInstructor(User instructor) {
        return courseRepository.findByInstructor(instructor);
    }

    public List<Course> searchCourses(String keyword) {
        return courseRepository.searchByKeyword(keyword, CourseStatus.PUBLISHED);
    }

    public Page<Course> searchCourses(String keyword, Pageable pageable) {
        return courseRepository.searchByKeyword(keyword, CourseStatus.PUBLISHED, pageable);
    }

    public List<Course> getCoursesByCategory(String category) {
        return courseRepository.findByCategory(category);
    }

    public Page<Course> getCoursesByCategory(String category, Pageable pageable) {
        return courseRepository.findByCategoryAndStatus(category, CourseStatus.PUBLISHED, pageable);
    }

    public List<Course> getEnrolledCourses(User user) {
        return courseRepository.findByEnrolledStudent(user.getId());
    }

    public Optional<Course> getCourseById(Long id) {
        return courseRepository.findById(id);
    }

    public Course createCourse(Course course) {
        return courseRepository.save(course);
    }

    public Course updateCourse(Course course) {
        return courseRepository.save(course);
    }

    public void deleteCourse(Long id) {
        courseRepository.deleteById(id);
    }
}
