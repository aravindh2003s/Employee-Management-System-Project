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
import java.util.HashMap;
import java.util.Map;


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
        
        // 1. Ensure all departments exist
        String[] deptNames = {"IT", "HR", "Finance", "Sales", "Marketing", "Customer Support", "Operations"};
        Map<String, Department> deptMap = new HashMap<>();
        for (String name : deptNames) {
            Department dept = departmentRepository.findByName(name).orElse(null);
            if (dept == null) {
                dept = new Department();
                dept.setName(name);
                dept.setDescription(name + " Department");
                dept = departmentRepository.save(dept);
            }
            deptMap.put(name, dept);
        }

        // 2. Sample Data
        String[][] empData = {
            {"EMP001", "Rahul", "Sharma", "Male", "rahul.sharma@example.com", "9876543210", "IT", "Software Engineer", "65000", "2022-03-15", "EMP010", "Active"},
            {"EMP002", "Priya", "Patel", "Female", "priya.patel@example.com", "9876543211", "HR", "HR Executive", "45000", "2021-06-10", "EMP011", "Active"},
            {"EMP003", "Amit", "Verma", "Male", "amit.verma@example.com", "9876543212", "Finance", "Accountant", "55000", "2020-01-20", "EMP012", "Active"},
            {"EMP004", "Sneha", "Iyer", "Female", "sneha.iyer@example.com", "9876543213", "Sales", "Sales Executive", "50000", "2023-04-01", "EMP013", "Active"},
            {"EMP005", "Arjun", "Nair", "Male", "arjun.nair@example.com", "9876543214", "Marketing", "Marketing Specialist", "58000", "2021-08-18", "EMP014", "Active"},
            {"EMP006", "Neha", "Gupta", "Female", "neha.gupta@example.com", "9876543215", "IT", "QA Engineer", "60000", "2022-09-12", "EMP010", "Active"},
            {"EMP007", "Vikram", "Singh", "Male", "vikram.singh@example.com", "9876543216", "IT", "DevOps Engineer", "72000", "2019-11-25", "EMP010", "Active"},
            {"EMP008", "Anjali", "Mehta", "Female", "anjali.mehta@example.com", "9876543217", "Customer Support", "Support Executive", "40000", "2023-01-05", "EMP015", "Active"},
            {"EMP009", "Karan", "Joshi", "Male", "karan.joshi@example.com", "9876543218", "Operations", "Operations Executive", "52000", "2020-12-14", "EMP016", "On Leave"},
            {"EMP010", "Rakesh", "Kapoor", "Male", "rakesh.kapoor@example.com", "9876543219", "IT", "IT Manager", "120000", "2018-05-10", "NULL", "Active"},
            {"EMP011", "Pooja", "Rao", "Female", "pooja.rao@example.com", "9876543220", "HR", "HR Manager", "95000", "2017-07-22", "NULL", "Active"},
            {"EMP012", "Suresh", "Menon", "Male", "suresh.menon@example.com", "9876543221", "Finance", "Finance Manager", "110000", "2016-02-14", "NULL", "Active"},
            {"EMP013", "Deepak", "Agarwal", "Male", "deepak.agarwal@example.com", "9876543222", "Sales", "Sales Manager", "100000", "2018-10-30", "NULL", "Active"},
            {"EMP014", "Kavita", "Desai", "Female", "kavita.desai@example.com", "9876543223", "Marketing", "Marketing Manager", "105000", "2019-06-08", "NULL", "Active"},
            {"EMP015", "Rohit", "Kulkarni", "Male", "rohit.kulkarni@example.com", "9876543224", "Customer Support", "Support Manager", "85000", "2020-04-17", "NULL", "Active"},
            {"EMP016", "Meera", "Thomas", "Female", "meera.thomas@example.com", "9876543225", "Operations", "Operations Manager", "98000", "2017-09-19", "NULL", "Active"},
            {"EMP017", "Aditya", "Mishra", "Male", "aditya.mishra@example.com", "9876543226", "IT", "Intern", "25000", "2024-01-15", "EMP010", "Active"},
            {"EMP018", "Riya", "Chawla", "Female", "riya.chawla@example.com", "9876543227", "HR", "Recruiter", "42000", "2023-07-20", "EMP011", "Active"},
            {"EMP019", "Mohit", "Bansal", "Male", "mohit.bansal@example.com", "9876543228", "Finance", "Financial Analyst", "68000", "2022-02-11", "EMP012", "Resigned"},
            {"EMP020", "Divya", "Reddy", "Female", "divya.reddy@example.com", "9876543229", "Sales", "Business Development Executive", "54000", "2024-03-01", "EMP013", "Active"}
        };

        // 3. Insert employees without setting managers yet
        for (String[] data : empData) {
            String email = data[4];
            if (!userRepository.existsByEmail(email)) {
                User user = new User();
                user.setEmployeeId(data[0]);
                user.setFirstName(data[1]);
                user.setLastName(data[2]);
                user.setGender(data[3]);
                user.setEmail(email);
                // Default password for seeded users
                user.setPassword(passwordEncoder.encode("password123"));
                user.setPhoneNumber(data[5]);
                user.setDepartment(deptMap.get(data[6]));
                user.setDesignation(data[7]);
                user.setSalary(Double.parseDouble(data[8]));
                user.setJoiningDate(LocalDate.parse(data[9]));
                user.setIsActive(!data[11].equalsIgnoreCase("Resigned"));
                
                // Set role (Manager -> ROLE_ADMIN, else ROLE_EMPLOYEE)
                if (data[7].contains("Manager")) {
                    user.setRole(Role.ROLE_ADMIN);
                } else {
                    user.setRole(Role.ROLE_EMPLOYEE);
                }

                userRepository.save(user);
            }
        }

        // 4. Update managers and map relationships
        Map<String, User> empIdToUserMap = new HashMap<>();
        userRepository.findAll().forEach(u -> {
            if(u.getEmployeeId() != null) {
                empIdToUserMap.put(u.getEmployeeId(), u);
            }
        });

        for (String[] data : empData) {
            String empId = data[0];
            String mgrId = data[10];
            
            if (!mgrId.equals("NULL")) {
                User user = empIdToUserMap.get(empId);
                User manager = empIdToUserMap.get(mgrId);
                
                if (user != null && manager != null && user.getManager() == null) {
                    user.setManager(manager);
                    userRepository.save(user);
                }
            }
        }

        // 5. Ensure root Admin exists
        if (!userRepository.existsByEmail("admin@hrnexus.com")) {
            User admin = new User();
            admin.setFirstName("Admin");
            admin.setLastName("User");
            admin.setEmail("admin@hrnexus.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmployeeId("EMP-0000");
            admin.setRole(Role.ROLE_ADMIN);
            admin.setJoiningDate(LocalDate.now());
            admin.setIsActive(true);
            admin.setDesignation("System Administrator");
            admin.setDepartment(deptMap.get("IT"));
            userRepository.save(admin);
            System.out.println("Default Admin created: admin@hrnexus.com / admin123");
        }
        
        System.out.println("All 20 test employees have been successfully seeded!");
    }
}
