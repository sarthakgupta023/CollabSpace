package com.example.collab.user;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<AppUser, String> {
    Optional<AppUser> findByEmail(String email);
}
