package com.example.employeesystem.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "users")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username;

    @Column(nullable = false, length = 100)
    private String password;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(unique = true, length = 100)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(length = 255)
    private String address;

    @Column(name = "date_of_birth")
    private LocalDate dateOfBirth;

    @Column(length = 20)
    private String gender;

    @Column(length = 255)
    private String avatar;

    // --- Thông tin cá nhân bổ sung ---
    @Column(name = "identity_card", length = 20)
    private String identityCard;

    @Column(name = "temporary_address", length = 255)
    private String temporaryAddress;

    @Column(name = "personal_email", length = 100)
    private String personalEmail;

    // --- Thông tin công việc ---
    @Column(name = "employee_code", unique = true, length = 50)
    private String employeeCode;

    @Column(name = "join_date")
    private LocalDate joinDate;

    @Column(name = "contract_type", length = 50)
    private String contractType;

    @Column(name = "manager_id")
    private Long managerId;

    // --- Thông tin tài chính ---
    @Column(name = "basic_salary")
    private java.math.BigDecimal basicSalary;

    @Column(name = "allowance")
    private java.math.BigDecimal allowance;

    @Column(name = "bank_account_number", length = 50)
    private String bankAccountNumber;

    @Column(name = "bank_name", length = 100)
    private String bankName;

    @Column(name = "tax_id", length = 50)
    private String taxId;

    @Column(name = "insurance_number", length = 50)
    private String insuranceNumber;

    // --- Chấm công & làm việc ---
    @Column(name = "work_schedule", length = 100)
    private String workSchedule;

    // --- Đánh giá & phát triển ---
    @Column(name = "kpi_score", length = 100)
    private String kpiScore;

    @Column(length = 500)
    private String skills;

    @Column(name = "education_level", length = 100)
    private String educationLevel;

    // --- IT ---
    @Column(length = 500)
    private String equipment;

    @Column(nullable = false, length = 30)
    private String status = "ACTIVE";

    @ManyToOne
    @JoinColumn(name = "role_id", nullable = false)
    private Role role;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne
    @JoinColumn(name = "position_id")
    private Position position;
}
