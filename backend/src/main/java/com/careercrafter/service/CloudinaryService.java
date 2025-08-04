package com.careercrafter.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Map;

/**
 * Cloudinary Service for file uploads and PDF storage
 */
@Service
public class CloudinaryService {

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    @Value("${cloudinary.secure}")
    private boolean secure;

    private Cloudinary cloudinary;

    public CloudinaryService() {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret,
                "secure", secure));
    }

    /**
     * Upload PDF file to Cloudinary
     */
    public String uploadPDF(byte[] pdfBytes, String resumeId) throws IOException {
        try {
            Map<String, Object> uploadResult = cloudinary.uploader().upload(
                    new ByteArrayInputStream(pdfBytes),
                    ObjectUtils.asMap(
                            "public_id", "resumes/" + resumeId,
                            "resource_type", "raw",
                            "format", "pdf",
                            "overwrite", true));

            return (String) uploadResult.get("secure_url");
        } catch (Exception e) {
            throw new IOException("Failed to upload PDF to Cloudinary", e);
        }
    }

    /**
     * Upload image file to Cloudinary
     */
    public String uploadImage(byte[] imageBytes, String fileName) throws IOException {
        try {
            Map<String, Object> uploadResult = cloudinary.uploader().upload(
                    new ByteArrayInputStream(imageBytes),
                    ObjectUtils.asMap(
                            "public_id", "images/" + fileName,
                            "overwrite", true));

            return (String) uploadResult.get("secure_url");
        } catch (Exception e) {
            throw new IOException("Failed to upload image to Cloudinary", e);
        }
    }

    /**
     * Generate public sharing URL for PDF
     */
    public String generatePublicUrl(String resumeId) {
        return cloudinary.url()
                .resourceType("raw")
                .format("pdf")
                .publicId("resumes/" + resumeId)
                .generate();
    }

    /**
     * Delete file from Cloudinary
     */
    public boolean deleteFile(String publicId, String resourceType) {
        try {
            Map<String, Object> result = cloudinary.uploader().destroy(
                    publicId,
                    ObjectUtils.asMap("resource_type", resourceType));
            return "ok".equals(result.get("result"));
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Get file information from Cloudinary
     */
    public Map<String, Object> getFileInfo(String publicId) {
        try {
            return cloudinary.api().resource(
                    publicId,
                    ObjectUtils.asMap("resource_type", "raw"));
        } catch (Exception e) {
            return null;
        }
    }
}