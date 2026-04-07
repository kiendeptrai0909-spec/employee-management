package com.example.employeesystem.service;

import com.example.employeesystem.dto.common.DepartmentDTO;
import com.example.employeesystem.entity.Department;
import com.example.employeesystem.exception.ResourceNotFoundException;
import com.example.employeesystem.repository.DepartmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DepartmentService {

    private final DepartmentRepository departmentRepository;

    public List<DepartmentDTO> getAllDepartments() {
        return departmentRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public DepartmentDTO getDepartmentById(Long id) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", id));
        return toDTO(dept);
    }

    @Transactional
    public DepartmentDTO createDepartment(DepartmentDTO dto) {
        if (departmentRepository.existsByName(dto.getName())) {
            throw new IllegalArgumentException("Tên phòng ban đã tồn tại: " + dto.getName());
        }
        Department dept = new Department();
        dept.setName(dto.getName());
        dept.setDescription(dto.getDescription());
        Department saved = departmentRepository.save(dept);
        return toDTO(saved);
    }

    @Transactional
    public DepartmentDTO updateDepartment(Long id, DepartmentDTO dto) {
        Department dept = departmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Department", id));
        if (dto.getName() != null && !dto.getName().equals(dept.getName())) {
            if (departmentRepository.existsByName(dto.getName())) {
                throw new IllegalArgumentException("Tên phòng ban đã tồn tại: " + dto.getName());
            }
            dept.setName(dto.getName());
        }
        if (dto.getDescription() != null) dept.setDescription(dto.getDescription());
        Department saved = departmentRepository.save(dept);
        return toDTO(saved);
    }

    @Transactional
    public void deleteDepartment(Long id) {
        if (!departmentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Department", id);
        }
        departmentRepository.deleteById(id);
    }

    private DepartmentDTO toDTO(Department dept) {
        return DepartmentDTO.builder()
                .id(dept.getId())
                .name(dept.getName())
                .description(dept.getDescription())
                .build();
    }
}
