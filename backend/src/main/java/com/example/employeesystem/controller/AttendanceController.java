package com.example.employeesystem.controller;

import com.example.employeesystem.dto.be2.AttendanceDTO;
import com.example.employeesystem.dto.common.ApiResponse;
import com.example.employeesystem.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
public class AttendanceController {

    private final AttendanceService attendanceService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<AttendanceDTO>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getAll()));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<AttendanceDTO>>> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(attendanceService.getByUserId(userId)));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<AttendanceDTO>> create(@RequestBody AttendanceDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Chấm công thành công", attendanceService.create(dto)));
    }

    @PostMapping("/check-in/{userId}")
    public ResponseEntity<ApiResponse<AttendanceDTO>> checkIn(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success("Vào làm lúc " + java.time.LocalTime.now(), attendanceService.checkIn(userId)));
    }

    @PostMapping("/check-out/{userId}")
    public ResponseEntity<ApiResponse<AttendanceDTO>> checkOut(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success("Ra về lúc " + java.time.LocalTime.now(), attendanceService.checkOut(userId)));
    }
}
