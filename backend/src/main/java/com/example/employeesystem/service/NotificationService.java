package com.example.employeesystem.service;

import com.example.employeesystem.dto.be2.NotificationDTO;
import com.example.employeesystem.entity.Notification;
import com.example.employeesystem.entity.User;
import com.example.employeesystem.exception.ResourceNotFoundException;
import com.example.employeesystem.repository.DepartmentRepository;
import com.example.employeesystem.repository.NotificationRepository;
import com.example.employeesystem.repository.RoleRepository;
import com.example.employeesystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository repository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;

    public List<NotificationDTO> getAll() {
        return repository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public NotificationDTO create(NotificationDTO dto) {
        Notification entity = new Notification();
        entity.setTitle(dto.getTitle());
        entity.setContent(dto.getContent());
        entity.setTargetType(dto.getTargetType() != null ? dto.getTargetType() : "ALL");

        User creator = userRepository.findById(dto.getCreatedBy())
            .orElseThrow(() -> new ResourceNotFoundException("User", dto.getCreatedBy()));
        entity.setCreatedBy(creator);
        
        if (dto.getRoleId() != null) entity.setRole(roleRepository.findById(dto.getRoleId()).orElse(null));
        if (dto.getDepartmentId() != null) entity.setDepartment(departmentRepository.findById(dto.getDepartmentId()).orElse(null));
        if (dto.getUserId() != null) entity.setUser(userRepository.findById(dto.getUserId()).orElse(null));
        
        entity.setIsPublished(dto.getIsPublished() != null ? dto.getIsPublished() : true);
        return toDTO(repository.save(entity));
    }

    private NotificationDTO toDTO(Notification entity) {
        NotificationDTO dto = new NotificationDTO();
        dto.setId(entity.getId());
        dto.setTitle(entity.getTitle());
        dto.setContent(entity.getContent());
        dto.setTargetType(entity.getTargetType());
        if(entity.getRole() != null) dto.setRoleId(entity.getRole().getId());
        if(entity.getDepartment() != null) dto.setDepartmentId(entity.getDepartment().getId());
        if(entity.getUser() != null) dto.setUserId(entity.getUser().getId());
        if(entity.getCreatedBy() != null) dto.setCreatedBy(entity.getCreatedBy().getId());
        dto.setIsPublished(entity.getIsPublished());
        return dto;
    }
}
