package com.grid.config;

import com.grid.modal.User;
import com.grid.modal.Seller;
import com.grid.repository.UserRepository;
import com.grid.repository.SellerRepository;
import jakarta.persistence.EntityManager;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
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
    private final SellerRepository sellerRepository; // <- IMPORTANT CHANGE
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

                if (email == null || roleFromToken == null) {
                    throw new RuntimeException("JWT missing email or role");
                }

                if (SecurityContextHolder.getContext().getAuthentication() == null) {

                    String cleanRole = roleFromToken.toUpperCase().replace("ROLE_", "");
                    List<SimpleGrantedAuthority> authorities =
                            List.of(new SimpleGrantedAuthority("ROLE_" + cleanRole));

                    Object principal = switch (cleanRole) {
                        case "USER", "ADMIN" -> userRepository.findByEmail(email);
                        case "SELLER" -> sellerRepository.findByEmail(email);
                        default -> throw new RuntimeException("Unknown role: " + cleanRole);
                    };

                    if (principal == null) {
                        throw new RuntimeException("No user found for email: " + email);
                    }

                    entityManager.detach(principal);

                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(principal, null, authorities);
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);

                    logger.info("JWT OK: {} → {}", email, cleanRole);
                }

            } catch (Exception e) {
                logger.warn("JWT validation failed: {}", e.getMessage());
                SecurityContextHolder.clearContext();
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Invalid JWT token");
                return;
            }
        }

        filterChain.doFilter(request, response);
    }

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();

        return path.startsWith("/auth")
                || path.startsWith("/sellers/login")
                || path.startsWith("/sellers/signup")
                || path.startsWith("/sellers/verify")
                || path.startsWith("/products")
                || path.startsWith("/payment-success")
                || path.startsWith("/home");
               // || path.matches("^/[^.]*$");
    }
}
