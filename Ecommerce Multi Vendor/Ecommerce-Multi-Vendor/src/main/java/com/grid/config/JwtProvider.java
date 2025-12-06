package com.grid.config;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;

@Service
public class JwtProvider {

    @Value("${jwt.secret}")
    private String secret;

    private SecretKey key;

    @PostConstruct
    public void init() {
        key = Keys.hmacShaKeyFor(secret.getBytes());
    }

    public String generateToken(Authentication auth) {
        String email = auth.getName();
        String role = auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_USER");

        return Jwts.builder()
                .setSubject(email)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 1000L * 60 * 60 * 24)) // 24 hours
                .signWith(key)
                .compact();
    }

    // FIXED METHOD — HANDLES "Bearer " AND SPACES
    public String getEmailFromJwtToken(String jwt) {
        if (jwt == null || jwt.isBlank()) {
            throw new RuntimeException("JWT token is missing or empty");
        }

        // Remove "Bearer " prefix if present
        if (jwt.toLowerCase().startsWith("bearer ")) {
            jwt = jwt.substring(7);
        }

        // TRIM ANY WHITESPACE (THIS FIXES YOUR ERROR)
        jwt = jwt.trim();

        if (jwt.isEmpty()) {
            throw new RuntimeException("JWT token is empty after trimming");
        }

        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(jwt)
                    .getBody();
            return claims.getSubject();
        } catch (Exception e) {
            throw new RuntimeException("Invalid JWT token: " + e.getMessage(), e);
        }
    }

    // Optional: Keep if used elsewhere
    public String getRoleFromToken(String jwt) {
        try {
            String cleanJwt = jwt;
            if (jwt != null && jwt.toLowerCase().startsWith("bearer ")) {
                cleanJwt = jwt.substring(7).trim();
            }
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(cleanJwt)
                    .getBody();
            return claims.get("role", String.class);
        } catch (Exception e) {
            return null;
        }
    }
}