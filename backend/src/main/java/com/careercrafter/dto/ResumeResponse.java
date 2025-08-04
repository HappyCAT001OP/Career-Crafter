package com.careercrafter.dto;

import com.careercrafter.entity.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

/**
 * DTO for resume responses
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResumeResponse {

    private String id;
    private String title;
    private Boolean isActive;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    // Detailed information
    private PersonalInfo personalInfo;
    private List<WorkExperience> workExperience;
    private List<Education> education;
    private List<Skills> skills;

    // Version information
    private List<ResumeVersion> versions;
    private Integer currentVersion;
    private String pdfUrl;
    private String publicShareUrl;
}