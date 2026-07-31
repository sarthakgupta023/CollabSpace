package com.example.collab;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Entry point. @EnableScheduling turns on the expiry job and the
 * periodic MongoDB flush job (see the `scheduler` package).
 */
@SpringBootApplication
@EnableScheduling
public class CollabEditorApplication {
    public static void main(String[] args) {
        SpringApplication.run(CollabEditorApplication.class, args);
    }
}
