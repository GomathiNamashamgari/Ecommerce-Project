package com.grid.service.impl;

import com.grid.config.JwtProvider;
import com.grid.domain.USER_ROLE;
import com.grid.modal.Cart;
import com.grid.modal.User;
import com.grid.modal.VerificationCode;
import com.grid.repository.CartRepository;
import com.grid.repository.UserRepository;
import com.grid.repository.VerificationCodeRepository;
import com.grid.request.LoginRequest;
import com.grid.response.AuthResponse;
import com.grid.response.SignupRequest;
import com.grid.service.AuthService;
import com.grid.service.EmailService;
import com.grid.service.SellerService;
import com.grid.util.OtpUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final JwtProvider jwtProvider;
    private final SellerService sellerService;
    private final VerificationCodeRepository verificationCodeRepository;
    private final EmailService emailService;
    private final CustomerUserServiceImpl customerUserService;

    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);

    // ------------------- Send OTP -------------------
    @Transactional
    @Override
    public void sentLoginOtp(String email) throws Exception {
        email = email.trim().toLowerCase();
        verificationCodeRepository.deleteAllByEmail(email);

        String otp = OtpUtil.generateOtp();
        VerificationCode code = new VerificationCode();
        code.setEmail(email);
        code.setOtp(otp);
        verificationCodeRepository.save(code);

        String subject = "OTP Verification";
        String text = "Your OTP for Grid login/signup is: " + otp;
        String url = "http://localhost:5424/verify/";
        emailService.sendVerificationOtpEmail(email, otp, subject, text, url);

        log.info("OTP sent to {}", email);
    }

    // ------------------- Signup -------------------
    @Override
    public String createUser(SignupRequest req) throws Exception {
        List<VerificationCode> codes = verificationCodeRepository.findAllByEmail(req.getEmail());
        if (codes.isEmpty()) {
            throw new BadCredentialsException("No OTP found for email: " + req.getEmail());
        }
        VerificationCode verificationCode = codes.get(codes.size() - 1);
        if (!verificationCode.getOtp().equals(req.getOtp())) {
            throw new BadCredentialsException("Invalid OTP for email: " + req.getEmail());
        }

        User user = userRepository.findByEmail(req.getEmail());
        if (user == null) {
            User createdUser = new User();
            createdUser.setEmail(req.getEmail());
            createdUser.setFullName(req.getFullName());
            createdUser.setMobile(req.getMobile() != null ? req.getMobile() : "");
            user = userRepository.save(createdUser);

            Cart cart = new Cart();
            cart.setUser(user);
            cartRepository.save(cart);
        }

        verificationCodeRepository.delete(verificationCode);

        // Use email as principal (string), not the object
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));
        Authentication authentication = new UsernamePasswordAuthenticationToken(req.getEmail(), null, authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        return jwtProvider.generateToken(authentication);
    }

    // ------------------- Login -------------------
    @Transactional
    @Override
    public AuthResponse signin(LoginRequest req) throws Exception {
        String email = req.getEmail();
        String otp = req.getOtp();

        Authentication authentication = authenticate(email, otp);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtProvider.generateToken(authentication);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(token);
        authResponse.setMessage("Login successful via OTP");

        // Determine role from DB as enum
        USER_ROLE userRole = null;
        if (userRepository.findByEmail(email) != null) {
            userRole = USER_ROLE.ROLE_USER;
        } else if (sellerService.getSellerByEmail(email) != null) {
            userRole = USER_ROLE.ROLE_SELLER;
        }
        authResponse.setRole(userRole);

        return authResponse;
    }

    // ------------------- Authenticate OTP -------------------
    // ... (rest of the file remains the same)

    // ------------------- Authenticate OTP -------------------
    private Authentication authenticate(String email, String otp) throws Exception {
        List<VerificationCode> codes = verificationCodeRepository.findAllByEmail(email);
        if (codes.isEmpty()) {
            throw new BadCredentialsException("No OTP sent. Please request OTP first.");
        }

        VerificationCode code = codes.get(codes.size() - 1);
        if (!code.getOtp().equals(otp)) {
            throw new BadCredentialsException("Invalid OTP");
        }

        verificationCodeRepository.delete(code);

        // Check if user or seller exists
        USER_ROLE role;
        if (userRepository.findByEmail(email) != null) {
            role = USER_ROLE.ROLE_USER;
        } else if (sellerService.getSellerByEmail(email) != null) {
            role = USER_ROLE.ROLE_SELLER;
        } else {
            throw new BadCredentialsException("Email not registered");
        }

        Collection<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(role.toString()));

        log.info("OTP validated for {}: received={}, expected={}", email, otp, code.getOtp());
        // FIX: Use email (string) as principal, not the entity object
        return new UsernamePasswordAuthenticationToken(email, null, authorities);
    }
}