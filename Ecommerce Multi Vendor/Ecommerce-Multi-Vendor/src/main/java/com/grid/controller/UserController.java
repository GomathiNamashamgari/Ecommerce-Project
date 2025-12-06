package com.grid.controller;

import com.grid.modal.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;  // Add this import
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {

    private static final Logger log = LoggerFactory.getLogger(UserController.class);

    @GetMapping("/profile")
    @PreAuthorize("isAuthenticated()")
    @Transactional(readOnly = true)  // Keeps session open for the request; remove if @JsonIgnore suffices
    public ResponseEntity<User> getAuthenticatedUser(Authentication authentication) {
        Object principal = authentication.getPrincipal();

        if (!(principal instanceof User)) {
            log.error("Principal is not a User instance. Actual type: {}", principal.getClass());
            return ResponseEntity.status(401).build();
        }

        User loggedInUser = (User) principal;
        log.info("Profile endpoint hit by {}", loggedInUser.getEmail());

        // Return the User directly (lazy fields are ignored by @JsonIgnore)
        return ResponseEntity.ok(loggedInUser);
    }
}