package com.careercrafter.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for AI service responses
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIResponse {

    private String content;
    private String model;
    private String error;
    private long tokensUsed;
    private long responseTime;
}