package com.careercrafter.controller;

import com.careercrafter.dto.ResumeRequest;
import com.careercrafter.dto.ResumeResponse;
import com.careercrafter.entity.ResumeVersion;
import com.careercrafter.security.JwtAuthenticationProvider;
import com.careercrafter.service.ResumeService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller for resume operations
 */
@RestController
@RequestMapping("/resumes")
@CrossOrigin(origins = "*")
public class ResumeController {

    @Autowired
    private ResumeService resumeService;

    @Autowired
    private JwtAuthenticationProvider jwtAuthenticationProvider;

    /**
     * Create a new resume
     */
    @PostMapping
    public ResponseEntity<ResumeResponse> createResume(
            @AuthenticationPrincipal JwtAuthenticationProvider.UserPrincipal principal,
            @Valid @RequestBody ResumeRequest request) {

        String userId = principal.getId();
        ResumeResponse response = resumeService.createResume(userId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Get all resumes for the authenticated user
     */
    @GetMapping
    public ResponseEntity<List<ResumeResponse>> getUserResumes(
            @AuthenticationPrincipal JwtAuthenticationProvider.UserPrincipal principal) {

        String userId = principal.getId();
        List<ResumeResponse> resumes = resumeService.getUserResumes(userId);
        return ResponseEntity.ok(resumes);
    }

    /**
     * Get resumes with pagination
     */
    @GetMapping("/paginated")
    public ResponseEntity<Page<ResumeResponse>> getUserResumesPaginated(
            @AuthenticationPrincipal JwtAuthenticationProvider.UserPrincipal principal,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        String userId = principal.getId();
        Pageable pageable = PageRequest.of(page, size);
        Page<ResumeResponse> resumes = resumeService.getUserResumes(userId, pageable);
        return ResponseEntity.ok(resumes);
    }

    /**
     * Get resume by ID with all details
     */
    @GetMapping("/{resumeId}")
    public ResponseEntity<ResumeResponse> getResume(
            @AuthenticationPrincipal JwtAuthenticationProvider.UserPrincipal principal,
            @PathVariable String resumeId) {

        String userId = principal.getId();
        ResumeResponse response = resumeService.getResumeWithDetails(resumeId, userId);
        return ResponseEntity.ok(response);
    }

    /**
     * Update resume
     */
    @PutMapping("/{resumeId}")
    public ResponseEntity<ResumeResponse> updateResume(
            @AuthenticationPrincipal JwtAuthenticationProvider.UserPrincipal principal,
            @PathVariable String resumeId,
            @Valid @RequestBody ResumeRequest request) {

        String userId = principal.getId();
        ResumeResponse response = resumeService.updateResume(resumeId, userId, request);
        return ResponseEntity.ok(response);
    }

    /**
     * Delete resume
     */
    @DeleteMapping("/{resumeId}")
    public ResponseEntity<Void> deleteResume(
            @AuthenticationPrincipal JwtAuthenticationProvider.UserPrincipal principal,
            @PathVariable String resumeId) {

        String userId = principal.getId();
        resumeService.deleteResume(resumeId, userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Generate PDF for resume
     */
    @PostMapping("/{resumeId}/generate-pdf")
    public ResponseEntity<String> generatePDF(
            @AuthenticationPrincipal JwtAuthenticationProvider.UserPrincipal principal,
            @PathVariable String resumeId) {

        String userId = principal.getId();
        String pdfUrl = resumeService.generateResumePDF(resumeId, userId);
        return ResponseEntity.ok(pdfUrl);
    }

    /**
     * Get resume versions
     */
    @GetMapping("/{resumeId}/versions")
    public ResponseEntity<List<ResumeVersion>> getResumeVersions(
            @AuthenticationPrincipal JwtAuthenticationProvider.UserPrincipal principal,
            @PathVariable String resumeId) {

        String userId = principal.getId();
        List<ResumeVersion> versions = resumeService.getResumeVersions(resumeId, userId);
        return ResponseEntity.ok(versions);
    }

    /**
     * Get public resume by share URL
     */
    @GetMapping("/public/{shareUrl}")
    public ResponseEntity<ResumeResponse> getPublicResume(@PathVariable String shareUrl) {
        ResumeResponse response = resumeService.getPublicResume(shareUrl);
        return ResponseEntity.ok(response);
    }

    /**
     * Search resumes by title
     */
    @GetMapping("/search")
    public ResponseEntity<List<ResumeResponse>> searchResumes(
            @AuthenticationPrincipal JwtAuthenticationProvider.UserPrincipal principal,
            @RequestParam String title) {

        String userId = principal.getId();
        List<ResumeResponse> resumes = resumeService.searchResumes(userId, title);
        return ResponseEntity.ok(resumes);
    }

    /**
     * Get resume statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<ResumeService.ResumeStatistics> getResumeStatistics(
            @AuthenticationPrincipal JwtAuthenticationProvider.UserPrincipal principal) {

        String userId = principal.getId();
        ResumeService.ResumeStatistics statistics = resumeService.getResumeStatistics(userId);
        return ResponseEntity.ok(statistics);
    }

    /**
     * Health check for resume service
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Resume Service is running");
    }
}