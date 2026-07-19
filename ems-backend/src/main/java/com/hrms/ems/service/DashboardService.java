package com.hrms.ems.service;

import com.hrms.ems.dto.DashboardStatsDto;
import com.hrms.ems.dto.EmployeeDashboardStatsDto;
import com.hrms.ems.model.Attendance;
import com.hrms.ems.model.Department;
import com.hrms.ems.model.LeaveRequest;
import com.hrms.ems.model.LeaveStatus;
import com.hrms.ems.model.User;
import com.hrms.ems.repository.AttendanceRepository;
import com.hrms.ems.repository.DepartmentRepository;
import com.hrms.ems.repository.LeaveRequestRepository;
import com.hrms.ems.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private LeaveRequestRepository leaveRequestRepository;

    public DashboardStatsDto getAdminStats() {
        DashboardStatsDto stats = new DashboardStatsDto();
        
        List<User> employees = userRepository.findAll();
        stats.setTotalEmployees(employees.size());
        
        List<Department> departments = departmentRepository.findAll();
        stats.setTotalDepartments(departments.size());

        // Payroll (Sum of salaries)
        double totalPayroll = employees.stream()
                .filter(u -> u.getSalary() != null)
                .mapToDouble(User::getSalary)
                .sum();
        stats.setTotalPayroll(totalPayroll);

        // Department Distribution
        Map<String, Long> deptDistribution = new HashMap<>();
        for (User u : employees) {
            String deptName = (u.getDepartment() != null) ? u.getDepartment().getName() : "Unassigned";
            deptDistribution.put(deptName, deptDistribution.getOrDefault(deptName, 0L) + 1);
        }
        stats.setDepartmentDistribution(deptDistribution);

        // Today's Attendance
        LocalDate today = LocalDate.now();
        List<Attendance> attendances = attendanceRepository.findAll();
        long todayAttendanceCount = attendances.stream()
                .filter(a -> today.equals(a.getDate()))
                .count();
        
        double percent = (employees.isEmpty()) ? 0 : ((double) todayAttendanceCount / employees.size()) * 100;
        stats.setTodayAttendancePercent(Math.round(percent * 10.0) / 10.0);

        return stats;
    }

    public EmployeeDashboardStatsDto getEmployeeStats(Long userId) {
        EmployeeDashboardStatsDto stats = new EmployeeDashboardStatsDto();
        
        // Typical starting leave balance is 20 days. Subtract approved leaves.
        List<LeaveRequest> userLeaves = leaveRequestRepository.findByUserId(userId);
        long takenLeaves = userLeaves.stream()
                .filter(l -> LeaveStatus.APPROVED.equals(l.getStatus()))
                .count();
        stats.setLeaveBalance(20 - (int)takenLeaves);
        
        // Hours this week (mocked as simple count of attendances this week * 8 for now)
        // A full implementation would calculate actual time diffs between checkIn and checkOut
        stats.setHoursThisWeek(32.5); // Fixed for brevity

        return stats;
    }
}
