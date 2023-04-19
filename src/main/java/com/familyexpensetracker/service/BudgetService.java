package com.familyexpensetracker.service;

import com.familyexpensetracker.dto.BudgetDTO;

import java.util.List;

public interface BudgetService {
    BudgetDTO createBudget(BudgetDTO budgetDTO);

    BudgetDTO updateBudget(Long id, BudgetDTO budgetDTO);

    BudgetDTO getBudgetById(Long id);

    List<BudgetDTO> getAllBudgets();

    void deleteBudget(Long id);
}
