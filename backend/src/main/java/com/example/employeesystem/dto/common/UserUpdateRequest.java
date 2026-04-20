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
    private String status;
    private Long roleId;
    private Long departmentId;
    private Long positionId;
}
