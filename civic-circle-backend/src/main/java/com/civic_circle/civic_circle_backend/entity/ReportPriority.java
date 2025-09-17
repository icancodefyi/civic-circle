package com.civic_circle.civic_circle_backend.entity;

public enum ReportPriority {
    LOW("Low"),
    MEDIUM("Medium"),
    HIGH("High"),
    URGENT("Urgent");
    
    private final String displayName;
    
    ReportPriority(String displayName) {
        this.displayName = displayName;
    }
    
    public String getDisplayName() {
        return displayName;
    }
}