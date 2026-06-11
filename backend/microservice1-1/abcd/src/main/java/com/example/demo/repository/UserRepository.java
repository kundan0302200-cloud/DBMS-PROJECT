package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.example.demo.model.Users;

@Repository
public interface UserRepository extends JpaRepository<Users, Integer> {
    
    // Check user credentials for login using either fullname or email
	@Query("select U from Users U where (LOWER(U.fullname) = LOWER(:identifier) or LOWER(U.email) = LOWER(:identifier)) and U.password = :pwd")
	public Users findByLoginIdentifier(@Param("identifier") String identifier, @Param("pwd") String password);
    // Check if email already exists during signup
    @Query("SELECT U.id FROM Users U WHERE U.email = :email")
    public Object checkEmail(@Param("email") String email);
    
    // Find user by fullname (used in multiple services)
    public Users findByFullname(String fullname);
    
    // Get user profile details
    @Query("SELECT U FROM Users U WHERE U.fullname = :fullname")
    public Object getprofile(@Param("fullname") String fullname);
    
    // Optional: Check if user is admin (for authorization)
    @Query("SELECT CASE WHEN COUNT(U) > 0 THEN true ELSE false END FROM Users U WHERE U.id = :userId AND U.role = 2")
    public boolean isAdmin(@Param("userId") int userId);
    
    // Optional: Get user by ID with basic info
    @Query("SELECT U.id, U.fullname, U.email, U.phone, U.role FROM Users U WHERE U.id = :userId")
    public Object getUserBasicInfo(@Param("userId") int userId);
    
	@Query("select U from Users U where lower(U.fullname) like concat('%', lower(:key), '%') or lower(U.email) like concat('%', lower(:key), '%')")
	  public List<Object> searchUser(@Param("key") String key);
	
	@Query("select U from Users U where U.email = :email")
	public  Object findByEmail(@Param("email") String email);
}
