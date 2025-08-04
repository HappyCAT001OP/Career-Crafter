package com.careercrafter;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

/**
 * Main Spring Boot application class for Career Crafter
 * AI-Powered Resume Builder Backend
 */
@SpringBootApplication
@EnableJpaAuditing
@EnableCaching
public class CareerCrafterApplication {

    public static void main(String[] args) {
        SpringApplication.run(CareerCrafterApplication.class, args);
    }
} 