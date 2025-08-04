package com.careercrafter.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for PDF generation requests
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PDFRequest {

    private String resumeId;
    private String template;
    private PersonalInfoDTO personalInfo;
    private List<WorkExperienceDTO> workExperience;
    private List<EducationDTO> education;
    private List<SkillsDTO> skills;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class PersonalInfoDTO {
        private String fullName;
        private String email;
        private String phone;
        private String location;
        private String website;
        private String linkedin;
        private String github;
        private String summary;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class WorkExperienceDTO {
        private String jobTitle;
        private String company;
        private String location;
        private Integer startMonth;
        private Integer startYear;
        private Integer endMonth;
        private Integer endYear;
        private Boolean isPresent;
        private String description;
        private List<String> achievements;
        private Integer order;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EducationDTO {
        private String institution;
        private String degree;
        private String fieldOfStudy;
        private Integer startMonth;
        private Integer startYear;
        private Integer endMonth;
        private Integer endYear;
        private Boolean isPresent;
        private String gpa;
        private List<String> achievements;
        private Integer order;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SkillsDTO {
        private String name;
        private String level;
        private String category;
    }
}