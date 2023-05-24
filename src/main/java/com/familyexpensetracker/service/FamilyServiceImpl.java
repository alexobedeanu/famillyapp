package com.familyexpensetracker.service;

import com.familyexpensetracker.dto.FamilyDTO;
import com.familyexpensetracker.dto.UserDTO;
import com.familyexpensetracker.exception.FamilyNotFoundException;
import com.familyexpensetracker.exception.UserNotFoundException;
import com.familyexpensetracker.model.Family;
import com.familyexpensetracker.model.User;
import com.familyexpensetracker.repository.FamilyRepository;
import com.familyexpensetracker.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class FamilyServiceImpl implements FamilyService {

    @Autowired
    private FamilyRepository familyRepository;
    @Autowired
    private UserRepository userRepository;

    @Override
    public FamilyDTO createFamily(FamilyDTO familyDTO) {
        Family family = new Family();
        BeanUtils.copyProperties(familyDTO, family);
        Family savedFamily = familyRepository.save(family);
        FamilyDTO savedFamilyDTO = new FamilyDTO();
        BeanUtils.copyProperties(savedFamily, savedFamilyDTO);
        return savedFamilyDTO;
    }

    @Override
    public FamilyDTO updateFamily(Long id, FamilyDTO familyDTO) {
        Optional<Family> existingFamily = familyRepository.findById(id);
        if (existingFamily.isPresent()) {
            Family updatedFamily = existingFamily.get();
            BeanUtils.copyProperties(familyDTO, updatedFamily);
            updatedFamily.setId(id);
            Family savedFamily = familyRepository.save(updatedFamily);
            FamilyDTO savedFamilyDTO = new FamilyDTO();
            BeanUtils.copyProperties(savedFamily, savedFamilyDTO);
            return savedFamilyDTO;
        } else {
            throw new FamilyNotFoundException("Family with id " + id + " not found");
        }
    }

    @Override
    public FamilyDTO getFamilyById(Long id) {
        Optional<Family> family = familyRepository.findById(id);
        if (family.isPresent()) {
            FamilyDTO familyDTO = new FamilyDTO();
            BeanUtils.copyProperties(family.get(), familyDTO);
            return familyDTO;
        } else {
            throw new FamilyNotFoundException("Family with id " + id + " not found");
        }
    }

    @Override
    public List<FamilyDTO> getAllFamilies() {
        List<Family> families = familyRepository.findAll();
        List<FamilyDTO> familyDTOs = new ArrayList<>();
        for (Family family : families) {
            FamilyDTO familyDTO = new FamilyDTO();
            BeanUtils.copyProperties(family, familyDTO);
            familyDTOs.add(familyDTO);
        }
        return familyDTOs;
    }

    @Override
    public void deleteFamily(Long id) {
        if (!familyRepository.existsById(id)) {
            throw new FamilyNotFoundException("Family with id " + id + " not found");
        }
        familyRepository.deleteById(id);
    }


}
