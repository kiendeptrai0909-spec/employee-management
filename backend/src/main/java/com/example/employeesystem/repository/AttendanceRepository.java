package com.example.employeesystem.repository;

import com.example.employeesystem.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByUserId(Long userId);
    List<Attendance> findByWorkDate(LocalDate workDate);
    List<Attendance> findByUserIdAndWorkDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
}
