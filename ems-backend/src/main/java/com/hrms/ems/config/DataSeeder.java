package com.hrms.ems.config;

import com.hrms.ems.model.Role;
import com.hrms.ems.model.User;
import com.hrms.ems.repository.UserRepository;
import com.hrms.ems.repository.DepartmentRepository;
import com.hrms.ems.model.Department;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        
        Department itDept = departmentRepository.findByName("IT").orElse(null);
        if (itDept == null) {
            itDept = new Department();
            itDept.setName("IT");
            itDept.setDescription("Information Technology");
            itDept = departmentRepository.save(itDept);
        }

        Department hrDept = departmentRepository.findByName("HR").orElse(null);
        if (hrDept == null) {
            hrDept = new Department();
            hrDept.setName("HR");
            hrDept.setDescription("Human Resources");
            hrDept = departmentRepository.save(hrDept);
        }

        if (!userRepository.existsByEmail("admin@hrnexus.com")) {
            User admin = new User();
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setEmail("admin@hrnexus.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmployeeId("EMP-0001");
            admin.setRole(Role.ROLE_ADMIN);
            admin.setJoiningDate(LocalDate.now());
            admin.setIsActive(true);
            admin.setDesignation("HR Manager");
            admin.setDepartment(hrDept);

            userRepository.save(admin);
            System.out.println("Default Admin created: admin@hrnexus.com / admin123");
        }

        if (!userRepository.existsByEmail("employee@hrnexus.com")) {
            User employee = new User();
            employee.setFirstName("John");
            employee.setLastName("Doe");
            employee.setEmail("employee@hrnexus.com");
            employee.setPassword(passwordEncoder.encode("employee123"));
            employee.setEmployeeId("EMP-0002");
            employee.setRole(Role.ROLE_EMPLOYEE);
            employee.setJoiningDate(LocalDate.now());
            employee.setIsActive(true);
            employee.setDesignation("Software Engineer");
            employee.setDepartment(itDept);

            userRepository.save(employee);
            System.out.println("Default Employee created: employee@hrnexus.com / employee123");
        }
    }
}
