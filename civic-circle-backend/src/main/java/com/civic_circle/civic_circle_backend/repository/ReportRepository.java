package com.civic_circle.civic_circle_backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.civic_circle.civic_circle_backend.entity.Report;
import com.civic_circle.civic_circle_backend.entity.ReportStatus;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    
    // Find reports by status
    List<Report> findByStatus(ReportStatus status);
    
    // Find reports by category
    List<Report> findByCategory(String category);
    
    // Find reports by category with pagination
    Page<Report> findByCategory(String category, Pageable pageable);
    
    // Find reports by status with pagination
    Page<Report> findByStatus(ReportStatus status, Pageable pageable);
    
    // Search reports by title or description containing keyword
    @Query("SELECT r FROM Report r WHERE " +
           "LOWER(r.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(r.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    List<Report> searchByKeyword(@Param("keyword") String keyword);
    
    // Search with pagination
    @Query("SELECT r FROM Report r WHERE " +
           "LOWER(r.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(r.description) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<Report> searchByKeyword(@Param("keyword") String keyword, Pageable pageable);
    
    // Find reports created between dates
    List<Report> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    
    // Find reports by location (within a radius - simplified)
    @Query("SELECT r FROM Report r WHERE " +
           "r.latitude BETWEEN :latMin AND :latMax AND " +
           "r.longitude BETWEEN :lngMin AND :lngMax")
    List<Report> findByLocationRange(@Param("latMin") Double latMin, 
                                   @Param("latMax") Double latMax,
                                   @Param("lngMin") Double lngMin, 
                                   @Param("lngMax") Double lngMax);
    
    // Count reports by status
    long countByStatus(ReportStatus status);
    
    // Find recent reports (last 30 days)
    @Query("SELECT r FROM Report r WHERE r.createdAt >= :thirtyDaysAgo ORDER BY r.createdAt DESC")
    List<Report> findRecentReports(@Param("thirtyDaysAgo") LocalDateTime thirtyDaysAgo);
    
    // Get all distinct categories
    @Query("SELECT DISTINCT r.category FROM Report r ORDER BY r.category")
    List<String> findAllCategories();
}