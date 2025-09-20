package com.studywave.controller;

import com.studywave.model.Course;
import com.studywave.model.Review;
import com.studywave.model.User;
import com.studywave.model.dto.ReviewRequest;
import com.studywave.service.CourseService;
import com.studywave.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/courses/{courseId}/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @Autowired
    private CourseService courseService;

    @GetMapping
    public ResponseEntity<Page<Review>> listReviews(@PathVariable Long courseId,
                                                    @RequestParam(defaultValue = "0") int page,
                                                    @RequestParam(defaultValue = "10") int size,
                                                    @RequestParam(defaultValue = "createdAt,desc") String sort) {
        Optional<Course> courseOpt = courseService.getCourseById(courseId);
        if (courseOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        Pageable pageable = toPageable(page, size, sort);
        Page<Review> reviews = reviewService.getCourseReviews(courseOpt.get(), pageable);
        return ResponseEntity.ok(reviews);
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<Review> addOrUpdateReview(@PathVariable Long courseId,
                                                    @Valid @RequestBody ReviewRequest req,
                                                    Authentication authentication) {
        Optional<Course> courseOpt = courseService.getCourseById(courseId);
        if (courseOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        User user = (User) authentication.getPrincipal();
        Review saved = reviewService.addOrUpdateReview(courseOpt.get(), user, req.getRating(), req.getComment());
        return ResponseEntity.ok(saved);
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
