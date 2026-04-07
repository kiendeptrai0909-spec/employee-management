package com.example.employeesystem.dto.be2;

import lombok.Data;

@Data
public class DocumentFileDTO {
    private Long id;
    private String title;
    private String description;
    private String category;
    private String fileUrl;
    private String roleScope;
    private Long departmentId;
    private Long createdBy;
}
