package com.grid.config;

import com.grid.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.client.RestTemplate;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class AppConfig {

    private final UserRepository userRepository;
    private final JwtTokenValidator jwtTokenValidator;

    public AppConfig(UserRepository userRepository, JwtTokenValidator jwtTokenValidator) {
        this.userRepository = userRepository;
        this.jwtTokenValidator = jwtTokenValidator;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())  // Disable first
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(ex -> ex.authenticationEntryPoint(new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
                .addFilterBefore(jwtTokenValidator, UsernamePasswordAuthenticationFilter.class)  // Add filter early
                .authorizeHttpRequests(auth -> auth
                        // Public
                        .requestMatchers("/auth/**", "/sellers/login", "/sellers/signup", "/sellers/verify/**", "/products/**", "/home/**", "/payment-success/**", "/{path:[^\\.]*}").permitAll()
                        // Protected
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .requestMatchers("/sellers/profile").hasRole("SELLER")
                        .requestMatchers(HttpMethod.POST, "/sellers/products").hasRole("SELLER")
                        .requestMatchers(HttpMethod.PUT, "/sellers/products/**").hasRole("SELLER")
                        .requestMatchers(HttpMethod.DELETE, "/sellers/products/**").hasRole("SELLER")
                        .requestMatchers("/users/profile").authenticated()
                        .requestMatchers("/orders/user").authenticated()
                        .anyRequest().authenticated()
                );

        return http.build();
    }

    // CORS (your version is perfect)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        cfg.setAllowedOriginPatterns(Arrays.asList("*"));  // Good for dev
        cfg.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        cfg.setAllowedHeaders(Arrays.asList("*"));
        cfg.setAllowCredentials(true);
        cfg.setExposedHeaders(Arrays.asList("Authorization"));
        cfg.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", cfg);
        return source;
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
