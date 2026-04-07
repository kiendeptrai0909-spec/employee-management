-- =============================================================
-- Employee Management System - Full schema + seed data
-- Stack target: ReactJS + Spring Boot + MySQL
-- Login strategy for current phase: simple username/password lookup
-- =============================================================

DROP DATABASE IF EXISTS employee_management;
CREATE DATABASE employee_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE employee_management;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS password_reset_tokens;
DROP TABLE IF EXISTS documents;
DROP TABLE IF EXISTS notifications;
DROP TABLE IF EXISTS payroll;
DROP TABLE IF EXISTS leave_requests;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS positions;
DROP TABLE IF EXISTS departments;
DROP TABLE IF EXISTS roles;

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================
-- 1. ROLES
-- =============================================================
CREATE TABLE roles (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =============================================================
-- 2. DEPARTMENTS
-- =============================================================
CREATE TABLE departments (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =============================================================
-- 3. POSITIONS
-- =============================================================
CREATE TABLE positions (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- =============================================================
-- 4. USERS
-- =============================================================
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE,
    phone VARCHAR(20),
    address VARCHAR(255),
    date_of_birth DATE,
    gender VARCHAR(20),
    avatar VARCHAR(255),
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    role_id BIGINT NOT NULL,
    department_id BIGINT NULL,
    position_id BIGINT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id),
    CONSTRAINT fk_users_department FOREIGN KEY (department_id) REFERENCES departments(id),
    CONSTRAINT fk_users_position FOREIGN KEY (position_id) REFERENCES positions(id),
    INDEX idx_users_role_id (role_id),
    INDEX idx_users_department_id (department_id),
    INDEX idx_users_position_id (position_id),
    INDEX idx_users_status (status)
) ENGINE=InnoDB;

-- =============================================================
-- 5. ATTENDANCE
-- =============================================================
CREATE TABLE attendance (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    work_date DATE NOT NULL,
    check_in TIME NULL,
    check_out TIME NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PRESENT',
    note VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_attendance_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT uq_attendance_user_date UNIQUE (user_id, work_date),
    INDEX idx_attendance_work_date (work_date),
    INDEX idx_attendance_status (status)
) ENGINE=InnoDB;

-- =============================================================
-- 6. LEAVE REQUESTS
-- =============================================================
CREATE TABLE leave_requests (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    leave_type VARCHAR(30) NOT NULL DEFAULT 'PAID',
    reason TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    approved_by BIGINT NULL,
    processed_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_leave_requests_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_leave_requests_approved_by FOREIGN KEY (approved_by) REFERENCES users(id),
    INDEX idx_leave_user_id (user_id),
    INDEX idx_leave_status (status),
    INDEX idx_leave_start_date (start_date),
    INDEX idx_leave_end_date (end_date)
) ENGINE=InnoDB;

-- =============================================================
-- 7. PAYROLL
-- =============================================================
CREATE TABLE payroll (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    month INT NOT NULL,
    year INT NOT NULL,
    basic_salary DECIMAL(15,2) NOT NULL DEFAULT 0,
    allowance DECIMAL(15,2) NOT NULL DEFAULT 0,
    bonus DECIMAL(15,2) NOT NULL DEFAULT 0,
    deduction DECIMAL(15,2) NOT NULL DEFAULT 0,
    net_salary DECIMAL(15,2) NOT NULL DEFAULT 0,
    note VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_payroll_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT uq_payroll_user_month_year UNIQUE (user_id, month, year),
    INDEX idx_payroll_month_year (month, year)
) ENGINE=InnoDB;

-- =============================================================
-- 8. NOTIFICATIONS
-- target_type:
--   ALL         -> gửi cho toàn hệ thống
--   ROLE        -> gửi cho 1 role cụ thể
--   DEPARTMENT  -> gửi cho 1 phòng ban
--   USER        -> gửi cho 1 user cụ thể
-- =============================================================
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(150) NOT NULL,
    content TEXT NOT NULL,
    target_type VARCHAR(30) NOT NULL DEFAULT 'ALL',
    role_id BIGINT NULL,
    department_id BIGINT NULL,
    user_id BIGINT NULL,
    created_by BIGINT NOT NULL,
    is_published TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_notifications_role FOREIGN KEY (role_id) REFERENCES roles(id),
    CONSTRAINT fk_notifications_department FOREIGN KEY (department_id) REFERENCES departments(id),
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_notifications_created_by FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_notifications_target_type (target_type),
    INDEX idx_notifications_created_at (created_at)
) ENGINE=InnoDB;

-- =============================================================
-- 9. DOCUMENTS
-- role_scope:
--   ALL, ADMIN, USER
-- =============================================================
CREATE TABLE documents (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(150) NOT NULL,
    description VARCHAR(255),
    category VARCHAR(100),
    file_url VARCHAR(255) NOT NULL,
    role_scope VARCHAR(30) NOT NULL DEFAULT 'ALL',
    department_id BIGINT NULL,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_documents_department FOREIGN KEY (department_id) REFERENCES departments(id),
    CONSTRAINT fk_documents_created_by FOREIGN KEY (created_by) REFERENCES users(id),
    INDEX idx_documents_role_scope (role_scope),
    INDEX idx_documents_category (category)
) ENGINE=InnoDB;

-- =============================================================
-- 10. PASSWORD RESET TOKENS
-- =============================================================
CREATE TABLE password_reset_tokens (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    token VARCHAR(255) NOT NULL UNIQUE,
    expired_at DATETIME NOT NULL,
    used_at DATETIME NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_password_reset_user FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_password_reset_expired_at (expired_at)
) ENGINE=InnoDB;

-- =============================================================
-- SEED DATA
-- =============================================================
INSERT INTO roles (name, description) VALUES
('ADMIN', 'Administrator / HR / Manager'),
('USER', 'Employee / Standard user');

INSERT INTO departments (name, description) VALUES
('Human Resources', 'HR and internal operations'),
('Information Technology', 'Software and system development'),
('Finance', 'Accounting, payroll and budget control'),
('Operations', 'Daily business operations');

INSERT INTO positions (name, description) VALUES
('Manager', 'Department or system manager'),
('Senior Developer', 'Experienced software engineer'),
('Developer', 'Software engineer'),
('HR Staff', 'Human resources staff'),
('Accountant', 'Finance and payroll staff'),
('Operations Staff', 'Operations support');

INSERT INTO users (
    username, password, full_name, email, phone, address, date_of_birth, gender, avatar, status,
    role_id, department_id, position_id
) VALUES
('admin',  '123456', 'Admin System',     'admin@company.com',  '0909000001', 'Ho Chi Minh City', '1994-01-10', 'Male',   NULL, 'ACTIVE', 1, 1, 1),
('hr01',   '123456', 'Tran Thi HR',      'hr01@company.com',   '0909000002', 'Ho Chi Minh City', '1997-03-15', 'Female', NULL, 'ACTIVE', 1, 1, 4),
('user01', '123456', 'Nguyen Van B',     'user01@company.com', '0909000003', 'Ho Chi Minh City', '1999-06-18', 'Male',   NULL, 'ACTIVE', 2, 2, 3),
('user02', '123456', 'Tran Thi C',       'user02@company.com', '0909000004', 'Ho Chi Minh City', '1998-09-21', 'Female', NULL, 'ACTIVE', 2, 1, 4),
('user03', '123456', 'Le Van D',         'user03@company.com', '0909000005', 'Ho Chi Minh City', '1996-11-02', 'Male',   NULL, 'ACTIVE', 2, 3, 5),
('user04', '123456', 'Pham Thi E',       'user04@company.com', '0909000006', 'Ho Chi Minh City', '2000-02-09', 'Female', NULL, 'ACTIVE', 2, 4, 6);

INSERT INTO attendance (user_id, work_date, check_in, check_out, status, note) VALUES
(3, '2026-04-01', '08:01:10', '17:28:35', 'PRESENT', 'On time'),
(3, '2026-04-02', '08:05:20', '17:20:10', 'PRESENT', 'Normal working day'),
(4, '2026-04-01', '08:10:05', '17:15:42', 'PRESENT', 'Arrived slightly late'),
(4, '2026-04-02', '08:00:40', '17:33:19', 'PRESENT', 'Normal working day'),
(5, '2026-04-01', '07:58:59', '17:12:55', 'PRESENT', 'On time'),
(6, '2026-04-01', '08:03:17', '17:18:07', 'PRESENT', 'Normal working day');

INSERT INTO leave_requests (user_id, start_date, end_date, leave_type, reason, status, approved_by, processed_at) VALUES
(3, '2026-04-10', '2026-04-11', 'PAID',   'Việc gia đình',               'PENDING',  NULL, NULL),
(4, '2026-04-15', '2026-04-15', 'SICK',   'Khám sức khỏe định kỳ',       'APPROVED', 1,    '2026-04-08 09:30:00'),
(5, '2026-04-18', '2026-04-19', 'UNPAID', 'Về quê giải quyết việc riêng', 'REJECTED', 1,    '2026-04-09 14:20:00');

INSERT INTO payroll (user_id, month, year, basic_salary, allowance, bonus, deduction, net_salary, note) VALUES
(3, 3, 2026, 12000000, 1000000, 500000, 200000, 13300000, 'March payroll'),
(4, 3, 2026, 10000000,  800000, 300000, 100000, 11000000, 'March payroll'),
(5, 3, 2026, 11000000,  900000, 200000, 150000, 11950000, 'March payroll'),
(6, 3, 2026,  9000000,  700000, 150000, 100000,  9750000, 'March payroll');

INSERT INTO notifications (title, content, target_type, role_id, department_id, user_id, created_by, is_published) VALUES
('Thông báo nghỉ lễ', 'Công ty nghỉ lễ từ ngày 30/04 đến 01/05 theo quy định.', 'ALL',        NULL, NULL, NULL, 1, 1),
('Họp nội bộ HR',    'Phòng HR họp lúc 09:00 sáng thứ Hai tại phòng họp số 2.', 'DEPARTMENT', NULL, 1,    NULL, 1, 1),
('Cập nhật bảng lương', 'Bảng lương tháng 03/2026 đã được cập nhật.',             'ROLE',       2,    NULL, NULL, 1, 1),
('Nhắc nộp báo cáo', 'Vui lòng nộp báo cáo tuần trước 17:00 hôm nay.',            'USER',       NULL, NULL, 3,    1, 1);

INSERT INTO documents (title, description, category, file_url, role_scope, department_id, created_by) VALUES
('Employee Handbook', 'Sổ tay nhân viên nội bộ', 'Policy', 'https://example.com/docs/employee-handbook.pdf', 'ALL',   NULL, 1),
('HR Leave Process',  'Quy trình xử lý đơn nghỉ phép', 'Process', 'https://example.com/docs/hr-leave-process.pdf', 'ADMIN', 1,    1),
('IT Onboarding',     'Tài liệu onboarding cho nhân viên IT', 'Guide', 'https://example.com/docs/it-onboarding.pdf', 'USER',  2,    1);

INSERT INTO password_reset_tokens (user_id, token, expired_at, used_at) VALUES
(3, 'reset-token-user01-demo', DATE_ADD(NOW(), INTERVAL 1 DAY), NULL);

-- =============================================================
-- OPTIONAL VIEWS FOR REPORTING / QUICK QUERIES
-- =============================================================
CREATE OR REPLACE VIEW v_user_profile AS
SELECT
    u.id,
    u.username,
    u.full_name,
    u.email,
    u.phone,
    u.status,
    r.name AS role_name,
    d.name AS department_name,
    p.name AS position_name
FROM users u
JOIN roles r ON u.role_id = r.id
LEFT JOIN departments d ON u.department_id = d.id
LEFT JOIN positions p ON u.position_id = p.id;

CREATE OR REPLACE VIEW v_pending_leave_requests AS
SELECT
    lr.id,
    u.full_name,
    d.name AS department_name,
    lr.start_date,
    lr.end_date,
    lr.leave_type,
    lr.reason,
    lr.status,
    lr.created_at
FROM leave_requests lr
JOIN users u ON lr.user_id = u.id
LEFT JOIN departments d ON u.department_id = d.id
WHERE lr.status = 'PENDING';

CREATE OR REPLACE VIEW v_monthly_attendance_summary AS
SELECT
    u.id AS user_id,
    u.full_name,
    DATE_FORMAT(a.work_date, '%Y-%m') AS work_month,
    COUNT(*) AS total_days,
    SUM(CASE WHEN a.status = 'PRESENT' THEN 1 ELSE 0 END) AS present_days,
    SUM(CASE WHEN a.status = 'ABSENT' THEN 1 ELSE 0 END) AS absent_days,
    MIN(a.check_in) AS earliest_check_in,
    MAX(a.check_out) AS latest_check_out
FROM attendance a
JOIN users u ON a.user_id = u.id
GROUP BY u.id, u.full_name, DATE_FORMAT(a.work_date, '%Y-%m');

-- =============================================================
-- QUICK TEST QUERIES
-- =============================================================
-- SELECT * FROM v_user_profile;
-- SELECT * FROM v_pending_leave_requests;
-- SELECT * FROM v_monthly_attendance_summary;
-- SELECT * FROM users WHERE username = 'admin' AND password = '123456';
-- SELECT * FROM attendance WHERE user_id = 3 ORDER BY work_date DESC;
-- SELECT * FROM payroll WHERE user_id = 3 ORDER BY year DESC, month DESC;
