package com.hrms.ems.service;

import com.hrms.ems.model.Payroll;
import com.hrms.ems.model.User;
import com.hrms.ems.repository.PayrollRepository;
import com.hrms.ems.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.List;

@Service
public class PayrollService {

    @Autowired
    private PayrollRepository payrollRepository;
    
    @Autowired
    private UserRepository userRepository;

    public List<Payroll> getAllPayrolls() {
        return payrollRepository.findAll();
    }

    public List<Payroll> getPayrollByUserId(Long userId) {
        return payrollRepository.findByUserId(userId);
    }

    public Payroll generatePayroll(Long userId, int month, int year, double bonus, double deductions) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        
        Payroll payroll = new Payroll();
        payroll.setUser(user);
        payroll.setPayPeriod(YearMonth.of(year, month));
        
        double basicSalary = user.getSalary() != null ? user.getSalary().doubleValue() : 0.0;
        payroll.setBasicSalary(basicSalary);
        payroll.setBonus(bonus);
        payroll.setDeductions(deductions);
        payroll.setAllowances(0.0);
        payroll.setTax(0.0);
        
        payroll.setGeneratedDate(LocalDate.now());
        
        return payrollRepository.save(payroll);
    }
}
