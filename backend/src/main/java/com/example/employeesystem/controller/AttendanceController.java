package com.example.employeesystem.controller;

import com.example.employeesystem.dto.be2.AttendanceDTO;
import com.example.employeesystem.dto.common.ApiResponse;
import com.example.employeesystem.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.time.ZoneId;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;
    private static final ZoneId APP_ZONE = ZoneId.of("Asia/Ho_Chi_Minh");

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<AttendanceDTO>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getAll()));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @authz.isSelf(#userId)")
    public ResponseEntity<ApiResponse<List<AttendanceDTO>>> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getByUserId(userId)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AttendanceDTO>> create(@RequestBody AttendanceDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Chấm công thành công", attendanceService.create(dto)));
    }

    @PostMapping("/check-in/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @authz.isSelf(#userId)")
    public ResponseEntity<ApiResponse<AttendanceDTO>> checkIn(@PathVariable Long userId) {
        return ResponseEntity.ok(
            ApiResponse.success("Vào làm lúc " + LocalTime.now(APP_ZONE), attendanceService.checkIn(userId))
        );
    }

    @PostMapping("/check-out/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @authz.isSelf(#userId)")
    public ResponseEntity<ApiResponse<AttendanceDTO>> checkOut(@PathVariable Long userId) {
        return ResponseEntity.ok(
            ApiResponse.success("Ra về lúc " + LocalTime.now(APP_ZONE), attendanceService.checkOut(userId))
        );
    }
}
