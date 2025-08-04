package com.careercrafter.repository;

import com.careercrafter.entity.ResumeVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for ResumeVersion entity operations
 */
@Repository
public interface ResumeVersionRepository extends JpaRepository<ResumeVersion, String> {

    /**
     * Find all versions for a resume
     */
    List<ResumeVersion> findByResumeId(String resumeId);

    /**
     * Find active versions for a resume
     */
    List<ResumeVersion> findByResumeIdAndIsActiveTrue(String resumeId);

    /**
     * Find latest version for a resume
     */
    @Query("SELECT rv FROM ResumeVersion rv WHERE rv.resumeId = :resumeId ORDER BY rv.versionNumber DESC")
    Optional<ResumeVersion> findLatestVersion(@Param("resumeId") String resumeId);

    /**
     * Find version by resume ID and version number
     */
    Optional<ResumeVersion> findByResumeIdAndVersionNumber(String resumeId, Integer versionNumber);

    /**
     * Get next version number for a resume
     */
    @Query("SELECT COALESCE(MAX(rv.versionNumber), 0) + 1 FROM ResumeVersion rv WHERE rv.resumeId = :resumeId")
    Integer getNextVersionNumber(@Param("resumeId") String resumeId);

    /**
     * Find versions by public share URL
     */
    Optional<ResumeVersion> findByPublicShareUrl(String publicShareUrl);

    /**
     * Count versions for a resume
     */
    long countByResumeId(String resumeId);
}