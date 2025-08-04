package com.careercrafter.controller;

import com.careercrafter.dto.PDFRequest;
import com.careercrafter.dto.PDFResponse;
import com.careercrafter.service.PDFService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Controller for PDF generation and file uploads
 */
@RestController
@RequestMapping("/pdf")
@CrossOrigin(origins = "*")
public class PDFController {

    @Autowired
    private PDFService pdfService;

    /**
     * Generate PDF resume and upload to Cloudinary
     */
    @PostMapping("/generate")
    public ResponseEntity<PDFResponse> generatePDF(
            @AuthenticationPrincipal Object principal,
            @Valid @RequestBody PDFRequest request) {

        try {
            PDFResponse response = pdfService.generateAndUploadPDF(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(PDFResponse.builder()
                            .error("Failed to generate PDF: " + e.getMessage())
                            .build());
        }
    }

    /**
     * Generate PDF resume and return as byte array for download
     */
    @PostMapping("/download")
    public ResponseEntity<byte[]> downloadPDF(
            @AuthenticationPrincipal Object principal,
            @Valid @RequestBody PDFRequest request) {

        try {
            byte[] pdfBytes = pdfService.generatePDF(request);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "resume.pdf");
            headers.setContentLength(pdfBytes.length);

            return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * Generate PDF resume and return as base64 string
     */
    @PostMapping("/base64")
    public ResponseEntity<String> generatePDFBase64(
            @AuthenticationPrincipal Object principal,
            @Valid @RequestBody PDFRequest request) {

        try {
            byte[] pdfBytes = pdfService.generatePDF(request);
            String base64 = java.util.Base64.getEncoder().encodeToString(pdfBytes);

            return ResponseEntity.ok(base64);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body("Failed to generate PDF: " + e.getMessage());
        }
    }

    /**
     * Health check for PDF service
     */
    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("PDF Service is running");
    }
}