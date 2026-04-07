package com.example.employeesystem.service;

import com.example.employeesystem.dto.auth.LoginRequest;
import com.example.employeesystem.dto.auth.LoginResponse;
import com.example.employeesystem.entity.User;
import com.example.employeesystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Username không tồn tại"));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new IllegalArgumentException("Mật khẩu không chính xác");
        }

        if (!"ACTIVE".equals(user.getStatus())) {
            throw new IllegalArgumentException("Tài khoản đã bị khóa");
        }

        return LoginResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .roleName(user.getRole().getName())
                .roleId(user.getRole().getId())
                .departmentName(user.getDepartment() != null ? user.getDepartment().getName() : null)
                .departmentId(user.getDepartment() != null ? user.getDepartment().getId() : null)
                .positionName(user.getPosition() != null ? user.getPosition().getName() : null)
                .positionId(user.getPosition() != null ? user.getPosition().getId() : null)
                .build();
    }
}
