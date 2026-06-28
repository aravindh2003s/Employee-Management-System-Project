package com.hrms.ems.service;

import com.hrms.ems.model.Department;
import com.hrms.ems.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }

    public Optional<Department> getDepartmentById(@org.springframework.lang.NonNull Long id) {
        return departmentRepository.findById(id);
    }

    public Department createDepartment(@org.springframework.lang.NonNull Department department) {
        return departmentRepository.save(department);
    }

    public Department updateDepartment(@org.springframework.lang.NonNull Long id, Department departmentDetails) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found"));
        
        department.setName(departmentDetails.getName());
        department.setDescription(departmentDetails.getDescription());
        
        return departmentRepository.save(department);
    }

    public void deleteDepartment(@org.springframework.lang.NonNull Long id) {
        departmentRepository.deleteById(id);
    }
}
