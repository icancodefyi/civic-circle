package com.civic_circle.civic_circle_backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.civic_circle.civic_circle_backend.dto.CreateReportRequest;
import com.civic_circle.civic_circle_backend.dto.ReportResponse;
import com.civic_circle.civic_circle_backend.dto.UpdateReportStatusRequest;
import com.civic_circle.civic_circle_backend.entity.Report;
import com.civic_circle.civic_circle_backend.entity.ReportStatus;
import com.civic_circle.civic_circle_backend.exception.ResourceNotFoundException;
import com.civic_circle.civic_circle_backend.repository.ReportRepository;

@Service
@Transactional
public class ReportService {
    
    @Autowired
    private ReportRepository reportRepository;
    
    /**
     * Create a new report
     */
    public ReportResponse createReport(CreateReportRequest request) {
        Report report = new Report();
        report.setTitle(request.getTitle());
        report.setDescription(request.getDescription());
        report.setCategory(request.getCategory());
        report.setLatitude(request.getLatitude());
        report.setLongitude(request.getLongitude());
        report.setAddress(request.getAddress());
        report.setCreatedBy(request.getCreatedBy());
        report.setPriority(request.getPriority());
        report.setStatus(ReportStatus.PENDING);
        
        Report savedReport = reportRepository.save(report);
        return mapToResponse(savedReport);
    }
    
    /**
     * Get all reports with pagination and sorting
     */
    public Page<ReportResponse> getAllReports(int page, int size, String sortBy, String sortDir) {
        Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? 
            Sort.Direction.DESC : Sort.Direction.ASC;
        
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));
        Page<Report> reports = reportRepository.findAll(pageable);
        
        return reports.map(this::mapToResponse);
    }
    
    /**
     * Get all reports without pagination
     */
    public List<ReportResponse> getAllReports() {
        List<Report> reports = reportRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return reports.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Get report by ID
     */
    public ReportResponse getReportById(Long id) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + id));
        return mapToResponse(report);
    }
    
    /**
     * Update report status
     */
    public ReportResponse updateReportStatus(Long id, UpdateReportStatusRequest request) {
        Report report = reportRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Report not found with id: " + id));
        
        report.setStatus(request.getStatus());
        Report updatedReport = reportRepository.save(report);
        
        return mapToResponse(updatedReport);
    }
    
    /**
     * Delete report
     */
    public void deleteReport(Long id) {
        if (!reportRepository.existsById(id)) {
            throw new ResourceNotFoundException("Report not found with id: " + id);
        }
        reportRepository.deleteById(id);
    }
    
    /**
     * Search reports by keyword
     */
    public List<ReportResponse> searchReports(String keyword) {
        List<Report> reports = reportRepository.searchByKeyword(keyword);
        return reports.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Get reports by status
     */
    public List<ReportResponse> getReportsByStatus(ReportStatus status) {
        List<Report> reports = reportRepository.findByStatus(status);
        return reports.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Get reports by category
     */
    public List<ReportResponse> getReportsByCategory(String category) {
        List<Report> reports = reportRepository.findByCategory(category);
        return reports.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Get all categories
     */
    public List<String> getAllCategories() {
        return reportRepository.findAllCategories();
    }
    
    /**
     * Get recent reports (last 30 days)
     */
    public List<ReportResponse> getRecentReports() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        List<Report> reports = reportRepository.findRecentReports(thirtyDaysAgo);
        return reports.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    
    /**
     * Get reports count by status
     */
    public long getReportsCountByStatus(ReportStatus status) {
        return reportRepository.countByStatus(status);
    }
    
    /**
     * Map Report entity to ReportResponse DTO
     */
    private ReportResponse mapToResponse(Report report) {
        ReportResponse response = new ReportResponse();
        response.setId(report.getId());
        response.setTitle(report.getTitle());
        response.setDescription(report.getDescription());
        response.setCategory(report.getCategory());
        response.setStatus(report.getStatus());
        response.setLatitude(report.getLatitude());
        response.setLongitude(report.getLongitude());
        response.setAddress(report.getAddress());
        response.setCreatedAt(report.getCreatedAt());
        response.setUpdatedAt(report.getUpdatedAt());
        response.setCreatedBy(report.getCreatedBy());
        response.setPriority(report.getPriority());
        return response;
    }
}