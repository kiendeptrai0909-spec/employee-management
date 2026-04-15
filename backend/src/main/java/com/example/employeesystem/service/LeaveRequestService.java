package com.example.employeesystem.service;

import com.example.employeesystem.dto.be2.LeaveRequestDTO;
import com.example.employeesystem.entity.LeaveRequest;
import com.example.employeesystem.entity.User;
import com.example.employeesystem.exception.ResourceNotFoundException;
import com.example.employeesystem.repository.LeaveRequestRepository;
import com.example.employeesystem.repository.UserRepository;
import com.example.employeesystem.security.JwtPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LeaveRequestService {

    private final LeaveRequestRepository repository;
    private final UserRepository userRepository;

    public List<LeaveRequestDTO> getAll() {
        return repository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<LeaveRequestDTO> getByUserId(Long userId) {
        return repository.findByUserId(userId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public LeaveRequestDTO create(LeaveRequestDTO dto, JwtPrincipal principal) {
        Long targetUserId;
        if ("ADMIN".equals(principal.role())) {
            targetUserId = dto.getUserId() != null ? dto.getUserId() : principal.userId();
        } else {
            targetUserId = principal.userId();
        }

        LeaveRequest entity = new LeaveRequest();
        User user = userRepository.findById(targetUserId)
            .orElseThrow(() -> new ResourceNotFoundException("User", targetUserId));
        entity.setUser(user);
        entity.setStartDate(dto.getStartDate());
        entity.setEndDate(dto.getEndDate());
        entity.setLeaveType(dto.getLeaveType() != null ? dto.getLeaveType() : "PAID");
        entity.setReason(dto.getReason());
        entity.setStatus("PENDING");
        return toDTO(repository.save(entity));
    }

    @Transactional
    public LeaveRequestDTO approveOrReject(Long id, String status, Long approverId) {
        LeaveRequest entity = repository.findById(id).orElseThrow(() -> new ResourceNotFoundException("LeaveRequest", id));
        entity.setStatus(status);
        entity.setProcessedAt(LocalDateTime.now());
        User approver = userRepository.findById(approverId).orElse(null);
        entity.setApprovedBy(approver);
        return toDTO(repository.save(entity));
    }

    private LeaveRequestDTO toDTO(LeaveRequest entity) {
        LeaveRequestDTO dto = new LeaveRequestDTO();
        dto.setId(entity.getId());
        dto.setUserId(entity.getUser().getId());
        dto.setStartDate(entity.getStartDate());
        dto.setEndDate(entity.getEndDate());
        dto.setLeaveType(entity.getLeaveType());
        dto.setReason(entity.getReason());
        dto.setStatus(entity.getStatus());
        if(entity.getApprovedBy() != null) dto.setApprovedBy(entity.getApprovedBy().getId());
        dto.setProcessedAt(entity.getProcessedAt());
        return dto;
    }
}
