package com.familyexpensetracker.service;

import com.familyexpensetracker.dto.IncomeDTO;
import com.familyexpensetracker.exception.CategoryNotFoundException;
import com.familyexpensetracker.exception.IncomeNotFoundException;
import com.familyexpensetracker.exception.UserNotFoundException;
import com.familyexpensetracker.model.Category;
import com.familyexpensetracker.model.Income;
import com.familyexpensetracker.model.User;
import com.familyexpensetracker.repository.CategoryRepository;
import com.familyexpensetracker.repository.IncomeRepository;
import com.familyexpensetracker.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class IncomeService {

    @Autowired
    private IncomeRepository incomeRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CategoryRepository categoryRepository;


    public IncomeDTO createIncome(IncomeDTO incomeDTO) {
        Income income = new Income();
        income.setDescription(incomeDTO.getDescription());
        income.setAmount(incomeDTO.getAmount());

        Optional<User> user = userRepository.findById(incomeDTO.getUserId());
        Optional<Category> category = categoryRepository.findById(incomeDTO.getCategoryId());

        if (user.isPresent() && category.isPresent()) {
            income.setUser(user.get());
            income.setCategory(category.get());
            income.setDate(LocalDateTime.now());
        } else {
            if (!user.isPresent()) {
                throw new UserNotFoundException("User with id " + incomeDTO.getUserId() + " not found");
            } else {
                throw new CategoryNotFoundException("Category with id " + incomeDTO.getCategoryId() + " not found");
            }
        }

        Income savedIncome = incomeRepository.save(income);
        IncomeDTO savedIncomeDTO = new IncomeDTO();
        BeanUtils.copyProperties(savedIncome, savedIncomeDTO);
        savedIncomeDTO.setUserId(savedIncome.getUser().getId());
        savedIncomeDTO.setCategoryId(savedIncome.getCategory().getId());

        return savedIncomeDTO;
    }


    public IncomeDTO updateIncome(Long id, IncomeDTO incomeDTO) {
        Optional<Income> incomeOptional = incomeRepository.findById(id);

        if (!incomeOptional.isPresent()) {
            throw new IncomeNotFoundException("Income with id " + id + " not found");
        }

        Income income = incomeOptional.get();
        income.updateFromDto(incomeDTO);
        incomeRepository.save(income);

        return new IncomeDTO(income);
    }

    public IncomeDTO getIncomeById(Long id) {
        Optional<Income> incomeOptional = incomeRepository.findById(id);

        if (!incomeOptional.isPresent()) {
            throw new IncomeNotFoundException("Income with id " + id + " not found");
        }

        return new IncomeDTO(incomeOptional.get());
    }

    public List<IncomeDTO> getAllIncomes() {
        List<Income> incomes = incomeRepository.findAll();
        return incomes.stream().map(IncomeDTO::new).collect(Collectors.toList());
    }

    public void deleteIncome(Long id) {
        Optional<Income> incomeOptional = incomeRepository.findById(id);

        if (!incomeOptional.isPresent()) {
            throw new IncomeNotFoundException("Income with id " + id + " not found");
        }

        incomeRepository.deleteById(id);
    }
}
