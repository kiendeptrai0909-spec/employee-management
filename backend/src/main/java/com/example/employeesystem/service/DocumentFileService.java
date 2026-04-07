package com.example.employeesystem.service;

import com.example.employeesystem.dto.be2.DocumentFileDTO;
import com.example.employeesystem.entity.DocumentFile;
import com.example.employeesystem.entity.User;
import com.example.employeesystem.exception.ResourceNotFoundException;
import com.example.employeesystem.repository.DepartmentRepository;
import com.example.employeesystem.repository.DocumentFileRepository;
import com.example.employeesystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DocumentFileService {

    private final DocumentFileRepository repository;
    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;

    public List<DocumentFileDTO> getAll() {
        return repository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public DocumentFileDTO create(DocumentFileDTO dto) {
        DocumentFile entity = new DocumentFile();
        entity.setTitle(dto.getTitle());
        entity.setDescription(dto.getDescription());
        entity.setCategory(dto.getCategory());
        entity.setFileUrl(dto.getFileUrl());
        entity.setRoleScope(dto.getRoleScope() != null ? dto.getRoleScope() : "ALL");

        User creator = userRepository.findById(dto.getCreatedBy())
            .orElseThrow(() -> new ResourceNotFoundException("User", dto.getCreatedBy()));
        entity.setCreatedBy(creator);
        
        if(dto.getDepartmentId() != null) entity.setDepartment(departmentRepository.findById(dto.getDepartmentId()).orElse(null));
        
        return toDTO(repository.save(entity));
    }

    private DocumentFileDTO toDTO(DocumentFile entity) {
        DocumentFileDTO dto = new DocumentFileDTO();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setDescription(entity.getDescription());
        dto.setCategory(entity.getCategory());
        dto.setFileUrl(entity.getFileUrl());
        dto.setRoleScope(entity.getRoleScope());
        if(entity.getDepartment() != null) dto.setDepartmentId(entity.getDepartment().getId());
        if(entity.getCreatedBy() != null) dto.setCreatedBy(entity.getCreatedBy().getId());
        return dto;
    }
}
