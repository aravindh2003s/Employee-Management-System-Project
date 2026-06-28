package com.hrms.ems.controller;

import com.hrms.ems.model.Department;
import com.hrms.ems.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('EMPLOYEE')")
    public List<Department> getAllDepartments() {
        return departmentService.getAllDepartments();
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Department> createDepartment(@RequestBody @org.springframework.lang.NonNull Department department) {
        return ResponseEntity.ok(departmentService.createDepartment(department));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Department> updateDepartment(@PathVariable @org.springframework.lang.NonNull Long id, @RequestBody Department department) {
        return ResponseEntity.ok(departmentService.updateDepartment(id, department));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteDepartment(@PathVariable @org.springframework.lang.NonNull Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok().build();
    }
}
