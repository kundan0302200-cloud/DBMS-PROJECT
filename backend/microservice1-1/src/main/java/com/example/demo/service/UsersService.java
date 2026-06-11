package com.example.demo.service;

import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import com.example.demo.model.Users;
import com.example.demo.repository.UserRepository;

@Service
public class UsersService {
    
    @Autowired
    UserRepository repo;
    
    @Autowired
    JWTService jwtService;
    
    // Signup - Create new user
    public Object signupService(Users u1) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Check if email exists
            Object id = repo.checkEmail(u1.getEmail());
            if (id != null) {
                response.put("code", 501);
                response.put("message", "User already exists");
            } else {
                // Check if username exists
                Users existingUser = repo.findByFullname(u1.getFullname());
                if (existingUser != null) {
                    response.put("code", 501);
                    response.put("message", "Username already exists");
                } else {
                    u1.setRole(1);  // Default role: User
                    u1.setStatus(1);
                    repo.save(u1);
                    
                    response.put("code", 200);
                    response.put("message", "User Registered Successfully");
                }
            }
            return response;
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
            return response;
        }
    }
    
    // Signin
    public Object signinService(Map<String, String> u1) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            String username = u1.get("username") == null ? "" : u1.get("username").trim();
            String password = u1.get("password") == null ? "" : u1.get("password").trim();
            Users user = repo.findByLoginIdentifier(username, password);
            
            if (user == null) {
                response.put("code", 501);
                response.put("message", "Authentication Failed");
            } else {
                u1.put("username", user.getFullname());
                response.put("code", 200);
                response.put("jwt", jwtService.generateJwt(u1, String.valueOf(user.getRole())));
            }
            return response;
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
            return response;
        }
    }
    
    // Get user info from token
    public Object uinfo(String token) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Map<String, String> parsedJWT = jwtService.validateJWT(token);
            Users u1 = repo.findByFullname(parsedJWT.get("username"));
            
            response.put("code", 200);
            response.put("fullname", u1.getFullname());
            response.put("role", u1.getRole());
            return response;
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
            return response;
        }
    }
    
    // Get user profile
    public Object getProfile(String token) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Map<String, String> parsedJWT = jwtService.validateJWT(token);
            Users user = repo.findByFullname(parsedJWT.get("username"));
            
            if (user == null) {
                response.put("code", 404);
                response.put("message", "User not found");
                return response;
            }
            
            response.put("code", 200);
            response.put("data", user);
            return response;
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
            return response;
        }
    }
    
    // Get all users with pagination (Admin only)
    public Object getAllUsers(int page, int limit, String token) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validate admin access
            Map<String, String> jwt = jwtService.validateJWT(token);
            Users admin = repo.findByFullname(jwt.get("username"));
            if (admin.getRole() < 2) {
                response.put("code", 403);
                response.put("message", "Admin access required");
                return response;
            }
            
            Pageable pageable = PageRequest.of(page - 1, limit);
            Page<Users> users = repo.findAll(pageable);
            
            response.put("code", 200);
            response.put("page", page);
            response.put("size", limit);
            response.put("totalpages", users.getTotalPages());
            response.put("totalElements", users.getTotalElements());
            response.put("users", users.getContent());
            return response;
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
            return response;
        }
    }
    
    // Get user by ID (Admin only)
    public Object getUserById(int id, String token) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validate admin access
            Map<String, String> jwt = jwtService.validateJWT(token);
            Users admin = repo.findByFullname(jwt.get("username"));
            if (admin.getRole() < 2) {
                response.put("code", 403);
                response.put("message", "Admin access required");
                return response;
            }
            
            Users user = repo.findById(id).orElse(null);
            if (user == null) {
                response.put("code", 404);
                response.put("message", "User Not Found");
                return response;
            }
            
            response.put("code", 200);
            response.put("user", user);
            return response;
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
            return response;
        }
    }
    
    // Save new user (Admin only)
    public Object saveUser(Users u1, String token) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validate admin access
            Map<String, String> jwt = jwtService.validateJWT(token);
            Users admin = repo.findByFullname(jwt.get("username"));
            if (admin.getRole() < 2) {
                response.put("code", 403);
                response.put("message", "Admin access required");
                return response;
            }
            
            // Check if user already exists
            Users existing = repo.findByFullname(u1.getFullname());
            if (existing != null) {
                response.put("code", 501);
                response.put("message", "Username already exists");
                return response;
            }
            
            // Check if email exists
            Object emailExists = repo.checkEmail(u1.getEmail());
            if (emailExists != null) {
                response.put("code", 501);
                response.put("message", "Email already exists");
                return response;
            }
            
            u1.setStatus(1);
            if (u1.getRole() == 0) u1.setRole(1); // Default to User role
            repo.save(u1);
            
            response.put("code", 200);
            response.put("message", "User saved successfully");
            return response;
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
            return response;
        }
    }
    
    // Update user (Admin only)
    public Object updateUser(int id, Users u1, String token) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validate admin access
            Map<String, String> jwt = jwtService.validateJWT(token);
            Users admin = repo.findByFullname(jwt.get("username"));
            if (admin.getRole() < 2) {
                response.put("code", 403);
                response.put("message", "Admin access required");
                return response;
            }
            
            Users user = repo.findById(id).orElse(null);
            if (user == null) {
                response.put("code", 404);
                response.put("message", "User not found");
                return response;
            }
            
            // Update fields
            if (u1.getFullname() != null && !u1.getFullname().isEmpty())
                user.setFullname(u1.getFullname());
            if (u1.getPassword() != null && !u1.getPassword().isEmpty())
                user.setPassword(u1.getPassword());
            if (u1.getPhone() != null && !u1.getPhone().isEmpty())
                user.setPhone(u1.getPhone());
            if (u1.getEmail() != null && !u1.getEmail().isEmpty())
                user.setEmail(u1.getEmail());
            if (u1.getRole() != 0)
                user.setRole(u1.getRole());
            
            repo.save(user);
            
            response.put("code", 200);
            response.put("message", "User updated successfully");
            return response;
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
            return response;
        }
    }
    
    // Delete user (Admin only)
    public Object deleteUser(int id, String token) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Validate admin access
            Map<String, String> jwt = jwtService.validateJWT(token);
            Users admin = repo.findByFullname(jwt.get("username"));
            if (admin.getRole() < 2) {
                response.put("code", 403);
                response.put("message", "Admin access required");
                return response;
            }
            
            Users user = repo.findById(id).orElse(null);
            if (user == null) {
                response.put("code", 404);
                response.put("message", "User not found");
                return response;
            }
            
            // Prevent deleting yourself
            if (user.getId() == admin.getId()) {
                response.put("code", 400);
                response.put("message", "Cannot delete your own account");
                return response;
            }
            
            repo.deleteById(id);
            
            response.put("code", 200);
            response.put("message", "User deleted successfully");
            return response;
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
            return response;
        }
    }
}
