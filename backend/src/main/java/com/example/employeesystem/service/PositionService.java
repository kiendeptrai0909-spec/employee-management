package com.example.employeesystem.service;

import com.example.employeesystem.dto.common.PositionDTO;
import com.example.employeesystem.entity.Position;
import com.example.employeesystem.exception.ResourceNotFoundException;
import com.example.employeesystem.repository.PositionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PositionService {

    private final PositionRepository positionRepository;

    public List<PositionDTO> getAllPositions() {
        return positionRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public PositionDTO getPositionById(Long id) {
        Position pos = positionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Position", id));
        return toDTO(pos);
    }

    @Transactional
    public PositionDTO createPosition(PositionDTO dto) {
        if (positionRepository.existsByName(dto.getName())) {
            throw new IllegalArgumentException("Tên chức vụ đã tồn tại: " + dto.getName());
        }
        Position pos = new Position();
        pos.setName(dto.getName());
        pos.setDescription(dto.getDescription());
        Position saved = positionRepository.save(pos);
        return toDTO(saved);
    }

    @Transactional
    public PositionDTO updatePosition(Long id, PositionDTO dto) {
        Position pos = positionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Position", id));
        if (dto.getName() != null && !dto.getName().equals(pos.getName())) {
            if (positionRepository.existsByName(dto.getName())) {
                throw new IllegalArgumentException("Tên chức vụ đã tồn tại: " + dto.getName());
            }
            pos.setName(dto.getName());
        }
        if (dto.getDescription() != null) pos.setDescription(dto.getDescription());
        Position saved = positionRepository.save(pos);
        return toDTO(saved);
    }

    @Transactional
    public void deletePosition(Long id) {
        if (!positionRepository.existsById(id)) {
            throw new ResourceNotFoundException("Position", id);
        }
        positionRepository.deleteById(id);
    }

    private PositionDTO toDTO(Position pos) {
        return PositionDTO.builder()
                .id(pos.getId())
                .name(pos.getName())
                .description(pos.getDescription())
                .build();
    }
}
