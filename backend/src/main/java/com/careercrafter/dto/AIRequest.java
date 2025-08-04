package com.careercrafter.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for AI service requests
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIRequest {

    private String personalInfo;
    private String workExperience;
    private String skills;
    private String jobDescription;
    private String jobTitle;
    private String company;
    private String description;
    private String resumeData;

    // For work experience enhancement
    private String experienceId;
    private String achievements;

    // For job matching
    private String targetJobTitle;
    private String targetCompany;
}