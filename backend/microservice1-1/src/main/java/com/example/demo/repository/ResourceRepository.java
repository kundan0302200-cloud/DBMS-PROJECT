package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.example.demo.model.Resources;

@Repository
public interface ResourceRepository extends JpaRepository<Resources, Integer> {
    
    @Query("SELECT r FROM Resources r WHERE r.resourceType = :type AND r.status = 1")
    public List<Resources> findByResourceType(@Param("type") String resourceType);
    
    @Query("SELECT r FROM Resources r WHERE r.availableQuantity > 0 AND r.status = 1")
    public List<Resources> findAvailableResources();
    
    @Query("SELECT COUNT(r) FROM Resources r WHERE r.resourceName = :name")
    public int checkResourceExists(@Param("name") String resourceName);
    
    @Query("SELECT r.resourceId, r.resourceName, r.availableQuantity FROM Resources r WHERE r.status = 1")
    public List<Object> getResourceAvailability();
}