package com.familyexpensetracker.service;


import com.familyexpensetracker.dto.FamilyUsersDTO;
import com.familyexpensetracker.dto.UserDTO;
import com.familyexpensetracker.dto.UserFamilyDTO;

import java.util.List;

public interface UserService {
    UserDTO createUser(UserDTO userDTO);

    UserDTO updateUser(Long id, UserDTO userDTO);

    UserDTO getUserById(Long id);

    List<UserDTO> getAllUsers();

    void deleteUser(Long id);
    UserDTO addFamilyToUser(Long userId, Long familyId);

    UserDTO removeFamilyFromUser(Long userId, Long familyId);

    UserFamilyDTO getUserWithFamily (Long userId);

    FamilyUsersDTO getFamilyWithUsers(Long familyId);


}
