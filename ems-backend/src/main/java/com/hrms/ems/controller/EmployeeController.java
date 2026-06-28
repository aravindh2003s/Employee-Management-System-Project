package com.hrms.ems.controller;

import com.hrms.ems.dto.EmployeeDTO;
import com.hrms.ems.exception.ResourceNotFoundException;
import com.hrms.ems.model.Role;
import com.hrms.ems.model.User;
import com.hrms.ems.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/employees")
public class EmployeeController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder encoder;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public List<EmployeeDTO> getAllEmployees() {
        return userRepository.findAll().stream().map(this::convertToDTO).collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmployeeDTO> getEmployeeById(@PathVariable @org.springframework.lang.NonNull Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id :" + id));
        return ResponseEntity.ok(convertToDTO(user));
    }
    
    @GetMapping("/me")
    @PreAuthorize("hasRole('EMPLOYEE') or hasRole('ADMIN')")
    public ResponseEntity<EmployeeDTO> getCurrentEmployee() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with email: " + email));
        return ResponseEntity.ok(convertToDTO(user));
    }
    
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmployeeDTO> createEmployee(@RequestBody User employee) {
        if (employee.getPassword() == null || employee.getPassword().isEmpty()) {
            employee.setPassword("password123");
        }
        employee.setPassword(encoder.encode(employee.getPassword()));
        
        if (employee.getRole() == null) {
            employee.setRole(Role.ROLE_EMPLOYEE);
        }
        
        if (employee.getJoiningDate() == null) {
            employee.setJoiningDate(java.time.LocalDate.now());
        }
        
        User savedUser = userRepository.save(employee);
        return ResponseEntity.ok(convertToDTO(savedUser));
    }
    
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<EmployeeDTO> updateEmployee(@PathVariable @org.springframework.lang.NonNull Long id, @RequestBody User employeeDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id :" + id));
        
        user.setFirstName(employeeDetails.getFirstName());
        user.setLastName(employeeDetails.getLastName());
        user.setEmail(employeeDetails.getEmail());
        
        if (employeeDetails.getDepartment() != null) {
            user.setDepartment(employeeDetails.getDepartment());
        }
        
        User updatedUser = userRepository.save(user);
        return ResponseEntity.ok(convertToDTO(updatedUser));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteEmployee(@PathVariable @org.springframework.lang.NonNull Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Employee not found with id :" + id));
        user.setIsActive(false);
        userRepository.save(user);
        return ResponseEntity.ok().build();
    }

    private EmployeeDTO convertToDTO(User user) {
        EmployeeDTO dto = new EmployeeDTO();
        dto.setId(user.getId());
        dto.setEmployeeId(user.getEmployeeId());
        dto.setFirstName(user.getFirstName());
        dto.setLastName(user.getLastName());
        dto.setEmail(user.getEmail());
        dto.setPhoneNumber(user.getPhoneNumber());
        if (user.getDepartment() != null) {
            dto.setDepartmentName(user.getDepartment().getName());
        }
        dto.setDesignation(user.getDesignation());
        dto.setSalary(user.getSalary());
        dto.setJoiningDate(user.getJoiningDate());
        dto.setEmploymentType(user.getEmploymentType());
        dto.setIsActive(user.getIsActive());
        dto.setRole(user.getRole());
        return dto;
    }
}
