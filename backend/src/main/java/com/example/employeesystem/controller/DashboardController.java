package com.example.employeesystem.controller;

import com.example.employeesystem.dto.common.ApiResponse;
import com.example.employeesystem.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Long>>> getDashboardStats() {
        return ResponseEntity.ok(ApiResponse.success("Thống kê dashboard", dashboardService.getStats()));
    }
}
