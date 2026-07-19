package com.hrms.ems.controller;

import com.hrms.ems.dto.ChangePasswordRequest;
import com.hrms.ems.dto.EmployeeDTO;
import com.hrms.ems.dto.ProfileUpdateRequest;
import com.hrms.ems.exception.ResourceNotFoundException;
import com.hrms.ems.model.User;
import com.hrms.ems.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder encoder;

    private final String UPLOAD_DIR = "uploads/profiles/";

    @PutMapping("/info")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<EmployeeDTO> updateProfileInfo(@RequestBody ProfileUpdateRequest request, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());

        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(convertToDTO(updatedUser));
    }

    @PutMapping("/password")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        if (!encoder.matches(request.getCurrentPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Incorrect current password.");
        }

        user.setPassword(encoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("Password updated successfully.");
    }

    @PostMapping("/picture")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<EmployeeDTO> uploadProfilePicture(@RequestParam("file") MultipartFile file, Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        if (file.isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        try {
            // Create uploads directory if it doesn't exist
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFileName = file.getOriginalFilename();
            String extension = originalFileName != null && originalFileName.contains(".") ? originalFileName.substring(originalFileName.lastIndexOf(".")) : ".jpg";
            String newFileName = UUID.randomUUID().toString() + extension;
            
            Path filePath = uploadPath.resolve(newFileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Update user profile URL (Accessible via WebConfig resource handler)
            user.setProfilePhotoUrl("/uploads/profiles/" + newFileName);
            User updatedUser = userRepository.save(user);

            return ResponseEntity.ok(convertToDTO(updatedUser));
        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    private EmployeeDTO convertToDTO(User user) {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(user.getId());
        dto.setEmployeeId(user.getEmployeeId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        if (user.getDepartment() != null) {
            dto.setDepartmentName(user.getDepartment().getName());
        }
        dto.setDesignation(user.getDesignation());
        dto.setSalary(user.getSalary());
        dto.setJoiningDate(user.getJoiningDate());
        dto.setEmploymentType(user.getEmploymentType());
        dto.setIsActive(user.getIsActive());
        dto.setRole(user.getRole());
        dto.setProfilePhotoUrl(user.getProfilePhotoUrl());
        return dto;
    }
}
