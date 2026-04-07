package com.example.employeesystem.dto.common;

import lombok.Data;

import java.time.LocalDate;

@Data
public class UserUpdateRequest {
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private LocalDate dateOfBirth;
    private String gender;
    private String avatar;
    private String status;
    private Long roleId;
    private Long departmentId;
    private Long positionId;
}
