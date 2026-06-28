package com.hrms.ems.controller;

import com.hrms.ems.model.Payroll;
import com.hrms.ems.service.PayrollService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payroll")
public class PayrollController {

    @Autowired
    private PayrollService payrollService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<Payroll> getAllPayrolls() {
        return payrollService.getAllPayrolls();
    }

    @PostMapping("/generate")
    @PreAuthorize("hasRole('ADMIN')")
    @SuppressWarnings("null")
    public ResponseEntity<?> generatePayroll(@RequestBody Map<String, Object> request) {
        Long userId = Long.valueOf(request.get("userId").toString());
        int month = Integer.parseInt(request.get("month").toString());
        int year = Integer.parseInt(request.get("year").toString());
        double bonus = Double.parseDouble(request.getOrDefault("bonus", "0.0").toString());
        double deductions = Double.parseDouble(request.getOrDefault("deductions", "0.0").toString());
        
        return ResponseEntity.ok(payrollService.generatePayroll(userId, month, year, bonus, deductions));
    }
}
