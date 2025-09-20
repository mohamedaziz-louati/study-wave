package com.studywave.controller;

import com.studywave.service.AnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private AnalyticsService analyticsService;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> summary() {
        return ResponseEntity.ok(analyticsService.getSummary());
    }

    @GetMapping("/enrollments")
    public ResponseEntity<Map<LocalDate, Long>> enrollmentsByDay(@RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(analyticsService.enrollmentsByDay(days));
    }

    @GetMapping("/reviews")
    public ResponseEntity<Map<LocalDate, Long>> reviewsByDay(@RequestParam(defaultValue = "30") int days) {
        return ResponseEntity.ok(analyticsService.reviewsByDay(days));
    }
}
