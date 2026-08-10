package com.example.collab.user;

import java.time.Instant;
import java.util.UUID;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "app_users")
@Data
@NoArgsConstructor
public class AppUser {

    @Id
    private String id;

    private String username;

    private String email;

    private String currentOtp;

    private Instant otpExpiry;

    private Instant createdAt;

    public static AppUser create(String username, String email) {
        AppUser user = new AppUser();
        user.setId(UUID.randomUUID().toString());
        user.setUsername(username);
        user.setEmail(email);
        user.setCreatedAt(Instant.now());
        return user;
    }
}