package com.studentmanagement;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
    @GetMapping("/verify")
    public ResponseEntity<Map<String, String>> verify() {
        return ResponseEntity.ok(Map.of("status", "authenticated"));
    }
}
