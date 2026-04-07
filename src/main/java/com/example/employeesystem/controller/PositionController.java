package com.example.employeesystem.controller;

import com.example.employeesystem.dto.common.ApiResponse;
import com.example.employeesystem.dto.common.PositionDTO;
import com.example.employeesystem.service.PositionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/positions")
@RequiredArgsConstructor
public class PositionController {

    private final PositionService positionService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<PositionDTO>>> getAllPositions() {
        List<PositionDTO> list = positionService.getAllPositions();
        return ResponseEntity.ok(ApiResponse.success(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<PositionDTO>> getPositionById(@PathVariable Long id) {
        PositionDTO dto = positionService.getPositionById(id);
        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<PositionDTO>> createPosition(@Valid @RequestBody PositionDTO dto) {
        PositionDTO created = positionService.createPosition(dto);
        return ResponseEntity.ok(ApiResponse.success("Tạo chức vụ thành công", created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<PositionDTO>> updatePosition(
            @PathVariable Long id,
            @RequestBody PositionDTO dto) {
        PositionDTO updated = positionService.updatePosition(id, dto);
        return ResponseEntity.ok(ApiResponse.success("Cập nhật chức vụ thành công", updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePosition(@PathVariable Long id) {
        positionService.deletePosition(id);
        return ResponseEntity.ok(ApiResponse.success("Xóa chức vụ thành công", null));
    }
}
