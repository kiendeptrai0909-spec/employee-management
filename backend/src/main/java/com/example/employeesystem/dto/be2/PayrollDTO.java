package com.example.employeesystem.dto.be2;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class PayrollDTO {
    private Long id;
    private Long userId;
    private Integer month;
    private Integer year;
    private BigDecimal basicSalary;
    private BigDecimal allowance;
    private BigDecimal bonus;
    private BigDecimal deduction;
    private BigDecimal netSalary;
    private String note;
}
