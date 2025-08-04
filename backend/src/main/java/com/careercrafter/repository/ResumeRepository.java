package com.careercrafter.repository;

import com.careercrafter.entity.Resume;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for Resume entity operations
 */
@Repository
public interface ResumeRepository extends JpaRepository<Resume, String> {

    /**
     * Find all resumes for a user
     */
    List<Resume> findByUserId(String userId);

    /**
     * Find all resumes for a user with pagination
     */
    Page<Resume> findByUserId(String userId, Pageable pageable);

    /**
     * Find active resumes for a user
     */
    List<Resume> findByUserIdAndIsActiveTrue(String userId);

    /**
     * Find resume with all details (personal info, work experience, education,
     * skills)
     */
    @Query("SELECT r FROM Resume r " +
            "LEFT JOIN FETCH r.personalInfo " +
            "LEFT JOIN FETCH r.workExperience " +
            "LEFT JOIN FETCH r.education " +
            "LEFT JOIN FETCH r.skills " +
            "WHERE r.id = :resumeId")
    Optional<Resume> findByIdWithDetails(@Param("resumeId") String resumeId);

    /**
     * Find resume by user ID and resume ID
     */
    Optional<Resume> findByIdAndUserId(String resumeId, String userId);

    /**
     * Find resumes by title containing
     */
    List<Resume> findByUserIdAndTitleContainingIgnoreCase(String userId, String title);

    /**
     * Count resumes for a user
     */
    long countByUserId(String userId);

    /**
     * Find resumes created in the last 30 days
     */
    @Query("SELECT r FROM Resume r WHERE r.userId = :userId AND r.createdAt >= CURRENT_DATE - 30")
    List<Resume> findRecentResumes(@Param("userId") String userId);
}