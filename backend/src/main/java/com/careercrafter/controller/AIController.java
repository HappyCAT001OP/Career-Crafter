package com.careercrafter.controller;

import com.careercrafter.dto.AIRequest;
import com.careercrafter.dto.AIResponse;
import com.careercrafter.dto.JobMatchAnalysis;
import com.careercrafter.service.AIService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for AI-powered resume enhancement and job matching
 */
@RestController
@RequestMapping("/ai")
@CrossOrigin(origins = "*")
public class AIController {

    @Autowired
    private AIService aiService;

    /**
     * Enhance resume summary using AI
     */
    @PostMapping("/enhance-summary")
    public ResponseEntity<AIResponse> enhanceSummary(
            @AuthenticationPrincipal Object principal,
            @Valid @RequestBody AIRequest request) {

        try {
            AIResponse response = aiService.enhanceSummary(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(AIResponse.builder()
                            .error("Failed to enhance summary: " + e.getMessage())
                            .build());
        }
    }

    /**
     * Enhance work experience bullet points
     */
    @PostMapping("/enhance-work-experience")
    public ResponseEntity<AIResponse> enhanceWorkExperience(
            @AuthenticationPrincipal Object principal,
            @Valid @RequestBody AIRequest request) {

        try {
            AIResponse response = aiService.enhanceWorkExperience(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(AIResponse.builder()
                            .error("Failed to enhance work experience: " + e.getMessage())
                            .build());
        }
    }

    /**
     * Analyze job match and provide skill gap analysis
     */
    @PostMapping("/analyze-job-match")
    public ResponseEntity<JobMatchAnalysis> analyzeJobMatch(
            @AuthenticationPrincipal Object principal,
            @Valid @RequestBody AIRequest request) {

        try {
            JobMatchAnalysis analysis = aiService.analyzeJobMatch(request);
            return ResponseEntity.ok(analysis);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(JobMatchAnalysis.builder()
                            .matchScore(0)
                            .summary("Failed to analyze job match: " + e.getMessage())
                            .build());
        }
    }

    /**
     * Suggest skills based on job description
     */
    @PostMapping("/suggest-skills")
    public ResponseEntity<AIResponse> suggestSkills(
            @AuthenticationPrincipal Object principal,
            @Valid @RequestBody AIRequest request) {

        try {
            AIResponse response = aiService.suggestSkills(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(AIResponse.builder()
                            .error("Failed to suggest skills: " + e.getMessage())
                            .build());
        }
    }

    /**
     * Generate complete resume from structured data
     */
    @PostMapping("/generate-resume")
    public ResponseEntity<AIResponse> generateResume(
            @AuthenticationPrincipal Object principal,
            @Valid @RequestBody AIRequest request) {

        try {
            // This would combine multiple AI calls to generate a complete resume
            AIResponse response = aiService.enhanceSummary(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(AIResponse.builder()
                            .error("Failed to generate resume: " + e.getMessage())
                            .build());
        }
    }

    /**
     * Health check for AI service
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("AI Service is running");
    }
}