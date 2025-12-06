package com.grid.controller;

import com.grid.Exception.SellerException;
import com.grid.config.JwtProvider;
import com.grid.domain.AccountStatus;
import com.grid.modal.Seller;
import com.grid.modal.SellerReport;
import com.grid.modal.VerificationCode;
import com.grid.repository.VerificationCodeRepository;
import com.grid.request.LoginRequest;
import com.grid.response.AuthResponse;
import com.grid.service.AuthService;
import com.grid.service.EmailService;
import com.grid.service.SellerReportService;
import com.grid.service.SellerService;
import com.grid.util.OtpUtil;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/sellers")
public class SellerController {

    private static final Logger log = LoggerFactory.getLogger(SellerController.class);
    private final SellerService sellerService;
    private final VerificationCodeRepository verificationCodeRepository;
    private final AuthService authService;
    private final EmailService emailService;
    private final JwtProvider jwtProvider;
    private final SellerReportService sellerReportService;

    // ONLY ONE LOGIN METHOD
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> loginSeller(@RequestBody LoginRequest request) throws Exception {
        AuthResponse authResponse = authService.signin(request);
        return ResponseEntity.ok(authResponse);  // ✅ now the return type matches
    }



    @PatchMapping("/verify/{otp}")
    public ResponseEntity<Seller> verifySellerEmail(@PathVariable String otp) throws Exception {
        VerificationCode verificationCode = verificationCodeRepository.findByOtp(otp);
        if (verificationCode == null || !verificationCode.getOtp().equals(otp)) {
            throw new Exception("Invalid OTP");
        }

        Seller seller = sellerService.verifyEmail(verificationCode.getEmail(), otp);
        return new ResponseEntity<>(seller, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<Seller> createSeller(@RequestBody Seller seller) throws Exception {
        Seller savedSeller = sellerService.createSeller(seller);

        String otp = OtpUtil.generateOtp();
        VerificationCode verificationCode = new VerificationCode();
        verificationCode.setOtp(otp);
        verificationCode.setEmail(seller.getEmail());
        verificationCodeRepository.save(verificationCode);

        String subject = "Grid Email Verification Code";
        String text = "Welcome to Grid, verify your account using this link";
        String frontendUrl = "http://localhost:5424/verify-seller/";
        emailService.sendVerificationOtpEmail(seller.getEmail(), otp, subject, text, frontendUrl);

        return new ResponseEntity<>(savedSeller, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Seller> getSellerById(@PathVariable Long id) throws SellerException {
        Seller seller = sellerService.getSellerById(id);
        return new ResponseEntity<>(seller, HttpStatus.OK);
    }

    @GetMapping("/profile")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<Seller> getSellerByJwt(Authentication authentication) throws Exception {
        // FIX: Use Authentication to get the Seller entity directly (set by JwtTokenValidator)
        if (authentication != null && authentication.getPrincipal() instanceof Seller) {
            Seller seller = (Seller) authentication.getPrincipal();
            return ResponseEntity.ok(seller);
        }
        // Fallback for unauthorized
        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Seller not authenticated");
    }


    public ResponseEntity<SellerReport> getSellerReport(
            @RequestHeader("Authorization") String jwt) throws Exception {
        //String email = jwtProvider.getEmailFromJwtToken(jwt);
        Seller seller=sellerService.getSellerProfile(jwt);
        SellerReport report=sellerReportService.getSellerReport(seller);
        return new ResponseEntity<>(report, HttpStatus.OK);
    }


    @GetMapping
    public ResponseEntity<List<Seller>> getAllSellers(@RequestParam(required = false) AccountStatus status) {
        List<Seller> sellers = sellerService.getAllSellers(status);
        return ResponseEntity.ok(sellers);
    }
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<Seller> updateSeller(@PathVariable Long id,
                                               @RequestBody Seller updateReq,
                                               Principal principal) throws Exception {
        Seller currentSeller = sellerService.getSellerByEmail(principal.getName());
        if (!currentSeller.getId().equals(id)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You can only update your own profile");
        }

        Seller updated = sellerService.updateSeller(id, updateReq);
        return ResponseEntity.ok(updated);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSeller(@PathVariable Long id) throws Exception {
        sellerService.deleteSeller(id);
        return ResponseEntity.noContent().build();
    }
}