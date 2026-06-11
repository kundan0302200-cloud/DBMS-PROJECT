package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resource_types")
public class ResourceType {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int typeId;
    
    @Column(nullable = false, unique = true, length = 100)
    private String typeName; // e.g., "Conference Room", "Equipment", "Vehicle"
    
    @Column(length = 255)
    private String description;
    
    @Column(nullable = false)
    private int status = 1;
    
    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
    
    // Getters and Setters
    public int getTypeId() { return typeId; }
    public void setTypeId(int typeId) { this.typeId = typeId; }
    
    public String getTypeName() { return typeName; }
    public void setTypeName(String typeName) { this.typeName = typeName; }
    
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    
    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}