package com.example.employeesystem.dto.auth;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private String token;
    private Long id;
    private String username;
    private String fullName;
    private String email;
    private String roleName;
    private Long roleId;
    private String departmentName;
    private Long departmentId;
    private String positionName;
    private Long positionId;
}
