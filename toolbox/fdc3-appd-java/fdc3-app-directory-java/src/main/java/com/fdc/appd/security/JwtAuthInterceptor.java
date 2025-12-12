package com.fdc.appd.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;

@Component
public class JwtAuthInterceptor implements HandlerInterceptor {

    @Autowired
    private UserManagementService userManagementService;
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String authHeader = request.getHeader("Authorization");

        // Check if the Authorization header is present and starts with "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Missing or invalid Authorization header");
            return false;
        }

        // Extract the token from the header
        String token = authHeader.substring(7);
        var claims = JwtUtil.validateToken(token);

        if (claims.isEmpty()) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Invalid or expired JWT token");
            return false;
        }

        // Optionally, you can extract user information from the token and set it in the request context
        request.setAttribute("userId", claims.get().getSubject());

        return true;
    }
}

