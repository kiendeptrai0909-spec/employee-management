package com.example.employeesystem.repository;

import com.example.employeesystem.entity.Payroll;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PayrollRepository extends JpaRepository<Payroll, Long> {
    List<Payroll> findByUserId(Long userId);
    List<Payroll> findByMonthAndYear(Integer month, Integer year);
    List<Payroll> findByUserIdAndMonthAndYear(Long userId, Integer month, Integer year);
}
