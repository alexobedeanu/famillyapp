package com.familyexpensetracker.service;

import com.familyexpensetracker.dto.BudgetDTO;
import com.familyexpensetracker.model.Budget;
import com.familyexpensetracker.model.Category;
import com.familyexpensetracker.model.Family;
import com.familyexpensetracker.repository.BudgetRepository;
import com.familyexpensetracker.repository.CategoryRepository;
import com.familyexpensetracker.repository.FamilyRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class BudgetServiceImpl implements BudgetService {

    @Autowired
    private BudgetRepository budgetRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private FamilyRepository familyRepository;

    @Override
    public BudgetDTO createBudget(BudgetDTO budgetDTO) {
        Budget budget = new Budget();
        budget.setAmount(budgetDTO.getAmount());

        Optional<Category> category = categoryRepository.findById(budgetDTO.getCategoryId());
        Optional<Family> family = familyRepository.findById(budgetDTO.getFamilyId());

        if (category.isPresent() && family.isPresent()) {
            budget.setCategory(category.get());
            budget.setFamily(family.get());
        } else {
            throw new RuntimeException("Category or family not found");
        }

        Budget savedBudget = budgetRepository.save(budget);
        BudgetDTO savedBudgetDTO = new BudgetDTO();
        BeanUtils.copyProperties(savedBudget, savedBudgetDTO);
        savedBudgetDTO.setCategoryId(savedBudget.getCategory().getId());
        savedBudgetDTO.setFamilyId(savedBudget.getFamily().getId());
        return savedBudgetDTO;
    }

    @Override
    public BudgetDTO updateBudget(Long id, BudgetDTO budgetDTO) {
        Optional<Budget> existingBudget = budgetRepository.findById(id);
        if (existingBudget.isPresent()) {
            Budget updatedBudget = existingBudget.get();
            BeanUtils.copyProperties(budgetDTO, updatedBudget);
            updatedBudget.setId(id);

            Optional<Category> category = categoryRepository.findById(budgetDTO.getCategoryId());
            Optional<Family> family = familyRepository.findById(budgetDTO.getFamilyId());

            if (category.isPresent() && family.isPresent()) {
                updatedBudget.setCategory(category.get());
                updatedBudget.setFamily(family.get());
            } else {
                throw new RuntimeException("Category or family not found");
            }

            Budget savedBudget = budgetRepository.save(updatedBudget);
            BudgetDTO savedBudgetDTO = new BudgetDTO();
            BeanUtils.copyProperties(savedBudget, savedBudgetDTO);
            savedBudgetDTO.setCategoryId(savedBudget.getCategory().getId());
            savedBudgetDTO.setFamilyId(savedBudget.getFamily().getId());

            return savedBudgetDTO;
        } else {
            return null;
        }
    }

    @Override
    public BudgetDTO getBudgetById(Long id) {
        Optional<Budget> budget = budgetRepository.findById(id);
        if (budget.isPresent()) {
            BudgetDTO budgetDTO = new BudgetDTO();
            BeanUtils.copyProperties(budget.get(), budgetDTO);
            budgetDTO.setFamilyId(budget.get().getFamily().getId());
            budgetDTO.setCategoryId(budget.get().getCategory().getId());
            return budgetDTO;
        } else {
            return null;
        }
    }

    @Override
    public List<BudgetDTO> getAllBudgets() {
        List<Budget> budgets = budgetRepository.findAll();
        List<BudgetDTO> budgetDTOs = new ArrayList<>();
        for (Budget budget : budgets) {
            BudgetDTO budgetDTO = new BudgetDTO();
            BeanUtils.copyProperties(budget, budgetDTO);
            budgetDTO.setFamilyId(budget.getFamily().getId());
            budgetDTO.setCategoryId(budget.getCategory().getId());
            budgetDTOs.add(budgetDTO);
        }
        return budgetDTOs;
    }

    @Override
    public void deleteBudget(Long id) {
        budgetRepository.deleteById(id);
    }
}
