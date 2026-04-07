package com.example.employeesystem.dto.be2;

import lombok.Data;

@Data
public class NotificationDTO {
    private Long id;
    private String title;
    private String content;
    private String targetType;
    private Long roleId;
    private Long departmentId;
    private Long userId;
    private Long createdBy;
    private Boolean isPublished;
}
