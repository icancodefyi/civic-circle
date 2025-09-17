package com.civic_circle.civic_circle_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.civic_circle.civic_circle_backend.dto.CreateReportRequest;
import com.civic_circle.civic_circle_backend.dto.ReportResponse;
import com.civic_circle.civic_circle_backend.dto.UpdateReportStatusRequest;
import com.civic_circle.civic_circle_backend.entity.ReportStatus;
import com.civic_circle.civic_circle_backend.service.ReportService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:3000")
public class ReportController {
    
    @Autowired
    private ReportService reportService;
    
    /**
     * Create a new report
     */
    @PostMapping
    public ResponseEntity<ReportResponse> createReport(@Valid @RequestBody CreateReportRequest request) {
        ReportResponse response = reportService.createReport(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
    
    /**
     * Get all reports (with optional pagination)
     */
    @GetMapping
    public ResponseEntity<List<ReportResponse>> getAllReports(
            @RequestParam(required = false) Integer page,
            @RequestParam(required = false) Integer size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {
        
        if (page != null && size != null) {
            Page<ReportResponse> pageResponse = reportService.getAllReports(page, size, sortBy, sortDir);
            return ResponseEntity.ok()
                    .header("X-Total-Count", String.valueOf(pageResponse.getTotalElements()))
                    .header("X-Total-Pages", String.valueOf(pageResponse.getTotalPages()))
                    .body(pageResponse.getContent());
        } else {
            List<ReportResponse> reports = reportService.getAllReports();
            return ResponseEntity.ok(reports);
        }
    }
    
    /**
     * Get report by ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<ReportResponse> getReportById(@PathVariable Long id) {
        ReportResponse response = reportService.getReportById(id);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Update report status
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<ReportResponse> updateReportStatus(
            @PathVariable Long id, 
            @Valid @RequestBody UpdateReportStatusRequest request) {
        ReportResponse response = reportService.updateReportStatus(id, request);
        return ResponseEntity.ok(response);
    }
    
    /**
     * Delete report
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable Long id) {
        reportService.deleteReport(id);
        return ResponseEntity.noContent().build();
    }
    
    /**
     * Search reports by keyword
     */
    @GetMapping("/search")
    public ResponseEntity<List<ReportResponse>> searchReports(@RequestParam String keyword) {
        List<ReportResponse> reports = reportService.searchReports(keyword);
        return ResponseEntity.ok(reports);
    }
    
    /**
     * Get reports by status
     */
    @GetMapping("/status/{status}")
    public ResponseEntity<List<ReportResponse>> getReportsByStatus(@PathVariable ReportStatus status) {
        List<ReportResponse> reports = reportService.getReportsByStatus(status);
        return ResponseEntity.ok(reports);
    }
    
    /**
     * Get reports by category
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<ReportResponse>> getReportsByCategory(@PathVariable String category) {
        List<ReportResponse> reports = reportService.getReportsByCategory(category);
        return ResponseEntity.ok(reports);
    }
    
    /**
     * Get all categories
     */
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        List<String> categories = reportService.getAllCategories();
        return ResponseEntity.ok(categories);
    }
    
    /**
     * Get recent reports (last 30 days)
     */
    @GetMapping("/recent")
    public ResponseEntity<List<ReportResponse>> getRecentReports() {
        List<ReportResponse> reports = reportService.getRecentReports();
        return ResponseEntity.ok(reports);
    }
    
    /**
     * Get reports count by status
     */
    @GetMapping("/count/status/{status}")
    public ResponseEntity<Long> getReportsCountByStatus(@PathVariable ReportStatus status) {
        long count = reportService.getReportsCountByStatus(status);
        return ResponseEntity.ok(count);
    }
}