package com.careercrafter.service;

import com.careercrafter.dto.AIRequest;
import com.careercrafter.dto.AIResponse;
import com.careercrafter.dto.JobMatchAnalysis;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

/**
 * AI Service for Groq API integration
 * Handles resume enhancement and job matching analysis
 */
@Service
public class AIService {

    @Value("${ai.groq.api-key}")
    private String apiKey;

    @Value("${ai.groq.base-url}")
    private String baseUrl;

    @Value("${ai.groq.model}")
    private String model;

    @Value("${ai.groq.max-tokens}")
    private int maxTokens;

    @Value("${ai.groq.temperature}")
    private double temperature;

    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    public AIService() {
        this.webClient = WebClient.builder()
                .baseUrl(baseUrl)
                .defaultHeader("Authorization", "Bearer " + apiKey)
                .defaultHeader("Content-Type", "application/json")
                .build();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Enhance resume summary using AI
     */
    @Cacheable(value = "ai-summary", key = "#request.hashCode()")
    public AIResponse enhanceSummary(AIRequest request) {
        String prompt = buildSummaryPrompt(request);
        return callGroqAPI(prompt, 500);
    }

    /**
     * Enhance work experience bullet points
     */
    @Cacheable(value = "ai-bullets", key = "#request.hashCode()")
    public AIResponse enhanceWorkExperience(AIRequest request) {
        String prompt = buildWorkExperiencePrompt(request);
        return callGroqAPI(prompt, 800);
    }

    /**
     * Analyze job match and provide skill gap analysis
     */
    @Cacheable(value = "ai-job-match", key = "#request.hashCode()")
    public JobMatchAnalysis analyzeJobMatch(AIRequest request) {
        String prompt = buildJobMatchPrompt(request);
        AIResponse response = callGroqAPI(prompt, 1000);

        try {
            JsonNode jsonNode = objectMapper.readTree(response.getContent());
            return JobMatchAnalysis.builder()
                    .matchScore(jsonNode.get("matchScore").asInt())
                    .missingSkills(objectMapper.convertValue(jsonNode.get("missingSkills"), List.class))
                    .strengths(objectMapper.convertValue(jsonNode.get("strengths"), List.class))
                    .suggestions(objectMapper.convertValue(jsonNode.get("suggestions"), List.class))
                    .build();
        } catch (Exception e) {
            // Fallback response
            return JobMatchAnalysis.builder()
                    .matchScore(75)
                    .missingSkills(List.of("Communication", "Leadership"))
                    .strengths(List.of("Professional experience matches job requirements"))
                    .suggestions(List.of("Consider adding more specific technical skills"))
                    .build();
        }
    }

    /**
     * Suggest skills based on job description
     */
    @Cacheable(value = "ai-skills", key = "#request.hashCode()")
    public AIResponse suggestSkills(AIRequest request) {
        String prompt = buildSkillsPrompt(request);
        return callGroqAPI(prompt, 400);
    }

    /**
     * Call Groq API with the given prompt
     */
    private AIResponse callGroqAPI(String prompt, int maxTokens) {
        try {
            Map<String, Object> requestBody = Map.of(
                    "model", model,
                    "messages", List.of(
                            Map.of("role", "system", "content",
                                    "You are a professional resume writer and career advisor."),
                            Map.of("role", "user", "content", prompt)),
                    "max_tokens", maxTokens,
                    "temperature", temperature);

            String response = webClient.post()
                    .uri("/chat/completions")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode jsonNode = objectMapper.readTree(response);
            String content = jsonNode.get("choices").get(0).get("message").get("content").asText();

            return AIResponse.builder()
                    .content(content)
                    .model(model)
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("Failed to call Groq API", e);
        }
    }

    /**
     * Build prompt for summary enhancement
     */
    private String buildSummaryPrompt(AIRequest request) {
        return String.format(
                """
                        Based on the following information, write a professional summary (2-3 sentences) that would be perfect for a resume.
                        Focus on key achievements, skills, and career highlights. Make it engaging and professional.

                        Personal Info: %s
                        Work Experience: %s
                        Skills: %s
                        %s
                        """,
                request.getPersonalInfo(),
                request.getWorkExperience(),
                request.getSkills(),
                request.getJobDescription() != null ? "Target Job: " + request.getJobDescription() : "");
    }

    /**
     * Build prompt for work experience enhancement
     */
    private String buildWorkExperiencePrompt(AIRequest request) {
        return String.format(
                """
                        Enhance the following work experience into 3-5 powerful bullet points that demonstrate impact and achievements.
                        Use metrics where possible and start with strong action verbs. Return as JSON array only.

                        Job Title: %s
                        Company: %s
                        Current Description: %s
                        %s
                        """,
                request.getJobTitle(),
                request.getCompany(),
                request.getDescription(),
                request.getJobDescription() != null ? "Target Job Description: " + request.getJobDescription() : "");
    }

    /**
     * Build prompt for job match analysis
     */
    private String buildJobMatchPrompt(AIRequest request) {
        return String.format("""
                Analyze the following resume against the job description and provide a detailed match analysis.
                Return a JSON object with:
                - matchScore: number (0-100)
                - missingSkills: array of skills mentioned in job but missing from resume
                - strengths: array of strong matching points
                - suggestions: array of improvement suggestions

                Resume: %s

                Job Description: %s
                """,
                request.getResumeData(),
                request.getJobDescription());
    }

    /**
     * Build prompt for skills suggestion
     */
    private String buildSkillsPrompt(AIRequest request) {
        return String.format("""
                Current Skills: %s

                Job Description: %s

                Suggest 5-8 additional skills that would be valuable for this role but are not already listed.
                Return as JSON array of skill names only.
                """,
                request.getSkills(),
                request.getJobDescription());
    }
}