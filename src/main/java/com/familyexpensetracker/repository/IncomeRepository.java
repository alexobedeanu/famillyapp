package com.familyexpensetracker.repository;

import com.familyexpensetracker.model.Income;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface IncomeRepository extends JpaRepository<Income, Long> {
    @Query("SELECT SUM(i.amount) FROM Income i WHERE i.user.id = ?1")
    double findTotalIncomeByUserId(Long userId);
}
