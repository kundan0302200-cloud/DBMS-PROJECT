package com.example.demo.controller;

import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.demo.model.Users;
import com.example.demo.service.UsersService;

@RestController
@RequestMapping("/authservice")
public class UserController {
    
    @Autowired
    UsersService usersService;
    
    @GetMapping("/")
    public String test() {
        return "Spring boot backend is running";
    }
    
    @PostMapping("/signin")
    public Object signin(@RequestBody Map<String, String> m) {
        return usersService.signinService(m);
    }
    
    @PostMapping("/signup")
    public Object signup(@RequestBody Users u1) {
        return usersService.signupService(u1);
    }
    
    @GetMapping("/uinfo")
    public Object uinfo(@RequestHeader("Token") String token) {
        return usersService.uinfo(token);
    }
    
    @GetMapping("/profile")
    public Object profile(@RequestHeader("Token") String token) {
        return usersService.getProfile(token);
    }
    
    @GetMapping("/getallusers/{page}/{limit}")
    public Object getAllUsers(@PathVariable("page") int page, @PathVariable("limit") int limit, @RequestHeader("Token") String token) {
        return usersService.getAllUsers(page, limit, token);
    }
    
    @GetMapping("/getuser/{id}")
    public Object getUser(@PathVariable("id") int id, @RequestHeader("Token") String token) {
        return usersService.getUserById(id, token);
    }
    
    @PostMapping("/saveuser")
    public Object saveUser(@RequestBody Users u1, @RequestHeader("Token") String token) {
        return usersService.saveUser(u1, token);
    }
    
    @PutMapping("/updateuser/{id}")
    public Object updateUser(@PathVariable("id") int id, @RequestBody Users u1, @RequestHeader("Token") String token) {
        return usersService.updateUser(id, u1, token);
    }
    
    @DeleteMapping("/deleteuser/{id}")
    public Object deleteUser(@PathVariable("id") int id, @RequestHeader("Token") String token) {
        return usersService.deleteUser(id, token);
    }
    @GetMapping("/searchuser/{KEY}")
	 public Object searchUser(@PathVariable("KEY") String key, @RequestHeader String token) {
		 return usersService.searchUser(key, token);
	 }
}
