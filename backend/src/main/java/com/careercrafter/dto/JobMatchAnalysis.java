package com.careercrafter.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO for job matching analysis results
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobMatchAnalysis {

    private int matchScore;
    private List<String> missingSkills;
    private List<String> strengths;
    private List<String> suggestions;
    private String summary;
}