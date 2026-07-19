package com.hrms.ems.controller;

import com.hrms.ems.model.Notification;
import com.hrms.ems.model.User;
import com.hrms.ems.repository.UserRepository;
import com.hrms.ems.security.UserDetailsImpl;
import com.hrms.ems.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;
    
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<List<Notification>> getMyNotifications(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        long userId = userDetails.getId();
        User user = userRepository.findById(userId).orElse(null);
        return ResponseEntity.ok(notificationService.getMyNotifications(user));
    }

    @PutMapping("/{id}/read")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<?> markAsRead(@PathVariable @org.springframework.lang.NonNull Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok().build();
    }
}
