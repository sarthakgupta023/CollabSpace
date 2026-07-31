package com.example.collab.user;

import jakarta.validation.constraints.NotBlank;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * TODO REPLACE ME: this is a placeholder so the rest of the app has a
 * userId to work with. There is no password, no session, no security here.
 * Swap this for real Spring Security (JWT or session-based) before shipping
 * anything - every other endpoint trusts the X-User-Id header this hands out.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserRepository userRepository;

    public AuthController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public record SignupRequest(@NotBlank String username) {}
    public record AuthResponse(String userId, String username) {}

    @PostMapping("/signup")
    public AuthResponse signup(@RequestBody SignupRequest request) {
        AppUser user = AppUser.create(request.username());
        userRepository.save(user);
        return new AuthResponse(user.getId(), user.getUsername());
    }
}
