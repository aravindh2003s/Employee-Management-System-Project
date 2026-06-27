package com.hrms.ems.repository;

import com.hrms.ems.model.LeaveRequest;
import com.hrms.ems.model.LeaveStatus;
import com.hrms.ems.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LeaveRequestRepository extends JpaRepository<LeaveRequest, Long> {
    List<LeaveRequest> findByUserOrderByAppliedOnDesc(User user);
    List<LeaveRequest> findByStatusOrderByAppliedOnDesc(LeaveStatus status);
    List<LeaveRequest> findByUserId(Long userId);
}
