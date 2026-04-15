package com.example.employeesystem.security;

/**
 * Authenticated user identity from JWT (also used as {@code @AuthenticationPrincipal}).
 */
public record JwtPrincipal(Long userId, String username, String role) {}
