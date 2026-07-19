package com.hrms.ems.dto;

public class EmployeeDashboardStatsDto {
    private int leaveBalance;
    private double hoursThisWeek;

    public EmployeeDashboardStatsDto() {
    }

    public EmployeeDashboardStatsDto(int leaveBalance, double hoursThisWeek) {
        this.leaveBalance = leaveBalance;
        this.hoursThisWeek = hoursThisWeek;
    }

    public int getLeaveBalance() {
        return leaveBalance;
    }

    public void setLeaveBalance(int leaveBalance) {
        this.leaveBalance = leaveBalance;
    }

    public double getHoursThisWeek() {
        return hoursThisWeek;
    }

    public void setHoursThisWeek(double hoursThisWeek) {
        this.hoursThisWeek = hoursThisWeek;
    }
}
