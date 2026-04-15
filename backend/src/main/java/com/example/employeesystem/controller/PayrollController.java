package com.example.employeesystem.controller;

import com.example.employeesystem.dto.be2.PayrollDTO;
import com.example.employeesystem.dto.common.ApiResponse;
import com.example.employeesystem.service.PayrollService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payroll")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService payrollService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<PayrollDTO>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(payrollService.getAll()));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @authz.isSelf(#userId)")
    public ResponseEntity<ApiResponse<List<PayrollDTO>>> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(payrollService.getByUserId(userId)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PayrollDTO>> create(@RequestBody PayrollDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Tạo bảng lương thành công", payrollService.create(dto)));
    }
}
