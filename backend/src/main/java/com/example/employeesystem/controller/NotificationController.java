package com.example.employeesystem.controller;

import com.example.employeesystem.dto.be2.NotificationDTO;
import com.example.employeesystem.dto.common.ApiResponse;
import com.example.employeesystem.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<NotificationDTO>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(notificationService.getAll()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<NotificationDTO>> create(@RequestBody NotificationDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Tạo thông báo thành công", notificationService.create(dto)));
    }
}
