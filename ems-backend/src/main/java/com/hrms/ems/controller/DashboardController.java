package com.hrms.ems.controller;

import com.hrms.ems.dto.DashboardStatsDto;
import com.hrms.ems.dto.EmployeeDashboardStatsDto;
import com.hrms.ems.model.User;
import com.hrms.ems.repository.UserRepository;
import com.hrms.ems.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardStatsDto> getAdminDashboardStats() {
        return ResponseEntity.ok(dashboardService.getAdminStats());
    }

    @GetMapping("/employee")
    @PreAuthorize("hasAnyRole('ADMIN', 'EMPLOYEE')")
    public ResponseEntity<EmployeeDashboardStatsDto> getEmployeeDashboardStats() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return ResponseEntity.ok(dashboardService.getEmployeeStats(user.getId()));
    }
}
