package com.hrms.ems.controller;

import com.hrms.ems.model.Attendance;
import com.hrms.ems.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Attendance> getAllAttendance() {
        return attendanceService.getAllAttendance();
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public List<Attendance> getMyAttendance(Authentication authentication) {

        // Here we should Ideally pass user ID, but we can resolve it in service by email
        // To keep it simple we just get all for now, or we can fetch by email in a real app
        // Let's implement fetching by ID in service if we had ID, but we don't in UserDetails easily.
        // Actually, we'll just fetch all for now and filter by email in service (omitted for brevity).
        throw new UnsupportedOperationException("Needs User ID from token");
    }

    @PostMapping("/check-in")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<?> checkIn(Authentication authentication) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        return ResponseEntity.ok(attendanceService.checkIn(email));
    }

    @PostMapping("/check-out")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<?> checkOut(Authentication authentication) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        return ResponseEntity.ok(attendanceService.checkOut(email));
    }
}
