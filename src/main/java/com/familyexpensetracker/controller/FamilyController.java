package com.familyexpensetracker.controller;

import com.familyexpensetracker.dto.FamilyDTO;
import com.familyexpensetracker.dto.UserDTO;
import com.familyexpensetracker.service.FamilyService;
import com.familyexpensetracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/families")
public class FamilyController {

    @Autowired
    private FamilyService familyService;

    @Autowired
    private UserService userService;


    @PostMapping
    public ResponseEntity<FamilyDTO> createFamily(@RequestBody FamilyDTO familyDTO) {
        return ResponseEntity.ok(familyService.createFamily(familyDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FamilyDTO> updateFamily(@PathVariable Long id, @RequestBody FamilyDTO familyDTO) {
        return ResponseEntity.ok(familyService.updateFamily(id, familyDTO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FamilyDTO> getFamilyById(@PathVariable Long id) {
        return ResponseEntity.ok(familyService.getFamilyById(id));
    }

    @GetMapping
    public ResponseEntity<List<FamilyDTO>> getAllFamilies() {
        return ResponseEntity.ok(familyService.getAllFamilies());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFamily(@PathVariable Long id) {
        familyService.deleteFamily(id);
        return ResponseEntity.ok().build();
    }
    @PostMapping("/{familyId}/forecast")
    public ResponseEntity<Double> forecastExpenses(@PathVariable Long familyId, @RequestBody String targetDate) {
        double predictedExpenses = familyService.forecastFamilyExpenses(familyId, targetDate);
        return ResponseEntity.ok(predictedExpenses);
    }

}
