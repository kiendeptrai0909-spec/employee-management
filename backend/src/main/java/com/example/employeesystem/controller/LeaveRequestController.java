package com.example.employeesystem.controller;

import com.example.employeesystem.dto.be2.LeaveRequestDTO;
import com.example.employeesystem.dto.common.ApiResponse;
import com.example.employeesystem.security.JwtPrincipal;
import com.example.employeesystem.service.LeaveRequestService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
@RequiredArgsConstructor
public class LeaveRequestController {

    private final LeaveRequestService leaveRequestService;

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<LeaveRequestDTO>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(leaveRequestService.getAll()));
    }

    @GetMapping("/user/{userId}")
    @PreAuthorize("hasRole('ADMIN') or @authz.isSelf(#userId)")
    public ResponseEntity<ApiResponse<List<LeaveRequestDTO>>> getByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.success(leaveRequestService.getByUserId(userId)));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<ApiResponse<LeaveRequestDTO>> create(
            @RequestBody LeaveRequestDTO dto,
            @AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.success("Tạo đơn xin nghỉ thành công", leaveRequestService.create(dto, principal)));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<LeaveRequestDTO>> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @AuthenticationPrincipal JwtPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.success("Cập nhật trạng thái thành công",
                leaveRequestService.approveOrReject(id, status, principal.userId())));
    }
}
