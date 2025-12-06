package com.grid.controller;

import com.grid.modal.VerificationCode;
import com.grid.repository.UserRepository;
import com.grid.request.LoginOtpRequest;
import com.grid.request.LoginRequest;
import com.grid.response.ApiResponse;
import com.grid.response.AuthResponse;
import com.grid.response.SignupRequest;
import com.grid.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final AuthService authService;

    // ------------------- Signup -------------------
    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> createUserHandler(@RequestBody SignupRequest req) throws Exception {
        String jwt = authService.createUser(req);

        AuthResponse res = new AuthResponse();
        res.setJwt(jwt);
        res.setMessage("Register Success");

        return ResponseEntity.ok(res);
    }

    // ------------------- Send OTP -------------------
    @PostMapping("/sent/login-signup-otp")
    public ResponseEntity<ApiResponse> sendOtp(@RequestBody LoginOtpRequest request) throws Exception {
        authService.sentLoginOtp(request.getEmail());

        ApiResponse response = new ApiResponse();
        response.setMessage("OTP sent successfully");
        return ResponseEntity.ok(response);
    }


    // ------------------- Login -------------------
    @PostMapping("/signin")
    public ResponseEntity<AuthResponse> loginHandler(@RequestBody LoginRequest req) {
        try {
            AuthResponse authResponse = authService.signin(req);
            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            System.err.println("Login failed for email: " + req.getEmail());
            e.printStackTrace();
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Login failed", e);
        }
    }
}
