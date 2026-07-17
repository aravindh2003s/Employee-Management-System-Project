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

    @Autowired
    private NotificationService notificationService;

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

    public LeaveRequest updateLeaveStatus(@org.springframework.lang.NonNull Long id, LeaveStatus status, String adminRemarks) {
        LeaveRequest leave = leaveRequestRepository.findById(id).orElseThrow(() -> new RuntimeException("Leave not found"));
        leave.setStatus(status);
        leave.setAdminRemarks(adminRemarks);
        LeaveRequest updatedLeave = leaveRequestRepository.save(leave);
        
        // Send notification to employee
        String message = "Your leave request from " + leave.getStartDate() + " to " + leave.getEndDate() + " has been " + status + ".";
        if (adminRemarks != null && !adminRemarks.isEmpty()) {
            message += " Remarks: " + adminRemarks;
        }
        notificationService.createNotification(leave.getUser(), "Leave Request " + status, message);
        
        return updatedLeave;
    }
}
