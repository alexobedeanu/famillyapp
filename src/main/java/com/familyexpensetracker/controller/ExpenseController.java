package com.familyexpensetracker.controller;

import com.familyexpensetracker.dto.ExpenseDTO;
import com.familyexpensetracker.service.ExpenseService;
import com.familyexpensetracker.service.ForecastService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseService expenseService;
    private ForecastService forecastService;


    @PostMapping
    public ResponseEntity<ExpenseDTO> createExpense(@RequestBody ExpenseDTO expenseDto) {
        ExpenseDTO createdExpenseDto = expenseService.createExpense(expenseDto);
        return new ResponseEntity<>(createdExpenseDto, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExpenseDTO> updateExpense(@PathVariable Long id, @RequestBody ExpenseDTO expenseDto) {
        ExpenseDTO updatedExpenseDto = expenseService.updateExpense(id, expenseDto);
        return ResponseEntity.ok(updatedExpenseDto);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExpense(@PathVariable Long id) {
        expenseService.deleteExpense(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<ExpenseDTO>> getAllExpenses() {
        List<ExpenseDTO> expenseDtos = expenseService.getAllExpenses();
        return ResponseEntity.ok(expenseDtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ExpenseDTO> getExpenseById(@PathVariable Long id) {
        ExpenseDTO expenseDto = expenseService.getExpenseById(id);
        return ResponseEntity.ok(expenseDto);
    }

    @GetMapping("/count")
    public ResponseEntity<Long> getTotalExpenses() {
        Long totalExpenses = expenseService.getTotalExpenses();
        return ResponseEntity.ok(totalExpenses);
    }

    @PostMapping("/forecastExpenses")
    public String forecastExpenses(@RequestBody Map<String, String> request) {
        Long familyId = Long.parseLong(request.get("familyId"));
        String targetDate = request.get("targetDate");
        return forecastService.forecastExpenses(familyId, targetDate);
    }
}
