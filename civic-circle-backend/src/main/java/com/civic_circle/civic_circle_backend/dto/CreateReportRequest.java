package com.civic_circle.civic_circle_backend.dto;

import com.civic_circle.civic_circle_backend.entity.ReportPriority;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CreateReportRequest {
    
    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    private String title;
    
    @NotBlank(message = "Description is required")
    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    private String description;
    
    @NotBlank(message = "Category is required")
    @Size(max = 100, message = "Category cannot exceed 100 characters")
    private String category;
    
    private Double latitude;
    private Double longitude;
    private String address;
    private String createdBy;
    private ReportPriority priority = ReportPriority.MEDIUM;
    
    // Constructors
    public CreateReportRequest() {}
    
    public CreateReportRequest(String title, String description, String category, 
                             Double latitude, Double longitude) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.latitude = latitude;
        this.longitude = longitude;
    }
    
    // Getters and Setters
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getCategory() {
        return category;
    }
    
    public void setCategory(String category) {
        this.category = category;
    }
    
    public Double getLatitude() {
        return latitude;
    }
    
    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }
    
    public Double getLongitude() {
        return longitude;
    }
    
    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public String getCreatedBy() {
        return createdBy;
    }
    
    public void setCreatedBy(String createdBy) {
        this.createdBy = createdBy;
    }
    
    public ReportPriority getPriority() {
        return priority;
    }
    
    public void setPriority(ReportPriority priority) {
        this.priority = priority;
    }
}