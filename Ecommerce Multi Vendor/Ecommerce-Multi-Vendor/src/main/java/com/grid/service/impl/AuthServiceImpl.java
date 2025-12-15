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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
    private final PasswordEncoder passwordEncoder;

    private static final Logger log = LoggerFactory.getLogger(AuthServiceImpl.class);

    // -------------------------------------------------------
    // SEND OTP
    // -------------------------------------------------------
    @Override
    @Transactional
    public void sentLoginOtp(String email) throws Exception {

        email = email.trim().toLowerCase();
        verificationCodeRepository.deleteAllByEmail(email);

        String otp = OtpUtil.generateOtp();

        VerificationCode code = new VerificationCode();
        code.setEmail(email);
        code.setOtp(otp);
        verificationCodeRepository.save(code);

        emailService.sendVerificationOtpEmail(email, otp,
                "OTP Verification",
                "Your OTP for Grid login/signup is: " + otp,
                "http://localhost:5424/verify/"
        );

        log.info("OTP sent to {}", email);
    }

    // -------------------------------------------------------
    // SIGNUP (OTP + USER CREATION)
    // -------------------------------------------------------
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

        // ------------------------
        // 🔹 ROLE BASED ON EMAIL
        // ------------------------
        USER_ROLE role;
        if (req.getEmail().equalsIgnoreCase("admin@grid.com")) {
            role = USER_ROLE.ROLE_ADMIN;
        } else {
            try {
                if (sellerService.getSellerByEmail(req.getEmail()) != null) {
                    role = USER_ROLE.ROLE_SELLER;
                } else {
                    role = USER_ROLE.ROLE_USER;
                }
            } catch (Exception e) {
                role = USER_ROLE.ROLE_USER;
            }
        }

        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(role.name()));
        Authentication authentication = new UsernamePasswordAuthenticationToken(req.getEmail(), null, authorities);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        return jwtProvider.generateToken(authentication);
    }

    // -------------------------------------------------------
    // LOGIN (OTP)
    // -------------------------------------------------------
    @Override
    @Transactional
    public AuthResponse signin(LoginRequest req) throws Exception {
        String email = req.getEmail().trim().toLowerCase();
        String otp = req.getOtp();

        // OTP Authentication
        Authentication authentication = authenticate(email, otp);
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Save user if not exists
        User user = userRepository.findByEmail(email);
        if (user == null) {
            user = new User();
            user.setEmail(email);
            user.setFullName(""); // or from request if available
            user.setMobile("");
            user.setPassword("");
            user = userRepository.save(user);

            // Create cart for new user
            Cart cart = new Cart();
            cart.setUser(user);
            cartRepository.save(cart);
        }

        // Generate JWT
        String token = jwtProvider.generateToken(authentication);

        AuthResponse authResponse = new AuthResponse();
        authResponse.setJwt(token);
        authResponse.setMessage("Login successful via OTP");

        // ------------------------
        // 🔹 ROLE FROM AUTH
        // ------------------------
        authResponse.setRole(
                USER_ROLE.valueOf(
                        authentication.getAuthorities().iterator().next().getAuthority()
                )
        );

        return authResponse;
    }

    // -------------------------------------------------------
    // INTERNAL OTP AUTH
    // -------------------------------------------------------
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

        // ------------------------
        // 🔹 ROLE BASED ON EMAIL
        // ------------------------
        USER_ROLE role;
        if (email.equalsIgnoreCase("gridstore724@gmail.com")) {
            role = USER_ROLE.ROLE_ADMIN;
        } else {
            try {
                if (sellerService.getSellerByEmail(email) != null) {
                    role = USER_ROLE.ROLE_SELLER;
                } else {
                    role = USER_ROLE.ROLE_USER;
                }
            } catch (Exception e) {
                role = USER_ROLE.ROLE_USER;
            }
        }

        Collection<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(role.name()));

        log.info("OTP validated for {}: role={}", email, role);

        return new UsernamePasswordAuthenticationToken(email, null, authorities);
    }
}
