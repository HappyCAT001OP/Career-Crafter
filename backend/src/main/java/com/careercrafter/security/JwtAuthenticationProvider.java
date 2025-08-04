package com.careercrafter.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Collections;
import java.util.Date;

/**
 * JWT Authentication Provider for Clerk JWT token validation
 */
@Component
public class JwtAuthenticationProvider implements AuthenticationProvider {

    @Value("${clerk.secret-key}")
    private String clerkSecretKey;

    @Value("${clerk.issuer-url}")
    private String issuerUrl;

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        if (authentication.getCredentials() instanceof String) {
            String token = (String) authentication.getCredentials();
            return validateToken(token);
        }
        return null;
    }

    public Authentication authenticate(String token) {
        return validateToken(token);
    }

    private Authentication validateToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(clerkSecretKey.getBytes(StandardCharsets.UTF_8));

            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .requireIssuer(issuerUrl)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

            // Check if token is expired
            if (claims.getExpiration() != null && claims.getExpiration().before(new Date())) {
                return null;
            }

            String userId = claims.getSubject();
            String email = claims.get("email", String.class);
            String firstName = claims.get("first_name", String.class);
            String lastName = claims.get("last_name", String.class);

            UserPrincipal userPrincipal = new UserPrincipal(userId, email, firstName, lastName);

            return new UsernamePasswordAuthenticationToken(
                    userPrincipal,
                    token,
                    Collections.singletonList(new SimpleGrantedAuthority("USER")));

        } catch (Exception e) {
            return null;
        }
    }

    @Override
    public boolean supports(Class<?> authentication) {
        return UsernamePasswordAuthenticationToken.class.isAssignableFrom(authentication);
    }

    /**
     * User Principal class to hold authenticated user information
     */
    public static class UserPrincipal {
        private final String id;
        private final String email;
        private final String firstName;
        private final String lastName;

        public UserPrincipal(String id, String email, String firstName, String lastName) {
            this.id = id;
            this.email = email;
            this.firstName = firstName;
            this.lastName = lastName;
        }

        public String getId() {
            return id;
        }

        public String getEmail() {
            return email;
        }

        public String getFirstName() {
            return firstName;
        }

        public String getLastName() {
            return lastName;
        }
    }
}