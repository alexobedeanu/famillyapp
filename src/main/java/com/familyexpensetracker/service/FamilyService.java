package com.familyexpensetracker.service;

import com.familyexpensetracker.dto.FamilyDTO;
import com.familyexpensetracker.dto.UserDTO;

import java.util.List;

public interface FamilyService {
    FamilyDTO createFamily(FamilyDTO familyDTO);

    FamilyDTO updateFamily(Long id, FamilyDTO familyDTO);

    FamilyDTO getFamilyById(Long id);

    List<FamilyDTO> getAllFamilies();

    String forecastFamilyExpenses(Long familyId, String targetDate);
    void deleteFamily(Long id);
    List<UserDTO> getUsersByFamily(Long familyId);



}
