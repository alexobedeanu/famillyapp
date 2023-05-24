package com.familyexpensetracker.service;

import com.familyexpensetracker.dto.ExpenseDTO;
import com.familyexpensetracker.exception.CategoryNotFoundException;
import com.familyexpensetracker.exception.ExpenseNotFoundException;
import com.familyexpensetracker.exception.FamilyNotFoundException;
import com.familyexpensetracker.exception.UserNotFoundException;
import com.familyexpensetracker.model.Category;
import com.familyexpensetracker.model.Expense;
import com.familyexpensetracker.model.Family;
import com.familyexpensetracker.model.User;
import com.familyexpensetracker.repository.CategoryRepository;
import com.familyexpensetracker.repository.ExpenseRepository;
import com.familyexpensetracker.repository.FamilyRepository;
import com.familyexpensetracker.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.swing.tree.ExpandVetoException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ExpenseServiceImpl implements ExpenseService {

    @Autowired
    private ExpenseRepository expenseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private FamilyRepository familyRepository;

    @Override
    public ExpenseDTO createExpense(ExpenseDTO expenseDTO) {
        Expense expense = new Expense();
        expense.setDescription(expenseDTO.getDescription());
        expense.setAmount(expenseDTO.getAmount());

        Optional<User> user = userRepository.findById(expenseDTO.getUserId());
        Optional<Category> category = categoryRepository.findById(expenseDTO.getCategoryId());
        Optional<Family> family = familyRepository.findById(expenseDTO.getFamilyId());


        if (user.isPresent() && category.isPresent() && family.isPresent()) {
            expense.setUser(user.get());
            expense.setCategory(category.get());
            expense.setFamily(family.get());
            expense.setDate(expenseDTO.getDate());
        } else {
            throw new RuntimeException("User, category or family not found");
        }

        Expense savedExpense = expenseRepository.save(expense);
        ExpenseDTO savedExpenseDTO = new ExpenseDTO();
        BeanUtils.copyProperties(savedExpense, savedExpenseDTO);
        savedExpenseDTO.setUserId(savedExpense.getUser().getId());
        savedExpenseDTO.setCategoryId(savedExpense.getCategory().getId());
        savedExpenseDTO.setFamilyId(savedExpense.getFamily().getId());
        return savedExpenseDTO;
    }

    @Override
    public ExpenseDTO updateExpense(Long id, ExpenseDTO expenseDTO) {
        Optional<Expense> existingExpense = expenseRepository.findById(id);
        if (existingExpense.isPresent()) {
            Expense updatedExpense = existingExpense.get();
            BeanUtils.copyProperties(expenseDTO, updatedExpense);
            updatedExpense.setId(id);

            Optional<User> user = userRepository.findById(expenseDTO.getUserId());
            Optional<Category> category = categoryRepository.findById(expenseDTO.getCategoryId());
            Optional<Family> family = familyRepository.findById(expenseDTO.getFamilyId());

            if (user.isPresent() && category.isPresent() && family.isPresent()) {
                updatedExpense.setUser(user.get());
                updatedExpense.setCategory(category.get());
                updatedExpense.setFamily(family.get());
                updatedExpense.setDate(expenseDTO.getDate());
            } else {
                if (!category.isPresent()) {
                    throw new CategoryNotFoundException("Category not found");
                }
                if (!user.isPresent()) {
                    throw new UserNotFoundException("User with id " + expenseDTO.getUserId() + " not found");
                }
                if (!family.isPresent()) {
                    throw new FamilyNotFoundException("Family with id " + expenseDTO.getFamilyId() + " not found");
                }
            }
            Expense savedExpense = expenseRepository.save(updatedExpense);
            ExpenseDTO savedExpenseDTO = new ExpenseDTO();
            BeanUtils.copyProperties(savedExpense, savedExpenseDTO);
            savedExpenseDTO.setUserId(savedExpense.getUser().getId());
            savedExpenseDTO.setCategoryId(savedExpense.getCategory().getId());
            savedExpenseDTO.setFamilyId(savedExpense.getFamily().getId());

            return savedExpenseDTO;
        } else {
            throw new ExpenseNotFoundException("Expense with id " + id + " not found");
        }
    }

    @Override
    public ExpenseDTO getExpenseById(Long id) {
        Optional<Expense> expense = expenseRepository.findById(id);
        if (expense.isPresent()) {
            ExpenseDTO expenseDTO = new ExpenseDTO();
            BeanUtils.copyProperties(expense.get(), expenseDTO);
            expenseDTO.setFamilyId(expense.get().getFamily().getId());
            expenseDTO.setUserId(expense.get().getUser().getId());
            expenseDTO.setCategoryId(expense.get().getCategory().getId());
            expenseDTO.setDate(expense.get().getDate());
            return expenseDTO;
        } else {
            throw new ExpenseNotFoundException("Expense with id " + id + " not found");
        }
    }

    @Override
    public List<ExpenseDTO> getAllExpenses() {
        List<Expense> expenses = expenseRepository.findAll();
        List<ExpenseDTO> expenseDTOs = new ArrayList<>();
        for (Expense expense : expenses) {
            ExpenseDTO expenseDTO = new ExpenseDTO();
            BeanUtils.copyProperties(expense, expenseDTO);
            expenseDTO.setFamilyId(expense.getFamily().getId());
            expenseDTO.setUserId(expense.getUser().getId());
            expenseDTO.setCategoryId(expense.getCategory().getId());
            expenseDTO.setDate(expense.getDate());
            expenseDTOs.add(expenseDTO);
        }
        return expenseDTOs;
    }


    @Override
    public void deleteExpense(Long id) {
        Optional<Expense> expense = expenseRepository.findById(id);
        if (!expense.isPresent()) {
            throw new ExpenseNotFoundException("Expense with id " + id + " not found");
        }
        expenseRepository.deleteById(id);
    }

    @Override
    public Long getTotalExpenses() {
        return expenseRepository.count();
    }
}
