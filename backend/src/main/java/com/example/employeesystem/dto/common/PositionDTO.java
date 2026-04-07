package com.example.employeesystem.dto.common;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PositionDTO {
    private Long id;

    @NotBlank(message = "Tên chức vụ không được để trống")
    private String name;

    private String description;
}
