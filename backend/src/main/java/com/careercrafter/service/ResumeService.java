package com.careercrafter.service;

import com.careercrafter.entity.*;
import com.careercrafter.repository.ResumeRepository;
import com.careercrafter.repository.ResumeVersionRepository;
import com.careercrafter.repository.UserRepository;
import com.careercrafter.dto.ResumeRequest;
import com.careercrafter.dto.ResumeResponse;
import com.careercrafter.exception.ResourceNotFoundException;
import com.careercrafter.exception.UnauthorizedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Service for resume business logic
 */
@Service
@Transactional
public class ResumeService {

    @Autowired
    private ResumeRepository resumeRepository;

    @Autowired
    private ResumeVersionRepository resumeVersionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PDFService pdfService;

    @Autowired
    private CloudinaryService cloudinaryService;

    /**
     * Create a new resume
     */
    public ResumeResponse createResume(String userId, ResumeRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Resume resume = new Resume();
        resume.setId(UUID.randomUUID().toString());
        resume.setUser(user);
        resume.setTitle(request.getTitle());
        resume.setIsActive(true);

        Resume savedResume = resumeRepository.save(resume);

        // Create initial version
        ResumeVersion version = new ResumeVersion();
        version.setId(UUID.randomUUID().toString());
        version.setResume(savedResume);
        version.setVersionNumber(1);
        version.setTitle("Initial Version");
        version.setIsActive(true);
        resumeVersionRepository.save(version);

        return mapToResponse(savedResume);
    }

    /**
     * Get all resumes for a user
     */
    public List<ResumeResponse> getUserResumes(String userId) {
        List<Resume> resumes = resumeRepository.findByUserId(userId);
        return resumes.stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Get resumes with pagination
     */
    public Page<ResumeResponse> getUserResumes(String userId, Pageable pageable) {
        Page<Resume> resumes = resumeRepository.findByUserId(userId, pageable);
        return resumes.map(this::mapToResponse);
    }

    /**
     * Get resume by ID with all details
     */
    public ResumeResponse getResumeWithDetails(String resumeId, String userId) {
        Resume resume = resumeRepository.findByIdWithDetails(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));

        if (!resume.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Access denied");
        }

        return mapToDetailedResponse(resume);
    }

    /**
     * Update resume
     */
    public ResumeResponse updateResume(String resumeId, String userId, ResumeRequest request) {
        Resume resume = resumeRepository.findByIdAndUserId(resumeId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));

        resume.setTitle(request.getTitle());
        resume.setIsActive(request.getIsActive());

        Resume updatedResume = resumeRepository.save(resume);
        return mapToResponse(updatedResume);
    }

    /**
     * Delete resume
     */
    public void deleteResume(String resumeId, String userId) {
        Resume resume = resumeRepository.findByIdAndUserId(resumeId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));

        // Delete all versions first
        List<ResumeVersion> versions = resumeVersionRepository.findByResumeId(resumeId);
        for (ResumeVersion version : versions) {
            if (version.getPdfUrl() != null) {
                cloudinaryService.deleteFile("resumes/" + version.getId(), "raw");
            }
            resumeVersionRepository.delete(version);
        }

        resumeRepository.delete(resume);
    }

    /**
     * Generate PDF for resume
     */
    public String generateResumePDF(String resumeId, String userId) {
        Resume resume = resumeRepository.findByIdWithDetails(resumeId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));

        if (!resume.getUser().getId().equals(userId)) {
            throw new UnauthorizedException("Access denied");
        }

        // Create new version
        Integer nextVersion = resumeVersionRepository.getNextVersionNumber(resumeId);
        ResumeVersion version = new ResumeVersion();
        version.setId(UUID.randomUUID().toString());
        version.setResume(resume);
        version.setVersionNumber(nextVersion);
        version.setTitle("Version " + nextVersion);
        version.setIsActive(true);

        // Generate PDF and upload to Cloudinary
        try {
            String pdfUrl = pdfService.generateAndUploadPDF(createPDFRequest(resume)).getPdfUrl();
            version.setPdfUrl(pdfUrl);
            version.setPublicShareUrl(cloudinaryService.generatePublicUrl(version.getId()));
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }

        resumeVersionRepository.save(version);
        return version.getPdfUrl();
    }

    /**
     * Get resume versions
     */
    public List<ResumeVersion> getResumeVersions(String resumeId, String userId) {
        Resume resume = resumeRepository.findByIdAndUserId(resumeId, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));

        return resumeVersionRepository.findByResumeId(resumeId);
    }

    /**
     * Get public resume by share URL
     */
    public ResumeResponse getPublicResume(String publicShareUrl) {
        ResumeVersion version = resumeVersionRepository.findByPublicShareUrl(publicShareUrl)
                .orElseThrow(() -> new ResourceNotFoundException("Resume not found"));

        if (!version.getIsActive()) {
            throw new ResourceNotFoundException("Resume not available");
        }

        return mapToResponse(version.getResume());
    }

    /**
     * Search resumes by title
     */
    public List<ResumeResponse> searchResumes(String userId, String title) {
        List<Resume> resumes = resumeRepository.findByUserIdAndTitleContainingIgnoreCase(userId, title);
        return resumes.stream()
                .map(this::mapToResponse)
                .toList();
    }

    /**
     * Get resume statistics
     */
    public ResumeStatistics getResumeStatistics(String userId) {
        long totalResumes = resumeRepository.countByUserId(userId);
        List<Resume> recentResumes = resumeRepository.findRecentResumes(userId);

        return ResumeStatistics.builder()
                .totalResumes(totalResumes)
                .recentResumes(recentResumes.size())
                .build();
    }

    /**
     * Map Resume to ResumeResponse
     */
    private ResumeResponse mapToResponse(Resume resume) {
        return ResumeResponse.builder()
                .id(resume.getId())
                .title(resume.getTitle())
                .isActive(resume.getIsActive())
                .createdAt(resume.getCreatedAt())
                .updatedAt(resume.getUpdatedAt())
                .build();
    }

    /**
     * Map Resume to detailed ResumeResponse
     */
    private ResumeResponse mapToDetailedResponse(Resume resume) {
        ResumeResponse response = mapToResponse(resume);
        response.setPersonalInfo(resume.getPersonalInfo());
        response.setWorkExperience(resume.getWorkExperience());
        response.setEducation(resume.getEducation());
        response.setSkills(resume.getSkills());
        return response;
    }

    /**
     * Create PDF request from resume
     */
    private com.careercrafter.dto.PDFRequest createPDFRequest(Resume resume) {
        return com.careercrafter.dto.PDFRequest.builder()
                .resumeId(resume.getId())
                .personalInfo(mapPersonalInfo(resume.getPersonalInfo()))
                .workExperience(mapWorkExperience(resume.getWorkExperience()))
                .education(mapEducation(resume.getEducation()))
                .skills(mapSkills(resume.getSkills()))
                .build();
    }

    // Mapping methods for PDF request
    private com.careercrafter.dto.PDFRequest.PersonalInfoDTO mapPersonalInfo(PersonalInfo personalInfo) {
        if (personalInfo == null)
            return null;

        return com.careercrafter.dto.PDFRequest.PersonalInfoDTO.builder()
                .fullName(personalInfo.getFullName())
                .email(personalInfo.getEmail())
                .phone(personalInfo.getPhone())
                .location(personalInfo.getLocation())
                .website(personalInfo.getWebsite())
                .linkedin(personalInfo.getLinkedin())
                .github(personalInfo.getGithub())
                .summary(personalInfo.getSummary())
                .build();
    }

    private List<com.careercrafter.dto.PDFRequest.WorkExperienceDTO> mapWorkExperience(
            List<WorkExperience> workExperience) {
        if (workExperience == null)
            return null;

        return workExperience.stream()
                .map(exp -> com.careercrafter.dto.PDFRequest.WorkExperienceDTO.builder()
                        .jobTitle(exp.getJobTitle())
                        .company(exp.getCompany())
                        .location(exp.getLocation())
                        .startMonth(exp.getStartMonth())
                        .startYear(exp.getStartYear())
                        .endMonth(exp.getEndMonth())
                        .endYear(exp.getEndYear())
                        .isPresent(exp.getIsPresent())
                        .description(exp.getDescription())
                        .achievements(exp.getAchievements())
                        .order(exp.getOrder())
                        .build())
                .toList();
    }

    private List<com.careercrafter.dto.PDFRequest.EducationDTO> mapEducation(List<Education> education) {
        if (education == null)
            return null;

        return education.stream()
                .map(edu -> com.careercrafter.dto.PDFRequest.EducationDTO.builder()
                        .institution(edu.getInstitution())
                        .degree(edu.getDegree())
                        .fieldOfStudy(edu.getFieldOfStudy())
                        .startMonth(edu.getStartMonth())
                        .startYear(edu.getStartYear())
                        .endMonth(edu.getEndMonth())
                        .endYear(edu.getEndYear())
                        .isPresent(edu.getIsPresent())
                        .gpa(edu.getGpa() != null ? edu.getGpa().toString() : null)
                        .achievements(edu.getAchievements())
                        .order(edu.getOrder())
                        .build())
                .toList();
    }

    private List<com.careercrafter.dto.PDFRequest.SkillsDTO> mapSkills(List<Skills> skills) {
        if (skills == null)
            return null;

        return skills.stream()
                .map(skill -> com.careercrafter.dto.PDFRequest.SkillsDTO.builder()
                        .name(skill.getName())
                        .level(skill.getLevel())
                        .category(skill.getCategory())
                        .build())
                .toList();
    }

    /**
     * Resume statistics DTO
     */
    public static class ResumeStatistics {
        private long totalResumes;
        private int recentResumes;

        public ResumeStatistics() {
        }

        public ResumeStatistics(long totalResumes, int recentResumes) {
            this.totalResumes = totalResumes;
            this.recentResumes = recentResumes;
        }

        public long getTotalResumes() {
            return totalResumes;
        }

        public void setTotalResumes(long totalResumes) {
            this.totalResumes = totalResumes;
        }

        public int getRecentResumes() {
            return recentResumes;
        }

        public void setRecentResumes(int recentResumes) {
            this.recentResumes = recentResumes;
        }

        public static Builder builder() {
            return new Builder();
        }

        public static class Builder {
            private long totalResumes;
            private int recentResumes;

            public Builder totalResumes(long totalResumes) {
                this.totalResumes = totalResumes;
                return this;
            }

            public Builder recentResumes(int recentResumes) {
                this.recentResumes = recentResumes;
                return this;
            }

            public ResumeStatistics build() {
                return new ResumeStatistics(totalResumes, recentResumes);
            }
        }
    }
}