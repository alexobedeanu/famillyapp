package com.familyexpensetracker.dto;

import java.math.BigDecimal;

public class DashboardData {

    private BigDecimal totalIncome;
    private BigDecimal totalExpense;
    private BigDecimal familyBudget;

    // Getters, setters and other methods

    public BigDecimal getTotalIncome() {
        return totalIncome;
    }

    public void setTotalIncome(BigDecimal totalIncome) {
        this.totalIncome = totalIncome;
    }

    public BigDecimal getTotalExpense() {
        return totalExpense;
    }

    public void setTotalExpense(BigDecimal totalExpense) {
        this.totalExpense = totalExpense;
    }

    public BigDecimal getFamilyBudget() {
        return familyBudget;
    }

    public void setFamilyBudget(BigDecimal familyBudget) {
        this.familyBudget = familyBudget;
    }
}
