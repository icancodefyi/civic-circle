package com.civic_circle.civic_circle_backend.entity;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Entity
@Table(name = "reports")
public class Report {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @NotBlank(message = "Title is required")
    @Size(max = 255, message = "Title cannot exceed 255 characters")
    @Column(nullable = false)
    private String title;
    
    @NotBlank(message = "Description is required")
    @Size(max = 2000, message = "Description cannot exceed 2000 characters")
    @Column(nullable = false, length = 2000)
    private String description;
    
    @NotBlank(message = "Category is required")
    @Size(max = 100, message = "Category cannot exceed 100 characters")
    @Column(nullable = false)
    private String category;
    
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportStatus status = ReportStatus.PENDING;
    
    @Column(name = "latitude")
    private Double latitude;
    
    @Column(name = "longitude")
    private Double longitude;
    
    @Column(name = "address", length = 500)
    private String address;
    
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    @Column(name = "created_by")
    private String createdBy;
    
    @Column(name = "priority")
    @Enumerated(EnumType.STRING)
    private ReportPriority priority = ReportPriority.MEDIUM;
    
    @Column(name = "image", columnDefinition = "LONGTEXT")
    private String image;

    // Constructors
    public Report() {}

    public Report(String title, String description, String category, Double latitude, Double longitude, String image) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.latitude = latitude;
        this.longitude = longitude;
        this.image = image;
    }
    
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