package com.studywave.controller;

import com.studywave.model.Course;
import com.studywave.model.User;
import com.studywave.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import jakarta.validation.Valid;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/courses")
public class CourseController {
    
    @Autowired
    private CourseService courseService;

    @GetMapping("/public")
    public ResponseEntity<List<Course>> getAllPublishedCourses() {
        List<Course> courses = courseService.getAllPublishedCourses();
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/public/page")
    public ResponseEntity<Page<Course>> getAllPublishedCoursesPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort
    ) {
        Pageable pageable = toPageable(page, size, sort);
        Page<Course> courses = courseService.getAllPublishedCourses(pageable);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/public/search")
    public ResponseEntity<List<Course>> searchCourses(@RequestParam String keyword) {
        List<Course> courses = courseService.searchCourses(keyword);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/public/search/page")
    public ResponseEntity<Page<Course>> searchCoursesPaged(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort
    ) {
        Pageable pageable = toPageable(page, size, sort);
        Page<Course> courses = courseService.searchCourses(keyword, pageable);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/public/category/{category}")
    public ResponseEntity<List<Course>> getCoursesByCategory(@PathVariable String category) {
        List<Course> courses = courseService.getCoursesByCategory(category);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/public/category/{category}/page")
    public ResponseEntity<Page<Course>> getCoursesByCategoryPaged(
            @PathVariable String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort
    ) {
        Pageable pageable = toPageable(page, size, sort);
        Page<Course> courses = courseService.getCoursesByCategory(category, pageable);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/public/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        Optional<Course> course = courseService.getCourseById(id);
        return course.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/my-courses")
    @PreAuthorize("hasRole('STUDENT') or hasRole('INSTRUCTOR')")
    public ResponseEntity<List<Course>> getMyCourses(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Course> courses = courseService.getEnrolledCourses(user);
        return ResponseEntity.ok(courses);
    }

    @GetMapping("/instructor")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<List<Course>> getInstructorCourses(Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        List<Course> courses = courseService.getCoursesByInstructor(user);
        return ResponseEntity.ok(courses);
    }

    @PostMapping
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Course> createCourse(@Valid @RequestBody Course course, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        course.setInstructor(user);
        Course createdCourse = courseService.createCourse(course);
        return ResponseEntity.ok(createdCourse);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<Course> updateCourse(@PathVariable Long id, @Valid @RequestBody Course course, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Optional<Course> existingCourse = courseService.getCourseById(id);
        
        if (existingCourse.isPresent()) {
            Course courseToUpdate = existingCourse.get();
            if (courseToUpdate.getInstructor().getId().equals(user.getId()) || user.getRole().name().equals("ADMIN")) {
                course.setId(id);
                course.setInstructor(courseToUpdate.getInstructor());
                Course updatedCourse = courseService.updateCourse(course);
                return ResponseEntity.ok(updatedCourse);
            } else {
                return ResponseEntity.forbidden().build();
            }
        }
        return ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMIN')")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id, Authentication authentication) {
        User user = (User) authentication.getPrincipal();
        Optional<Course> course = courseService.getCourseById(id);
        
        if (course.isPresent()) {
            if (course.get().getInstructor().getId().equals(user.getId()) || user.getRole().name().equals("ADMIN")) {
                courseService.deleteCourse(id);
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.forbidden().build();
            }
        }
        return ResponseEntity.notFound().build();
    }
    private Pageable toPageable(int page, int size, String sort) {
        String[] parts = sort.split(",");
        String sortBy = parts[0];
        Sort.Direction dir = (parts.length > 1 && parts[1].equalsIgnoreCase("asc")) ? Sort.Direction.ASC : Sort.Direction.DESC;
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), 100);
        return PageRequest.of(safePage, safeSize, Sort.by(dir, sortBy));
    }
}
