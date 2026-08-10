package com.example.collab.user;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Map;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import jakarta.validation.constraints.NotBlank;

/**
 * Handles OTP based authentication.
 */
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private final UserRepository userRepository;
    private final Random random = new Random();

    private JavaMailSender mailSender;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public record RequestOtpRequest(@NotBlank String name, @NotBlank String email) {
    }

    @PostMapping("/request-otp")
    public Map<String, String> requestOtp(@RequestBody RequestOtpRequest request) {
        AppUser user = userRepository.findByEmail(request.email()).orElse(null);
        if (user == null) {
            user = AppUser.create(request.name(), request.email());
            user = userRepository.save(user);
        }

        // Generate 6-digit OTP
        String otp = String.format("%06d", random.nextInt(999999));
        user.setCurrentOtp(otp);
        user.setOtpExpiry(Instant.now().plus(5, ChronoUnit.MINUTES));
        userRepository.save(user);

        // Simulate sending email
        System.out.println("=========================================");
        System.out.println("Simulating Email Sending...");
        System.out.println("To: " + request.email());
        System.out.println("Subject: Your CollabSpace Login OTP");
        System.out.println("OTP: " + otp);
        System.out.println("=========================================");
        return Map.of("otp", otp);
    }

    public record VerifyOtpRequest(@NotBlank String email, @NotBlank String otp) {
    }

    public record AuthResponse(String userId, String username) {
    }

    @PostMapping("/verify-otp")
    public AuthResponse verifyOtp(@RequestBody VerifyOtpRequest request) {
        AppUser user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        if (user.getCurrentOtp() == null || !user.getCurrentOtp().equals(request.otp())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid OTP");
        }

        if (user.getOtpExpiry() == null || Instant.now().isAfter(user.getOtpExpiry())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "OTP expired");
        }

        // Clear OTP after successful login
        user.setCurrentOtp(null);
        user.setOtpExpiry(null);
        userRepository.save(user);

        return new AuthResponse(user.getId(), user.getUsername());
    }
}
