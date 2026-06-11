package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.model.Resources;
import com.example.demo.model.Users;
import com.example.demo.repository.ResourceRepository;
import com.example.demo.repository.UserRepository;

@Service
public class ResourceService {
    
    @Autowired
    ResourceRepository resourceRepo;
    
    @Autowired
    UserRepository userRepo;
    
    @Autowired
    JWTService jwtService;
    
    // Add new resource (Admin only)
    public Object addResource(Resources resource, String token) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Map<String, String> jwt = jwtService.validateJWT(token);
            Users user = userRepo.findByFullname(jwt.get("username"));
            
            // Check if user is admin (role >= 2)
            if (user.getRole() < 2) {
                response.put("code", 403);
                response.put("message", "Admin access required");
                return response;
            }
            
            // Check if resource exists
            int exists = resourceRepo.checkResourceExists(resource.getResourceName());
            if (exists > 0) {
                response.put("code", 501);
                response.put("message", "Resource already exists");
                return response;
            }
            
            resource.setAvailableQuantity(resource.getTotalQuantity());
            resource.setCreatedAt(LocalDateTime.now());
            resource.setStatus(1);
            resourceRepo.save(resource);
            
            response.put("code", 200);
            response.put("message", "Resource added successfully");
            response.put("resourceId", resource.getResourceId());
            return response;
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
            return response;
        }
    }
    
    // Get all resources
    public Object getAllResources(String token) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            jwtService.validateJWT(token);
            List<Resources> resources = resourceRepo.findAll();
            
            response.put("code", 200);
            response.put("message", "Success");
            response.put("resources", resources);
            return response;
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
            return response;
        }
    }
    
    // Get available resources
    public Object getAvailableResources(String token) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            jwtService.validateJWT(token);
            List<Resources> resources = resourceRepo.findAvailableResources();
            
            response.put("code", 200);
            response.put("message", "Success");
            response.put("resources", resources);
            return response;
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
            return response;
        }
    }
    
    // Get resource by ID
    public Object getResourceById(int id, String token) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            jwtService.validateJWT(token);
            Resources resource = resourceRepo.findById(id).orElse(null);
            
            if (resource == null) {
                response.put("code", 404);
                response.put("message", "Resource not found");
                return response;
            }
            
            response.put("code", 200);
            response.put("message", "Success");
            response.put("resource", resource);
            return response;
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
            return response;
        }
    }
    
    // Update resource (Admin only)
    public Object updateResource(int id, Resources resource, String token) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Map<String, String> jwt = jwtService.validateJWT(token);
            Users user = userRepo.findByFullname(jwt.get("username"));
            
            System.out.println("=== UPDATE RESOURCE DEBUG ===");
            System.out.println("User: " + user.getFullname() + ", Role: " + user.getRole());
            
            if (user.getRole() < 2) {
                response.put("code", 403);
                response.put("message", "Admin access required");
                return response;
            }
            
            Resources existing = resourceRepo.findById(id).orElse(null);
            if (existing == null) {
                response.put("code", 404);
                response.put("message", "Resource not found");
                return response;
            }
            
            System.out.println("Existing resource: " + existing.getResourceName());
            System.out.println("Update data received: " + resource.getResourceName());
            
            // Update fields - ONLY if they are not null
            if (resource.getResourceName() != null && !resource.getResourceName().isEmpty()) {
                existing.setResourceName(resource.getResourceName());
            }
            if (resource.getResourceType() != null && !resource.getResourceType().isEmpty()) {
                existing.setResourceType(resource.getResourceType());
            }
            if (resource.getDescription() != null) {
                existing.setDescription(resource.getDescription());
            }
            if (resource.getTotalQuantity() > 0) {
                existing.setTotalQuantity(resource.getTotalQuantity());
            }
            if (resource.getAvailableQuantity() >= 0) {
                existing.setAvailableQuantity(resource.getAvailableQuantity());
            }
            
            existing.setUpdatedAt(LocalDateTime.now());
            resourceRepo.save(existing);
            
            response.put("code", 200);
            response.put("message", "Resource updated successfully");
            return response;
        } catch (Exception e) {
            e.printStackTrace();
            response.put("code", 500);
            response.put("message", e.getMessage());
            return response;
        }
    }
    // Delete resource (Admin only)
    public Object deleteResource(int id, String token) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Map<String, String> jwt = jwtService.validateJWT(token);
            Users user = userRepo.findByFullname(jwt.get("username"));
            
            // Check if user is admin (role >= 2)
            if (user.getRole() < 2) {
                response.put("code", 403);
                response.put("message", "Admin access required");
                return response;
            }
            
            Resources resource = resourceRepo.findById(id).orElse(null);
            if (resource == null) {
                response.put("code", 404);
                response.put("message", "Resource not found");
                return response;
            }
            
            resourceRepo.deleteById(id);
            
            response.put("code", 200);
            response.put("message", "Resource deleted successfully");
            return response;
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
            return response;
        }
    }
}