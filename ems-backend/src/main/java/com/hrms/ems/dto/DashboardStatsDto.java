package com.hrms.ems.dto;

import java.util.Map;

public class DashboardStatsDto {
    private long totalEmployees;
    private long totalDepartments;
    private double todayAttendancePercent;
    private double totalPayroll;
    private Map<String, Long> departmentDistribution;

    public DashboardStatsDto() {
    }

    public DashboardStatsDto(long totalEmployees, long totalDepartments, double todayAttendancePercent, double totalPayroll, Map<String, Long> departmentDistribution) {
        this.totalEmployees = totalEmployees;
        this.totalDepartments = totalDepartments;
        this.todayAttendancePercent = todayAttendancePercent;
        this.totalPayroll = totalPayroll;
        this.departmentDistribution = departmentDistribution;
    }

    public long getTotalEmployees() {
        return totalEmployees;
    }

    public void setTotalEmployees(long totalEmployees) {
        this.totalEmployees = totalEmployees;
    }

    public long getTotalDepartments() {
        return totalDepartments;
    }

    public void setTotalDepartments(long totalDepartments) {
        this.totalDepartments = totalDepartments;
    }

    public double getTodayAttendancePercent() {
        return todayAttendancePercent;
    }

    public void setTodayAttendancePercent(double todayAttendancePercent) {
        this.todayAttendancePercent = todayAttendancePercent;
    }

    public double getTotalPayroll() {
        return totalPayroll;
    }

    public void setTotalPayroll(double totalPayroll) {
        this.totalPayroll = totalPayroll;
    }

    public Map<String, Long> getDepartmentDistribution() {
        return departmentDistribution;
    }

    public void setDepartmentDistribution(Map<String, Long> departmentDistribution) {
        this.departmentDistribution = departmentDistribution;
    }
}
