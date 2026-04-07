package com.example.employeesystem.service;

import com.example.employeesystem.dto.be2.AttendanceDTO;
import com.example.employeesystem.entity.Attendance;
import com.example.employeesystem.entity.User;
import com.example.employeesystem.exception.ResourceNotFoundException;
import com.example.employeesystem.repository.AttendanceRepository;
import com.example.employeesystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository repository;
    private final UserRepository userRepository;

    public List<AttendanceDTO> getAll() {
        return repository.findAll().stream().map(this::toDTO).collect(Collectors.toList());
    }

    public List<AttendanceDTO> getByUserId(Long userId) {
        return repository.findByUserId(userId).stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public AttendanceDTO checkIn(Long userId) {
        LocalDate today = LocalDate.now();
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", userId));
        
        List<Attendance> existing = repository.findByUserIdAndWorkDateBetween(userId, today, today);
        if(!existing.isEmpty()){
            throw new IllegalArgumentException("Đã chấm công vào cho hôm nay rồi.");
        }
        
        Attendance entity = new Attendance();
        entity.setUser(user);
        entity.setWorkDate(today);
        entity.setCheckIn(LocalTime.now());
        entity.setStatus("PRESENT");
        return toDTO(repository.save(entity));
    }

    @Transactional
    public AttendanceDTO checkOut(Long userId) {
        LocalDate today = LocalDate.now();
        List<Attendance> existing = repository.findByUserIdAndWorkDateBetween(userId, today, today);
        if(existing.isEmpty()){
            throw new IllegalArgumentException("Hôm nay chưa chấm công vào.");
        }
        Attendance entity = existing.get(0);
        if(entity.getCheckOut() != null){
             throw new IllegalArgumentException("Đã chấm công ra cho hôm nay rồi.");
        }
        entity.setCheckOut(LocalTime.now());
        return toDTO(repository.save(entity));
    }

    @Transactional
    public AttendanceDTO create(AttendanceDTO dto) {
        Attendance entity = new Attendance();
        User user = userRepository.findById(dto.getUserId())
            .orElseThrow(() -> new ResourceNotFoundException("User", dto.getUserId()));
        entity.setUser(user);
        entity.setWorkDate(dto.getWorkDate());
        entity.setCheckIn(dto.getCheckIn());
        entity.setCheckOut(dto.getCheckOut());
        entity.setStatus(dto.getStatus() != null ? dto.getStatus() : "PRESENT");
        entity.setNote(dto.getNote());
        return toDTO(repository.save(entity));
    }

    private AttendanceDTO toDTO(Attendance entity) {
        AttendanceDTO dto = new AttendanceDTO();
        dto.setId(entity.getId());
        dto.setUserId(entity.getUser().getId());
        dto.setWorkDate(entity.getWorkDate());
        dto.setCheckIn(entity.getCheckIn());
        dto.setCheckOut(entity.getCheckOut());
        dto.setStatus(entity.getStatus());
        dto.setNote(entity.getNote());
        return dto;
    }
}
