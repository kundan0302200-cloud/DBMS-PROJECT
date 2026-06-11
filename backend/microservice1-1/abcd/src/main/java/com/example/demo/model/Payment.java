package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int paymentId;
    
    @Column(nullable = false)
    private int bookingId;
    
    @Column(nullable = false)
    private int userId;
    
    @Column(nullable = false)
    private double amount;
    
    @Column(nullable = false, length = 20)
    private String paymentMethod; // e.g., "Credit Card", "Debit Card", "UPI", "Cash"
    
    @Column(nullable = false, length = 50)
    private String transactionId;
    
    @Column(nullable = false)
    private int paymentStatus = 1; // 1 = Pending, 2 = Success, 3 = Failed, 4 = Refunded
    
    private LocalDateTime paymentDate = LocalDateTime.now();
    
    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    // Getters and Setters
    public int getPaymentId() { return paymentId; }
    public void setPaymentId(int paymentId) { this.paymentId = paymentId; }
    
    public int getBookingId() { return bookingId; }
    public void setBookingId(int bookingId) { this.bookingId = bookingId; }
    
    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }
    
    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }
    
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
    
    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
    
    public int getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(int paymentStatus) { this.paymentStatus = paymentStatus; }
    
    public LocalDateTime getPaymentDate() { return paymentDate; }
    public void setPaymentDate(LocalDateTime paymentDate) { this.paymentDate = paymentDate; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}