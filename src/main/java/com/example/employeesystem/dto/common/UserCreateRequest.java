package com.example.employeesystem.dto.common;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class UserCreateRequest {

    @NotBlank(message = "Username không được để trống")
    private String username;

    @NotBlank(message = "Password không được để trống")
    private String password;

    @NotBlank(message = "Họ tên không được để trống")
    private String fullName;

    private String email;
    private String phone;
    private String address;
    private LocalDate dateOfBirth;
    private String gender;

    @NotNull(message = "Role không được để trống")
    private Long roleId;

    private Long departmentId;
    private Long positionId;
}
