package com.hrms.ems.repository;

import com.hrms.ems.model.Payroll;
import com.hrms.ems.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.YearMonth;
import java.util.List;
import java.util.Optional;

@Repository
public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    List<Payroll> findByUserOrderByPayPeriodDesc(User user);
    Optional<Payroll> findByUserAndPayPeriod(User user, YearMonth payPeriod);
    List<Payroll> findByUserId(Long userId);
}
