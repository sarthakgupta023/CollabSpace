package com.example.collab.user;

import java.time.Instant;
import java.util.UUID;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * TODO: this is a placeholder. Replace with a real user model + password
 * hashing + Spring Security once you add proper auth. Right now signup just
 * creates a row and hands back the id - there is no password check at all.
 */
@Entity
@Table(name = "app_users")
@Data
@NoArgsConstructor
public class AppUser {

    @Id
    private String id;

    private String username;

    private Instant createdAt;

    public static AppUser create(String username) {
        AppUser user = new AppUser();
        user.setId(UUID.randomUUID().toString());
        user.setUsername(username);
        user.setCreatedAt(Instant.now());
        return user;
    }
}