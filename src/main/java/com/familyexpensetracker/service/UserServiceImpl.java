package com.familyexpensetracker.service;

import com.familyexpensetracker.dto.UserDTO;
import com.familyexpensetracker.exception.FamilyNotFoundException;
import com.familyexpensetracker.exception.UserNotFoundException;
import com.familyexpensetracker.model.Family;
import com.familyexpensetracker.model.User;
import com.familyexpensetracker.repository.FamilyRepository;
import com.familyexpensetracker.repository.UserRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private FamilyRepository familyRepository;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Override
    public UserDTO createUser(UserDTO userDTO) {
        User user = new User();
        BeanUtils.copyProperties(userDTO, user);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        User savedUser = userRepository.save(user);
        UserDTO savedUserDTO = new UserDTO();
        savedUserDTO.setId(savedUser.getId());
        savedUserDTO.setEmail(savedUser.getEmail());
        savedUserDTO.setUsername(savedUser.getUsername());
        savedUserDTO.setRole(savedUser.getRole());
//        BeanUtils.copyProperties(savedUser, savedUserDTO);
        return savedUserDTO;
    }


    @Override
    public UserDTO updateUser(Long id, UserDTO userDTO) {
        Optional<User> existingUser = userRepository.findById(id);
        if (existingUser.isPresent()) {
            User updatedUser = existingUser.get();
            BeanUtils.copyProperties(userDTO, updatedUser);
            updatedUser.setId(id);
            User savedUser = userRepository.save(updatedUser);
            UserDTO savedUserDTO = new UserDTO();
            BeanUtils.copyProperties(savedUser, savedUserDTO);
            return savedUserDTO;
        } else {
            throw new UserNotFoundException("User not found with id: " + id);
        }
    }

    @Override
    public UserDTO getUserById(Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            UserDTO userDTO = new UserDTO();
            BeanUtils.copyProperties(user.get(), userDTO);
            Set<Long> familyIds = user.get().getFamilies().stream().map(Family::getId).collect(Collectors.toSet());
            userDTO.setFamilyIds(familyIds);
            return userDTO;
        } else {
            throw new UserNotFoundException("User not found with id: " + id);
        }
    }


    @Override
    public List<UserDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<UserDTO> userDTOs = new ArrayList<>();
        for (User user : users) {
            UserDTO userDTO = new UserDTO();
            BeanUtils.copyProperties(user, userDTO);
            userDTOs.add(userDTO);
        }
        return userDTOs;
    }

    @Override
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new UserNotFoundException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
    @Override
    public UserDTO addFamilyToUser(Long userId, Long familyId) {
        Optional<User> existingUser = userRepository.findById(userId);
        if (!existingUser.isPresent()) {
            throw new UserNotFoundException("User not found with id: " + userId);
        }

        Optional<Family> existingFamily = familyRepository.findById(familyId);
        if (!existingFamily.isPresent()) {
            throw new FamilyNotFoundException("Family with id " + familyId + " not found");
        }

        User user = existingUser.get();
        Family family = existingFamily.get();

        user.getFamilies().add(family);
        family.getUsers().add(user);

        userRepository.save(user);
        familyRepository.save(family);

        UserDTO userDTO = new UserDTO();
        BeanUtils.copyProperties(user, userDTO);
        return userDTO;
    }
    @Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
}