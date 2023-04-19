package com.familyexpensetracker.dto;

import com.familyexpensetracker.model.Income;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class IncomeDTO {
    private Long id;
    private String description;
    private BigDecimal amount;
    private LocalDateTime date;
    private Long userId;
    private Long categoryId;

    // Constructors

    public IncomeDTO() {
    }

    public IncomeDTO(Long id, String description, BigDecimal amount, LocalDateTime date, Long userId, Long categoryId) {
        this.id = id;
        this.description = description;
        this.amount = amount;
        this.date = date;
        this.userId = userId;
        this.categoryId = categoryId;
    }

    public IncomeDTO(Income income) {
        this.id = income.getId();
        this.description = income.getDescription();
        this.amount = income.getAmount();
        this.date = income.getDate();
        this.userId = income.getUser().getId();
        this.categoryId = income.getCategory().getId();
    }

    // Getters and setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
}
