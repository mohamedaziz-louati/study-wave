package com.studywave.service;

import com.studywave.model.Lesson;
import com.studywave.repository.LessonRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class LessonService {

    @Autowired
    private LessonRepository lessonRepository;

    public List<Lesson> getLessonsByCourse(Long courseId) {
        return lessonRepository.findByCourseIdOrderByOrderAsc(courseId);
    }

    public Lesson createLesson(Lesson lesson) {
        return lessonRepository.save(lesson);
    }

    public Lesson updateLesson(Long id, Lesson lesson) {
        Optional<Lesson> existingLesson = lessonRepository.findById(id);
        if (existingLesson.isPresent()) {
            Lesson lessonToUpdate = existingLesson.get();
            lessonToUpdate.setTitle(lesson.getTitle());
            lessonToUpdate.setDescription(lesson.getDescription());
            lessonToUpdate.setContent(lesson.getContent());
            lessonToUpdate.setType(lesson.getType());
            lessonToUpdate.setOrder(lesson.getOrder());
            lessonToUpdate.setDuration(lesson.getDuration());
            return lessonRepository.save(lessonToUpdate);
        }
        throw new RuntimeException("Lesson not found with id: " + id);
    }

    public void deleteLesson(Long id) {
        lessonRepository.deleteById(id);
    }

    public Optional<Lesson> getLessonById(Long id) {
        return lessonRepository.findById(id);
    }
}
