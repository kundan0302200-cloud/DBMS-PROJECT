package com.example.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.example.demo.model.Resources;
import com.example.demo.service.ResourceService;

@RestController
@RequestMapping("/resource")
public class ResourceController {
    
    @Autowired
    ResourceService resourceService;
    
    @PostMapping("/add")
    public Object addResource(@RequestBody Resources resource, @RequestHeader("Token") String token) {
        return resourceService.addResource(resource, token);
    }
    
    @GetMapping("/getall")
    public Object getAllResources(@RequestHeader("Token") String token) {
        return resourceService.getAllResources(token);
    }
    
    @GetMapping("/available")
    public Object getAvailableResources(@RequestHeader("Token") String token) {
        return resourceService.getAvailableResources(token);
    }
    
    @GetMapping("/getbyid/{id}")
    public Object getResourceById(@PathVariable("id") int id, @RequestHeader("Token") String token) {
        return resourceService.getResourceById(id, token);
    }
    
    @PutMapping("/update/{id}")
    public Object updateResource(@PathVariable("id") int id, @RequestBody Resources resource, @RequestHeader("Token") String token) {
        System.out.println("Received update for ID: " + id);
        System.out.println("Resource name from body: " + resource.getResourceName());
        System.out.println("Resource type from body: " + resource.getResourceType());
        System.out.println("Total quantity: " + resource.getTotalQuantity());
        
        return resourceService.updateResource(id, resource, token);
    }
    
    @DeleteMapping("/delete/{id}")
    public Object deleteResource(@PathVariable("id") int id, @RequestHeader("Token") String token) {
        return resourceService.deleteResource(id, token);
    }
}