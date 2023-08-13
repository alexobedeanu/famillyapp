package com.familyexpensetracker.controller;

import com.familyexpensetracker.dto.DashboardData;
import com.familyexpensetracker.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/{userId}")
    public DashboardData getDashboardData(@PathVariable Long userId) {
        return dashboardService.getDashboardDataForUser(userId);
    }
}
