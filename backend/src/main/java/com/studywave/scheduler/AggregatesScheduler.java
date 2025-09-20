package com.studywave.scheduler;

import com.studywave.model.Course;
import com.studywave.repository.CourseRepository;
import com.studywave.service.ReviewService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class AggregatesScheduler {

    private static final Logger log = LoggerFactory.getLogger(AggregatesScheduler.class);

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private ReviewService reviewService;

    // Recalculate course rating aggregates every hour
    @Scheduled(cron = "0 0 * * * *")
    public void recalcCourseAggregates() {
        List<Course> courses = courseRepository.findAll();
        int updated = 0;
        for (Course c : courses) {
            try {
                reviewService.updateCourseAggregates(c);
                updated++;
            } catch (Exception ex) {
                log.warn("Failed to update aggregates for course {}: {}", c.getId(), ex.getMessage());
            }
        }
        log.info("AggregatesScheduler: updated aggregates for {} courses", updated);
    }
}
