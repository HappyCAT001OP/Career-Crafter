package com.careercrafter.repository;

import com.careercrafter.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repository for User entity operations
 */
@Repository
public interface UserRepository extends JpaRepository<User, String> {

    /**
     * Find user by email
     */
    Optional<User> findByEmail(String email);

    /**
     * Find all users with their resumes
     */
    @Query("SELECT u FROM User u LEFT JOIN FETCH u.resumes WHERE u.id = :userId")
    Optional<User> findByIdWithResumes(@Param("userId") String userId);

    /**
     * Check if email exists
     */
    boolean existsByEmail(String email);

    /**
     * Find users by first name or last name
     */
    @Query("SELECT u FROM User u WHERE u.firstName LIKE %:name% OR u.lastName LIKE %:name%")
    List<User> findByNameContaining(@Param("name") String name);
}