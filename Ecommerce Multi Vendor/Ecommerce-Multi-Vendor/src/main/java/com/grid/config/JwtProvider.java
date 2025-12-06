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

    // ============================
    // GENERATE JWT TOKEN
    // ============================
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
                .setExpiration(new Date(System.currentTimeMillis() + (1000L * 60 * 60 * 24))) // 24 hrs
                .signWith(key)
                .compact();
    }

    // ============================
    // EXTRACT EMAIL (SUBJECT)
    // FIXED → Handles "Bearer ", null, spaces
    // ============================
    public String getEmailFromJwtToken(String jwt) {
        if (jwt == null || jwt.isBlank()) {
            throw new RuntimeException("JWT token is missing or empty");
        }

        // Remove Bearer prefix
        if (jwt.toLowerCase().startsWith("bearer ")) {
            jwt = jwt.substring(7);
        }

        // Trim spaces
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

    // ============================
    // EXTRACT ROLE FROM JWT TOKEN
    // ============================
    public String getRoleFromToken(String jwt) {
        if (jwt == null || jwt.isBlank()) return null;

        // Remove Bearer prefix if present
        if (jwt.toLowerCase().startsWith("bearer ")) {
            jwt = jwt.substring(7).trim();
        }

        try {
            Claims claims = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(jwt)
                    .getBody();

            return claims.get("role", String.class);

        } catch (Exception e) {
            return null;
        }
    }
}
