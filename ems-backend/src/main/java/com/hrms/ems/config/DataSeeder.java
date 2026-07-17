package com.hrms.ems.config;

import com.hrms.ems.model.Role;
import com.hrms.ems.model.User;
import com.hrms.ems.repository.UserRepository;
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
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByEmail("aravindh2003s@gmail.com")) {
            User admin = new User();
            admin.setFirstName("Aravindhan");
            admin.setLastName("S");
            admin.setEmail("aravindh2003s@gmail.com");
            admin.setPassword(passwordEncoder.encode("Aravind@#123"));
            admin.setEmployeeId("EMP-HR-001");
            admin.setRole(Role.ROLE_ADMIN);
            admin.setDesignation("HR Manager"); // Fallback if length issue, wait, max length? usually 255
            admin.setJoiningDate(LocalDate.now());

            userRepository.save(admin);
            System.out.println("HR Admin account seeded successfully!");
        }
    }
}
