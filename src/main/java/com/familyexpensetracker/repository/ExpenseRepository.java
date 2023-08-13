package com.familyexpensetracker.repository;

import com.familyexpensetracker.model.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByFamilyId(Long familyId);

    @Query("SELECT SUM(e.amount) FROM Expense e WHERE e.user.id = ?1")
    double findTotalExpenseByUserId(Long userId);
}
