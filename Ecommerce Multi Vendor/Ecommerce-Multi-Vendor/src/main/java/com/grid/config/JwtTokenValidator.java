package com.grid.config;

import com.grid.modal.User;
import com.grid.modal.Seller;
import com.grid.repository.UserRepository;
import com.grid.service.SellerService;
import jakarta.persistence.EntityManager;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Component
@RequiredArgsConstructor
public class JwtTokenValidator extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtTokenValidator.class);

    private final JwtProvider jwtProvider;
    private final UserRepository userRepository;
    private final SellerService sellerService;
    private final EntityManager entityManager;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7).trim();

            try {
                String email = jwtProvider.getEmailFromJwtToken(jwt);
                String roleFromToken = jwtProvider.getRoleFromToken(jwt);

                if (email != null && roleFromToken != null &&
                        SecurityContextHolder.getContext().getAuthentication() == null) {

                    // Normalize role -> ADMIN, SELLER, USER
                    String cleanRole = roleFromToken.toUpperCase().replace("ROLE_", "");

                    List<GrantedAuthority> authorities =
                            List.of(new SimpleGrantedAuthority("ROLE_" + cleanRole));

                    Object principal = null;

                    switch (cleanRole) {

                        case "USER":
                            principal = userRepository.findByEmail(email);
                            if (principal != null) entityManager.detach(principal);
                            break;

                        case "SELLER":
                            principal = sellerService.getSellerByEmail(email);
                            if (principal != null) entityManager.detach(principal);
                            break;

                        case "ADMIN":
                            // Admin likely stored in User table
                            principal = userRepository.findByEmail(email);
                            if (principal != null) entityManager.detach(principal);
                            break;

                        default:
                            logger.warn("Unknown role in JWT: {}", cleanRole);
                    }

                    if (principal != null) {
                        UsernamePasswordAuthenticationToken auth =
                                new UsernamePasswordAuthenticationToken(
                                        principal,
                                        null,
                                        authorities
                                );

                        auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(auth);

                        logger.info("JWT authentication successful: {} with role {}", email, cleanRole);
                    } else {
                        logger.warn("No principal found for email: {}", email);
                    }
                }

            } catch (Exception e) {
                logger.warn("Invalid JWT token: {}", e.getMessage());
                SecurityContextHolder.clearContext();
            }
        }

        filterChain.doFilter(request, response);
    }
}
