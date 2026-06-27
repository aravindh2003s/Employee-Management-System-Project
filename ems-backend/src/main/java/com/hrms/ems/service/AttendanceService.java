package com.hrms.ems.service;

import com.hrms.ems.model.Attendance;
import com.hrms.ems.model.User;
import com.hrms.ems.repository.AttendanceRepository;
import com.hrms.ems.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;
    
    @Autowired
    private UserRepository userRepository;

    public List<Attendance> getAllAttendance() {
        return attendanceRepository.findAll();
    }

    public List<Attendance> getAttendanceByUserId(Long userId) {
        return attendanceRepository.findByUserId(userId);
    }

    public Attendance checkIn(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        
        Attendance attendance = new Attendance();
        attendance.setUser(user);
        attendance.setDate(LocalDate.now());
        attendance.setCheckInTime(LocalTime.now());
        attendance.setStatus(com.hrms.ems.model.AttendanceStatus.PRESENT);
        
        return attendanceRepository.save(attendance);
    }

    public Attendance checkOut(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        
        // Find today's attendance for user
        List<Attendance> todayAttendance = attendanceRepository.findByUserId(user.getId()).stream()
                .filter(a -> a.getDate().equals(LocalDate.now()) && a.getCheckOutTime() == null)
                .toList();
                
        if (todayAttendance.isEmpty()) {
            throw new RuntimeException("No active check-in found for today");
        }
        
        Attendance attendance = todayAttendance.get(0);
        attendance.setCheckOutTime(LocalTime.now());
        return attendanceRepository.save(attendance);
    }
}
