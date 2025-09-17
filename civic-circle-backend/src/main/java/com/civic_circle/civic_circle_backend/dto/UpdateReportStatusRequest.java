package com.civic_circle.civic_circle_backend.dto;

import com.civic_circle.civic_circle_backend.entity.ReportStatus;

public class UpdateReportStatusRequest {
    
    private ReportStatus status;
    private String updatedBy;
    private String comments;
    
    // Constructors
    public UpdateReportStatusRequest() {}
    
    public UpdateReportStatusRequest(ReportStatus status) {
        this.status = status;
    }
    
    // Getters and Setters
    public ReportStatus getStatus() {
        return status;
    }
    
    public void setStatus(ReportStatus status) {
        this.status = status;
    }
    
    public String getUpdatedBy() {
        return updatedBy;
    }
    
    public void setUpdatedBy(String updatedBy) {
        this.updatedBy = updatedBy;
    }
    
    public String getComments() {
        return comments;
    }
    
    public void setComments(String comments) {
        this.comments = comments;
    }
}