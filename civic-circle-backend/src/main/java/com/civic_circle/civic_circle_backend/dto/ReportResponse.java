package com.civic_circle.civic_circle_backend.dto;

import java.time.LocalDateTime;

import com.civic_circle.civic_circle_backend.entity.ReportPriority;
import com.civic_circle.civic_circle_backend.entity.ReportStatus;

public class ReportResponse {
    
    private Long id;
    private String title;
    private String description;
    private String category;
    private ReportStatus status;
    private Double latitude;
    private Double longitude;
    private String address;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private String createdBy;
    private ReportPriority priority;
    private String image;
    
    // Constructors
    public ReportResponse() {}
    
    // Getters and Setters
    public String getImage() {
        return image;
    }
    public void setImage(String image) {
        this.image = image;
    }
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
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
    
    public ReportStatus getStatus() {
        return status;
    }
    
    public void setStatus(ReportStatus status) {
        this.status = status;
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
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
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