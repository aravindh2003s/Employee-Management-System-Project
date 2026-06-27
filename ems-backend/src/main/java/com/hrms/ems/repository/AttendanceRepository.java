package com.hrms.ems.repository;

import com.hrms.ems.model.Attendance;
import com.hrms.ems.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByUserOrderByDateDesc(User user);
    Optional<Attendance> findByUserAndDate(User user, LocalDate date);
    List<Attendance> findByDate(LocalDate date);
    List<Attendance> findByUserId(Long userId);
}
