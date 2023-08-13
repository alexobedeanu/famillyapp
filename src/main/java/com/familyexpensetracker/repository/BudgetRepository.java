package com.familyexpensetracker.repository;


import com.familyexpensetracker.model.Budget;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface BudgetRepository extends JpaRepository<Budget, Long> {
    @Query("SELECT SUM(b.amount) FROM Budget b WHERE b.family.id = ?1")
    double findTotalBudgetByFamilyId(Long id);

}
