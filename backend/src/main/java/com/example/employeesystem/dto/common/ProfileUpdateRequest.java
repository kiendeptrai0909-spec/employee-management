package com.example.employeesystem.dto.common;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ProfileUpdateRequest {
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private LocalDate dateOfBirth;
    private String gender;
    private String avatar;
}
