package com.example.employeesystem.service;

import com.example.employeesystem.dto.be2.PayrollDTO;
import com.example.employeesystem.entity.Payroll;
import com.example.employeesystem.entity.User;
import com.example.employeesystem.exception.ResourceNotFoundException;
import com.example.employeesystem.repository.PayrollRepository;
import com.example.employeesystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PayrollService {

    private final PayrollRepository repository;
    private final UserRepository userRepository;

    public List<PayrollDTO> getAll() {
        return repository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<PayrollDTO> getByUserId(Long userId) {
        return repository.findByUserId(userId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public PayrollDTO create(PayrollDTO dto) {
        Payroll entity = new Payroll();
        User user = userRepository.findById(dto.getUserId())
            .orElseThrow(() -> new ResourceNotFoundException("User", dto.getUserId()));
        entity.setUser(user);
        entity.setMonth(dto.getMonth());
        entity.setYear(dto.getYear());
        entity.setBasicSalary(dto.getBasicSalary() != null ? dto.getBasicSalary() : java.math.BigDecimal.ZERO);
        entity.setAllowance(dto.getAllowance() != null ? dto.getAllowance() : java.math.BigDecimal.ZERO);
        entity.setBonus(dto.getBonus() != null ? dto.getBonus() : java.math.BigDecimal.ZERO);
        entity.setDeduction(dto.getDeduction() != null ? dto.getDeduction() : java.math.BigDecimal.ZERO);
        
        // Calculate net salary
        java.math.BigDecimal net = entity.getBasicSalary()
                .add(entity.getAllowance())
                .add(entity.getBonus())
                .subtract(entity.getDeduction());
        entity.setNetSalary(net);
        
        entity.setNote(dto.getNote());
        return toDTO(repository.save(entity));
    }

    private PayrollDTO toDTO(Payroll entity) {
        PayrollDTO dto = new PayrollDTO();
        dto.setId(entity.getId());
        dto.setUserId(entity.getUser().getId());
        dto.setMonth(entity.getMonth());
        dto.setYear(entity.getYear());
        dto.setBasicSalary(entity.getBasicSalary());
        dto.setAllowance(entity.getAllowance());
        dto.setBonus(entity.getBonus());
        dto.setDeduction(entity.getDeduction());
        dto.setNetSalary(entity.getNetSalary());
        dto.setNote(entity.getNote());
        return dto;
    }
}
