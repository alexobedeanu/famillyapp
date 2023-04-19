package com.familyexpensetracker.model;

import com.familyexpensetracker.dto.IncomeDTO;

import javax.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "incomes")
public class Income {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(nullable = false)
    private LocalDateTime date;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    // Constructors, getters, and setters

    public Income() {}

    public Income(IncomeDTO incomeDTO) {
        this.description = incomeDTO.getDescription();
        this.amount = incomeDTO.getAmount();
        this.date = incomeDTO.getDate();
        // You need to set the User and Category objects by fetching them from their respective repositories using the userId and categoryId provided in the DTO.
    }

    public void updateFromDto(IncomeDTO incomeDTO) {
        this.description = incomeDTO.getDescription();
        this.amount = incomeDTO.getAmount();
        this.date = incomeDTO.getDate();
        // You need to update the User and Category objects by fetching them from their respective repositories using the userId and categoryId provided in the DTO.
    }

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

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }


}
