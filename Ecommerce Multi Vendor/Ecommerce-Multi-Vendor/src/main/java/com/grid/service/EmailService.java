package com.grid.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender javaMailSender;

    public void sendVerificationOtpEmail(String userEmail, String otp, String subject, String text, String url) throws MessagingException {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

        String htmlContent = "<p>Hi,</p>"
                + "<p>Your OTP for verification is: <strong>" + otp + "</strong></p>"
                + "<p>" + text + "</p>"
                + "<p><a href='" + url + otp + "' style='padding:10px 20px; background-color:#007bff; color:white; text-decoration:none; border-radius:5px;'>Verify Now</a></p>"
                + "<p>This code will expire in 10 minutes.</p>"
                + "<p>Thanks,<br/>Grid Ecommerce Team</p>";


        helper.setSubject(subject);
        helper.setText(htmlContent, true); // true enables HTML
        helper.setTo(userEmail);

        javaMailSender.send(mimeMessage);
    }

}
