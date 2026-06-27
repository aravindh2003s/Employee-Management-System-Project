package com.hrms.ems.service;

import com.hrms.ems.model.LeaveRequest;
import com.hrms.ems.model.LeaveStatus;
import com.hrms.ems.model.User;
import com.hrms.ems.repository.LeaveRequestRepository;
import com.hrms.ems.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaveService {

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;
    
    @Autowired
    private UserRepository userRepository;

    public List<LeaveRequest> getAllLeaves() {
        return leaveRequestRepository.findAll();
    }

    public List<LeaveRequest> getLeavesByUserId(Long userId) {
        return leaveRequestRepository.findByUserId(userId);
    }

    public LeaveRequest applyLeave(String email, LeaveRequest leaveRequest) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));
        leaveRequest.setUser(user);
        leaveRequest.setStatus(LeaveStatus.PENDING);
        return leaveRequestRepository.save(leaveRequest);
    }

    public LeaveRequest updateLeaveStatus(Long id, LeaveStatus status, String adminRemarks) {
        LeaveRequest leave = leaveRequestRepository.findById(id).orElseThrow(() -> new RuntimeException("Leave not found"));
        leave.setStatus(status);
        leave.setAdminRemarks(adminRemarks);
        return leaveRequestRepository.save(leave);
    }
}
