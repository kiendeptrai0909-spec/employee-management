package com.example.employeesystem.service;

import com.example.employeesystem.dto.auth.LoginRequest;
import com.example.employeesystem.dto.auth.LoginResponse;
import com.example.employeesystem.entity.User;
import com.example.employeesystem.repository.UserRepository;
import com.example.employeesystem.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @Transactional
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new IllegalArgumentException("Username không tồn tại"));

        if (!passwordMatches(request.getPassword(), user)) {
            throw new IllegalArgumentException("Mật khẩu không chính xác");
        }

        if (!"ACTIVE".equals(user.getStatus())) {
            throw new IllegalArgumentException("Tài khoản đã bị khóa");
        }

        String token = jwtService.generateToken(user);

        return LoginResponse.builder()
                .token(token)
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

    /**
     * BCrypt for new passwords; legacy plain-text passwords are verified once then re-hashed.
     */
    private boolean passwordMatches(String rawPassword, User user) {
        String stored = user.getPassword();
        if (stored == null) {
            return false;
        }
        if (stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$")) {
            return passwordEncoder.matches(rawPassword, stored);
        }
        if (rawPassword.equals(stored)) {
            user.setPassword(passwordEncoder.encode(rawPassword));
            userRepository.save(user);
            return true;
        }
        return false;
    }
}
