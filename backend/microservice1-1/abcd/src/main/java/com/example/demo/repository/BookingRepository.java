package com.example.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import com.example.demo.model.Bookings;

@Repository
public interface BookingRepository extends JpaRepository<Bookings, Integer> {
    
    @Query("SELECT b FROM Bookings b WHERE b.userId = :userId ORDER BY b.bookingDate DESC")
    public List<Bookings> findBookingsByUser(@Param("userId") int userId);
    
    @Query("SELECT b FROM Bookings b WHERE b.resourceId = :resourceId AND b.status = 1")
    public List<Bookings> findActiveBookingsByResource(@Param("resourceId") int resourceId);
    
    @Query("SELECT b FROM Bookings b WHERE b.startTime BETWEEN :start AND :end AND b.resourceId = :resourceId AND b.status = 1")
    public List<Bookings> checkConflict(@Param("resourceId") int resourceId, 
                                        @Param("start") LocalDateTime start, 
                                        @Param("end") LocalDateTime end);
    
    @Query("SELECT COUNT(b) FROM Bookings b WHERE b.userId = :userId AND b.status = 1")
    public int countActiveBookingsByUser(@Param("userId") int userId);
}