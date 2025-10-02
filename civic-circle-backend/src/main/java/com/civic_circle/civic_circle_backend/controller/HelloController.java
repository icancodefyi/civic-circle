package com.civic_circle.civic_circle_backend.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import com.civic_circle.civic_circle_backend.dto.ReportResponse;
import com.civic_circle.civic_circle_backend.service.ReportService;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
public class HelloController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/hello")
    public java.util.Map<String, String> hello() {
        return java.util.Collections.singletonMap("message", "Hello from Civic Circle Backend 🚀");
    }
    
    // Backward compatibility endpoint
    @GetMapping("/reports")
    public List<ReportResponse> getReports() {
        return reportService.getAllReports();
    }
}
