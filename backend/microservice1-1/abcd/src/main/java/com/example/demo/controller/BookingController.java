package com.example.demo.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.demo.model.Bookings;
import com.example.demo.service.BookingService;

@RestController
@RequestMapping("/booking")
public class BookingController {
    
    @Autowired
    BookingService bookingService;
 // Test endpoint - no token required
    @GetMapping("/test")
    public Object testEndpoint() {
        return Map.of("code", 200, "message", "Booking endpoint is working!");
    }
    @PostMapping("/book")
    public Object bookResource(@RequestBody Bookings booking, 
                               @RequestHeader(value = "Token", required = false) String token) {
        if (token == null || token.isEmpty()) {
            return Map.of("code", 401, "message", "Token is required");
        }
        return bookingService.bookResource(booking, token);
    }
    
    @GetMapping("/mybookings")
    public Object getMyBookings(@RequestHeader(value = "Token", required = false) String token) {
        System.out.println("Received token in controller: " + token);
        if (token == null || token.isEmpty()) {
            return Map.of("code", 401, "message", "Token is required. Please login first.");
        }
        return bookingService.getMyBookings(token);
    }
    
    @GetMapping("/all")
    public Object getAllBookings(@RequestHeader(value = "Token", required = false) String token) {
        if (token == null || token.isEmpty()) {
            return Map.of("code", 401, "message", "Token is required");
        }
        return bookingService.getAllBookings(token);
    }
    
    @GetMapping("/getbyresource/{resourceId}")
    public Object getBookingsByResource(@PathVariable("resourceId") int resourceId, 
                                        @RequestHeader(value = "Token", required = false) String token) {
        if (token == null || token.isEmpty()) {
            return Map.of("code", 401, "message", "Token is required");
        }
        return bookingService.getBookingsByResource(resourceId, token);
    }
    
    @PutMapping("/cancel/{bookingId}")
    public Object cancelBooking(@PathVariable("bookingId") int bookingId, 
                                @RequestHeader(value = "Token", required = false) String token) {
        if (token == null || token.isEmpty()) {
            return Map.of("code", 401, "message", "Token is required");
        }
        return bookingService.cancelBooking(bookingId, token);
    }
    
    @GetMapping("/get/{bookingId}")
    public Object getBookingById(@PathVariable("bookingId") int bookingId, 
                                 @RequestHeader(value = "Token", required = false) String token) {
        if (token == null || token.isEmpty()) {
            return Map.of("code", 401, "message", "Token is required");
        }
        return bookingService.getBookingById(bookingId, token);
    }
    
    @PutMapping("/update/{bookingId}")
    public Object updateBookingStatus(@PathVariable("bookingId") int bookingId, 
                                      @RequestParam("status") int status, 
                                      @RequestHeader(value = "Token", required = false) String token) {
        if (token == null || token.isEmpty()) {
            return Map.of("code", 401, "message", "Token is required");
        }
        return bookingService.updateBookingStatus(bookingId, status, token);
    }
}