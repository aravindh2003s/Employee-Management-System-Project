package com.hrms.ems.controller;

import com.hrms.ems.model.LeaveRequest;
import com.hrms.ems.model.LeaveStatus;
import com.hrms.ems.service.LeaveService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/leaves")
public class LeaveController {

    @Autowired
    private LeaveService leaveService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<LeaveRequest> getAllLeaves() {
        return leaveService.getAllLeaves();
    }

    @PostMapping("/apply")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<?> applyLeave(@RequestBody LeaveRequest leaveRequest, Authentication authentication) {
        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        return ResponseEntity.ok(leaveService.applyLeave(email, leaveRequest));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateLeaveStatus(@PathVariable @org.springframework.lang.NonNull Long id, @RequestBody Map<String, String> request) {
        LeaveStatus status = LeaveStatus.valueOf(request.get("status"));
        String remarks = request.get("adminRemarks");
        return ResponseEntity.ok(leaveService.updateLeaveStatus(id, status, remarks));
    }
}
