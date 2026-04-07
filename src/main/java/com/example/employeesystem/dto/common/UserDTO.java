package com.example.employeesystem.dto.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String username;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private LocalDate dateOfBirth;
    private String gender;
    private String avatar;
    private String status;
    private Long roleId;
    private String roleName;
    private Long departmentId;
    private String departmentName;
    private Long positionId;
    private String positionName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
