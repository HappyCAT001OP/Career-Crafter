package com.careercrafter.service;

import com.careercrafter.dto.PDFRequest;
import com.careercrafter.dto.PDFResponse;
import com.careercrafter.entity.Resume;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.property.TextAlignment;
import com.itextpdf.layout.property.VerticalAlignment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

/**
 * PDF Service for generating professional resumes
 */
@Service
public class PDFService {

    @Autowired
    private CloudinaryService cloudinaryService;

    /**
     * Generate PDF resume and upload to Cloudinary
     */
    public PDFResponse generateAndUploadPDF(PDFRequest request) {
        try {
            // Generate PDF
            byte[] pdfBytes = generatePDF(request);

            // Upload to Cloudinary
            String cloudinaryUrl = cloudinaryService.uploadPDF(pdfBytes, request.getResumeId());

            return PDFResponse.builder()
                    .pdfUrl(cloudinaryUrl)
                    .fileName("resume_" + request.getResumeId() + ".pdf")
                    .fileSize(pdfBytes.length)
                    .generatedAt(LocalDateTime.now())
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }

    /**
     * Generate PDF resume
     */
    public byte[] generatePDF(PDFRequest request) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(baos);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        // Add header
        addHeader(document, request);

        // Add personal info
        addPersonalInfo(document, request);

        // Add summary
        addSummary(document, request);

        // Add work experience
        addWorkExperience(document, request);

        // Add education
        addEducation(document, request);

        // Add skills
        addSkills(document, request);

        document.close();
        return baos.toByteArray();
    }

    /**
     * Add header section
     */
    private void addHeader(Document document, PDFRequest request) {
        Paragraph header = new Paragraph();
        header.add(new Text(request.getPersonalInfo().getFullName())
                .setFontSize(24)
                .setBold());
        header.setTextAlignment(TextAlignment.CENTER);
        document.add(header);

        // Contact info
        Paragraph contact = new Paragraph();
        contact.add(new Text(request.getPersonalInfo().getEmail() + " | " +
                request.getPersonalInfo().getPhone() + " | " +
                request.getPersonalInfo().getLocation()));
        contact.setTextAlignment(TextAlignment.CENTER);
        document.add(contact);
    }

    /**
     * Add personal information section
     */
    private void addPersonalInfo(Document document, PDFRequest request) {
        if (request.getPersonalInfo().getSummary() != null && !request.getPersonalInfo().getSummary().isEmpty()) {
            document.add(new Paragraph("PROFESSIONAL SUMMARY")
                    .setFontSize(16)
                    .setBold()
                    .setMarginTop(20));

            document.add(new Paragraph(request.getPersonalInfo().getSummary())
                    .setMarginBottom(15));
        }
    }

    /**
     * Add work experience section
     */
    private void addWorkExperience(Document document, PDFRequest request) {
        if (request.getWorkExperience() != null && !request.getWorkExperience().isEmpty()) {
            document.add(new Paragraph("PROFESSIONAL EXPERIENCE")
                    .setFontSize(16)
                    .setBold()
                    .setMarginTop(20));

            request.getWorkExperience().forEach(exp -> {
                // Job title and company
                Paragraph jobHeader = new Paragraph();
                jobHeader.add(new Text(exp.getJobTitle()).setBold());
                jobHeader.add(new Text(" at " + exp.getCompany()).setBold());
                jobHeader.add(new Text(" | " + formatDateRange(exp.getStartMonth(), exp.getStartYear(),
                        exp.getEndMonth(), exp.getEndYear(), exp.getIsPresent())));
                document.add(jobHeader);

                // Description
                if (exp.getDescription() != null && !exp.getDescription().isEmpty()) {
                    document.add(new Paragraph(exp.getDescription()).setMarginBottom(10));
                }

                // Achievements
                if (exp.getAchievements() != null && !exp.getAchievements().isEmpty()) {
                    exp.getAchievements().forEach(achievement -> {
                        document.add(new Paragraph("• " + achievement));
                    });
                }

                document.add(new Paragraph("").setMarginBottom(10));
            });
        }
    }

    /**
     * Add education section
     */
    private void addEducation(Document document, PDFRequest request) {
        if (request.getEducation() != null && !request.getEducation().isEmpty()) {
            document.add(new Paragraph("EDUCATION")
                    .setFontSize(16)
                    .setBold()
                    .setMarginTop(20));

            request.getEducation().forEach(edu -> {
                Paragraph eduHeader = new Paragraph();
                eduHeader.add(new Text(edu.getDegree()).setBold());
                eduHeader.add(new Text(" in " + edu.getFieldOfStudy()));
                eduHeader.add(new Text(" | " + edu.getInstitution()));
                eduHeader.add(new Text(" | " + formatDateRange(edu.getStartMonth(), edu.getStartYear(),
                        edu.getEndMonth(), edu.getEndYear(), edu.getIsPresent())));
                document.add(eduHeader);

                if (edu.getGpa() != null) {
                    document.add(new Paragraph("GPA: " + edu.getGpa()));
                }

                if (edu.getAchievements() != null && !edu.getAchievements().isEmpty()) {
                    edu.getAchievements().forEach(achievement -> {
                        document.add(new Paragraph("• " + achievement));
                    });
                }

                document.add(new Paragraph("").setMarginBottom(10));
            });
        }
    }

    /**
     * Add skills section
     */
    private void addSkills(Document document, PDFRequest request) {
        if (request.getSkills() != null && !request.getSkills().isEmpty()) {
            document.add(new Paragraph("SKILLS")
                    .setFontSize(16)
                    .setBold()
                    .setMarginTop(20));

            StringBuilder skillsText = new StringBuilder();
            request.getSkills().forEach(skill -> {
                if (skillsText.length() > 0)
                    skillsText.append(", ");
                skillsText.append(skill.getName());
                if (skill.getLevel() != null && !skill.getLevel().isEmpty()) {
                    skillsText.append(" (").append(skill.getLevel()).append(")");
                }
            });

            document.add(new Paragraph(skillsText.toString()));
        }
    }

    /**
     * Format date range for display
     */
    private String formatDateRange(Integer startMonth, Integer startYear,
            Integer endMonth, Integer endYear, Boolean isPresent) {
        String startDate = formatDate(startMonth, startYear);

        if (isPresent != null && isPresent) {
            return startDate + " - Present";
        } else if (endMonth != null && endYear != null) {
            return startDate + " - " + formatDate(endMonth, endYear);
        } else {
            return startDate;
        }
    }

    /**
     * Format month/year for display
     */
    private String formatDate(Integer month, Integer year) {
        if (month == null || year == null)
            return "";

        String[] months = { "Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec" };

        if (month >= 1 && month <= 12) {
            return months[month - 1] + " " + year;
        } else {
            return year.toString();
        }
    }
}