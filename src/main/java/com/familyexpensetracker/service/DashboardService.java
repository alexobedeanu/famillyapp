package com.familyexpensetracker.service;

import com.familyexpensetracker.dto.DashboardData;
import com.familyexpensetracker.exception.UserNotFoundException;
import com.familyexpensetracker.model.*;
import com.familyexpensetracker.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Service
public class DashboardService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FamilyRepository familyRepository;

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public DashboardData getDashboardDataForUser(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (!userOptional.isPresent()) {
            throw new UserNotFoundException("User not found with id: " + userId);
        }

        User user = userOptional.get();

        // Gather required data based on user
        double totalIncome = incomeRepository.findTotalIncomeByUserId(userId);
        double totalExpense = expenseRepository.findTotalExpenseByUserId(userId);
        double familyBudget = 0.0;
        for (Family family : user.getFamilies()) {
            familyBudget += budgetRepository.findTotalBudgetByFamilyId(family.getId());
        }

        // Assuming you would like to have more detailed data
        // You can add more methods and calculations as needed

        DashboardData dashboardData = new DashboardData();
        dashboardData.setTotalIncome(BigDecimal.valueOf(totalIncome));
        dashboardData.setTotalExpense(BigDecimal.valueOf(totalExpense));
        dashboardData.setFamilyBudget(BigDecimal.valueOf(familyBudget));

        return dashboardData;
    }
}

