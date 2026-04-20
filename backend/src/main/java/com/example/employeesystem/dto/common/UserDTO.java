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
    private String roleName;
    private Long departmentId;
    private String departmentName;
    private Long positionId;
    private String positionName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
