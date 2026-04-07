package com.example.employeesystem.controller;

import com.example.employeesystem.dto.common.ApiResponse;
import com.example.employeesystem.dto.common.ProfileUpdateRequest;
import com.example.employeesystem.dto.common.UserDTO;
import com.example.employeesystem.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile/{id}")
    public ResponseEntity<ApiResponse<UserDTO>> getProfile(@PathVariable Long id) {
        UserDTO dto = userService.getUserProfile(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PutMapping("/profile/{id}")
    public ResponseEntity<ApiResponse<UserDTO>> updateProfile(
            @PathVariable Long id,
            @RequestBody ProfileUpdateRequest request) {
        UserDTO dto = userService.updateProfile(id, request);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật profile thành công", dto));
    }
}
