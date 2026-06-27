package com.hrms.ems.dto;

public class AuthResponse {
    private String token;
    private Long id;
    private String email;
    private String employeeId;
    private String role;
    
    public AuthResponse(String token, Long id, String email, String employeeId, String role) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.employeeId = employeeId;
        this.role = role;
    }

    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
