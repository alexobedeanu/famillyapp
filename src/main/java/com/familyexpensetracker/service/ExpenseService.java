package com.familyexpensetracker.service;

import com.familyexpensetracker.dto.ExpenseDTO;

import java.util.List;

public interface ExpenseService {
    ExpenseDTO createExpense(ExpenseDTO expenseDTO);

    ExpenseDTO updateExpense(Long id, ExpenseDTO expenseDTO);

    ExpenseDTO getExpenseById(Long id);

    List<ExpenseDTO> getAllExpenses();

    void deleteExpense(Long id);

    Long getTotalExpenses();

}

