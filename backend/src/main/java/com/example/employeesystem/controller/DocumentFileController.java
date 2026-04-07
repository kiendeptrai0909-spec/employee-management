package com.example.employeesystem.controller;

import com.example.employeesystem.dto.be2.DocumentFileDTO;
import com.example.employeesystem.dto.common.ApiResponse;
import com.example.employeesystem.service.DocumentFileService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/documents")
@RequiredArgsConstructor
public class DocumentFileController {

    private final DocumentFileService documentFileService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DocumentFileDTO>>> getAll() {
        return ResponseEntity.ok(ApiResponse.success(documentFileService.getAll()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<DocumentFileDTO>> create(@RequestBody DocumentFileDTO dto) {
        return ResponseEntity.ok(ApiResponse.success("Tải liệu được tải lên thành công", documentFileService.create(dto)));
    }
}
