package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.model.Bookings;
import com.example.demo.model.Resources;
import com.example.demo.model.Users;
import com.example.demo.repository.BookingRepository;
import com.example.demo.repository.ResourceRepository;
import com.example.demo.repository.UserRepository;

@Service
public class BookingService {
    
    @Autowired
    BookingRepository bookingRepo;
    
    @Autowired
    ResourceRepository resourceRepo;
    
    @Autowired
    UserRepository userRepo;
    
    @Autowired
    JWTService jwtService;
    
    // Book a resource
    public Object bookResource(Bookings booking, String token) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Map<String, String> jwt = jwtService.validateJWT(token);
            Users user = userRepo.findByFullname(jwt.get("username"));
            
            // Check resource availability
            Resources resource = resourceRepo.findById(booking.getResourceId()).orElse(null);
            if (resource == null) {
                response.put("code", 404);
                response.put("message", "Resource not found");
                return response;
            }
            
            if (resource.getAvailableQuantity() < booking.getQuantity()) {
                response.put("code", 501);
                response.put("message", "Resource not available in requested quantity");
                return response;
            }
            
            // Check time conflict
            List<Bookings> conflicts = bookingRepo.checkConflict(
                booking.getResourceId(),
                booking.getStartTime(),
                booking.getEndTime()
            );
            
            if (!conflicts.isEmpty()) {
                response.put("code", 502);
                response.put("message", "Time slot already booked");
                return response;
            }
            
            // Create booking
            booking.setUserId(user.getId());
            booking.setBookingDate(LocalDateTime.now());
            booking.setCreatedAt(LocalDateTime.now());
            booking.setStatus(1);
            bookingRepo.save(booking);
            
            // Update available quantity
            resource.setAvailableQuantity(resource.getAvailableQuantity() - booking.getQuantity());
            resourceRepo.save(resource);
            
            response.put("code", 200);
            response.put("message", "Resource booked successfully");
            response.put("bookingId", booking.getBookingId());
            return response;
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
            return response;
        }
    }
    
    // Get current user's bookings
 // Get current user's bookings
    public Object getMyBookings(String token) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (token == null || token.isEmpty()) {
                response.put("code", 401);
                response.put("message", "Token is required. Please login first.");
                return response;
            }
            
            Map<String, String> jwt = jwtService.validateJWT(token);
            Users user = userRepo.findByFullname(jwt.get("username"));
            
            if (user == null) {
                response.put("code", 401);
                response.put("message", "Invalid token. User not found.");
                return response;
            }
            
            List<Bookings> bookings = bookingRepo.findBookingsByUser(user.getId());
            
            response.put("code", 200);
            response.put("message", "Success");
            response.put("bookings", bookings);
            return response;
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
            return response;
        }
    }
    
    // Get all bookings (Admin only)
    public Object getAllBookings(String token) {
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
            
            List<Bookings> bookings = bookingRepo.findAll();
            
            response.put("code", 200);
            response.put("message", "Success");
            response.put("bookings", bookings);
            return response;
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
            return response;
        }
    }
    
    // Get bookings by resource (Admin only)
    public Object getBookingsByResource(int resourceId, String token) {
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
            
            List<Bookings> bookings = bookingRepo.findActiveBookingsByResource(resourceId);
            
            response.put("code", 200);
            response.put("message", "Success");
            response.put("bookings", bookings);
            return response;
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
            return response;
        }
    }
    
    // Get booking by ID - FIXED: Added this method
    public Object getBookingById(int bookingId, String token) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            jwtService.validateJWT(token);
            Bookings booking = bookingRepo.findById(bookingId).orElse(null);
            
            if (booking == null) {
                response.put("code", 404);
                response.put("message", "Booking not found");
                return response;
            }
            
            response.put("code", 200);
            response.put("message", "Success");
            response.put("booking", booking);
            return response;
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
            return response;
        }
    }
    
    // Cancel a booking
    public Object cancelBooking(int bookingId, String token) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            Map<String, String> jwt = jwtService.validateJWT(token);
            Users user = userRepo.findByFullname(jwt.get("username"));
            
            Bookings booking = bookingRepo.findById(bookingId).orElse(null);
            if (booking == null) {
                response.put("code", 404);
                response.put("message", "Booking not found");
                return response;
            }
            
            // Check if user owns the booking or is admin
            if (booking.getUserId() != user.getId() && user.getRole() < 2) {
                response.put("code", 403);
                response.put("message", "You can only cancel your own bookings");
                return response;
            }
            
            // Check if booking is already cancelled or completed
            if (booking.getStatus() != 1) {
                response.put("code", 400);
                response.put("message", "Only confirmed bookings can be cancelled");
                return response;
            }
            
            // Return resources
            Resources resource = resourceRepo.findById(booking.getResourceId()).orElse(null);
            if (resource != null) {
                resource.setAvailableQuantity(resource.getAvailableQuantity() + booking.getQuantity());
                resourceRepo.save(resource);
            }
            
            booking.setStatus(2); // Cancelled
            booking.setUpdatedAt(LocalDateTime.now());
            bookingRepo.save(booking);
            
            response.put("code", 200);
            response.put("message", "Booking cancelled successfully");
            return response;
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
            return response;
        }
    }
    
    // Update booking status (Admin only)
    public Object updateBookingStatus(int bookingId, int status, String token) {
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
            
            Bookings booking = bookingRepo.findById(bookingId).orElse(null);
            if (booking == null) {
                response.put("code", 404);
                response.put("message", "Booking not found");
                return response;
            }
            
            int oldStatus = booking.getStatus();
            booking.setStatus(status);
            booking.setUpdatedAt(LocalDateTime.now());
            bookingRepo.save(booking);
            
            // If cancelling, return resources to inventory
            if (status == 2 && oldStatus == 1) {
                Resources resource = resourceRepo.findById(booking.getResourceId()).orElse(null);
                if (resource != null) {
                    resource.setAvailableQuantity(resource.getAvailableQuantity() + booking.getQuantity());
                    resourceRepo.save(resource);
                }
            }
            
            response.put("code", 200);
            response.put("message", "Booking status updated successfully");
            return response;
        } catch (Exception e) {
            response.put("code", 500);
            response.put("message", e.getMessage());
            return response;
        }
    }
}