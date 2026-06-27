package com.hrms.ems.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.YearMonth;

@Entity
@Table(name = "payroll")
public class Payroll {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private YearMonth payPeriod;

    private Double basicSalary;

    private Double bonus;

    private Double allowances;

    private Double deductions;

    private Double tax;

    private Double netSalary;

    private LocalDate generatedDate;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public YearMonth getPayPeriod() { return payPeriod; }
    public void setPayPeriod(YearMonth payPeriod) { this.payPeriod = payPeriod; }
    public Double getBasicSalary() { return basicSalary; }
    public void setBasicSalary(Double basicSalary) { this.basicSalary = basicSalary; }
    public Double getBonus() { return bonus; }
    public void setBonus(Double bonus) { this.bonus = bonus; }
    public Double getAllowances() { return allowances; }
    public void setAllowances(Double allowances) { this.allowances = allowances; }
    public Double getDeductions() { return deductions; }
    public void setDeductions(Double deductions) { this.deductions = deductions; }
    public Double getTax() { return tax; }
    public void setTax(Double tax) { this.tax = tax; }
    public Double getNetSalary() { return netSalary; }
    public void setNetSalary(Double netSalary) { this.netSalary = netSalary; }
    public LocalDate getGeneratedDate() { return generatedDate; }
    public void setGeneratedDate(LocalDate generatedDate) { this.generatedDate = generatedDate; }
    
    @PrePersist
    @PreUpdate
    private void calculateNetSalary() {
        this.netSalary = (basicSalary != null ? basicSalary : 0.0) +
                         (bonus != null ? bonus : 0.0) +
                         (allowances != null ? allowances : 0.0) -
                         (deductions != null ? deductions : 0.0) -
                         (tax != null ? tax : 0.0);
    }
}
