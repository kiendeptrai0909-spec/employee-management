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

    // --- Thông tin cá nhân bổ sung ---
    private String identityCard;
    private String temporaryAddress;
    private String personalEmail;

    // --- Thông tin công việc ---
    private String employeeCode;
    private LocalDate joinDate;
    private String contractType;
    private Long managerId;

    // --- Thông tin tài chính ---
    private java.math.BigDecimal basicSalary;
    private java.math.BigDecimal allowance;
    private String bankAccountNumber;
    private String bankName;
    private String taxId;
    private String insuranceNumber;

    // --- Chấm công & làm việc ---
    private String workSchedule;

    // --- Đánh giá & phát triển ---
    private String kpiScore;
    private String skills;
    private String educationLevel;

    // --- IT ---
    private String equipment;

    @NotNull(message = "Role không được để trống")
    private Long roleId;

    private Long departmentId;
    private Long positionId;
}
