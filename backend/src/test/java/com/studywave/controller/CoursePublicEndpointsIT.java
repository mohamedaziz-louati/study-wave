package com.studywave.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("dev")
class CoursePublicEndpointsIT {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("List published courses (paged) should return 200")
    void listPublishedCoursesPaged_ok() throws Exception {
        mockMvc.perform(get("/api/courses/public/page")
                        .param("page", "0")
                        .param("size", "5")
                        .param("sort", "createdAt,desc"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").exists());
    }

    @Test
    @DisplayName("Search published courses (paged) should return 200")
    void searchCoursesPaged_ok() throws Exception {
        mockMvc.perform(get("/api/courses/public/search/page")
                        .param("keyword", "Angular")
                        .param("page", "0")
                        .param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").exists());
    }

    @Test
    @DisplayName("List category courses (paged) should return 200")
    void listCategoryCoursesPaged_ok() throws Exception {
        mockMvc.perform(get("/api/courses/public/category/Programming/page")
                        .param("page", "0")
                        .param("size", "5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").exists());
    }
}
