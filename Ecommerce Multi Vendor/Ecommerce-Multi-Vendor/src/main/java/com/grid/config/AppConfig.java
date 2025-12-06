package com.grid.config;

import com.grid.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class AppConfig {

    private final UserRepository userRepository;

    public AppConfig(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JwtTokenValidator jwtTokenValidator) throws Exception {

        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers("/sellers/login", "/sellers/signup").permitAll()
                        .requestMatchers("/products/**", "/auth/**").permitAll()
                        .requestMatchers("/sellers/verify/**").permitAll()
                        .requestMatchers("/sellers/products/search").permitAll()
                        .requestMatchers("/payment-success/**").permitAll()

                        .requestMatchers("/{path:[^\\.]*}").permitAll()

                        // ============================
                        // 🔥 ADMIN PROTECTED ENDPOINTS
                        // ============================
                        .requestMatchers("/admin/**").hasRole("ADMIN")

                        // Seller protected endpoints
                        .requestMatchers("/sellers/profile").hasRole("SELLER")
                        .requestMatchers(HttpMethod.POST, "/sellers/products").hasRole("SELLER")
                        .requestMatchers(HttpMethod.PUT, "/sellers/products/**").hasRole("SELLER")
                        .requestMatchers(HttpMethod.DELETE, "/sellers/products/**").hasRole("SELLER")

                        .requestMatchers("/users/profile").authenticated()

                        // Everything else
                        .anyRequest().permitAll()
                );


        // JWT filter before Spring Security auth
        http.addFilterBefore(jwtTokenValidator, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        return request -> {
            CorsConfiguration cfg = new CorsConfiguration();
            cfg.setAllowedOrigins(Collections.singletonList("http://localhost:3000"));
            cfg.setAllowedMethods(Collections.singletonList("*"));
            cfg.setAllowedHeaders(Collections.singletonList("*"));
            cfg.setAllowCredentials(true);
            cfg.setExposedHeaders(Collections.singletonList("Authorization"));
            cfg.setMaxAge(3600L);
            return cfg;
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}