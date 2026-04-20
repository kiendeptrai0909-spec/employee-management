package com.example.employeesystem.service;

import com.example.employeesystem.repository.AttendanceRepository;
import com.example.employeesystem.repository.DepartmentRepository;
import com.example.employeesystem.repository.LeaveRequestRepository;
import com.example.employeesystem.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final DepartmentRepository departmentRepository;
    private final AttendanceRepository attendanceRepository;
    private final LeaveRequestRepository leaveRequestRepository;

    public Map<String, Long> getStats() {
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalDepartments", departmentRepository.count());
        stats.put("totalAttendances", attendanceRepository.count());
        stats.put("totalLeaveRequests", leaveRequestRepository.count());
        return stats;
    }
}
