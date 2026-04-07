package com.example.employeesystem.controller;

import com.example.employeesystem.dto.be2.PayrollDTO;
import com.example.employeesystem.dto.common.ApiResponse;
import com.example.employeesystem.service.PayrollService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payroll")
@RequiredArgsConstructor
public class PayrollController {

    private final PayrollService payrollService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PayrollDTO>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(payrollService.getAll()));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<PayrollDTO>>> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(payrollService.getByUserId(userId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PayrollDTO>> create(@RequestBody PayrollDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Tạo bảng lương thành công", payrollService.create(dto)));
    }
}
