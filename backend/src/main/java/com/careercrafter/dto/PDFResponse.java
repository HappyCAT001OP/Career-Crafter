package com.careercrafter.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PDFResponse {
    private String pdfUrl;
    private String fileName;
    private Integer fileSize;
    private LocalDateTime generatedAt;
    private String error; // for error messages
}