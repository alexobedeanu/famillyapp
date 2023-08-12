package com.familyexpensetracker.controller;

import com.familyexpensetracker.dto.UserDTO;
import com.familyexpensetracker.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<UserDTO> createUser(@RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userService.createUser(userDTO));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> updateUser(@PathVariable Long id, @RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userService.updateUser(id, userDTO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.ok().build();
    }
    @PostMapping("/{userId}/families/{familyId}")
    public ResponseEntity<UserDTO> addFamilyToUser(@PathVariable Long userId, @PathVariable Long familyId) {
        UserDTO updatedUser = userService.addFamilyToUser(userId, familyId);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @RequestMapping(value = "/{userId}/families/{familyId}", method = RequestMethod.DELETE)
    public ResponseEntity<UserDTO> removeFamilyFromUser(@PathVariable Long userId, @PathVariable Long familyId) {
        UserDTO userDTO = userService.removeFamilyFromUser(userId, familyId);
        return new ResponseEntity<>(userDTO, HttpStatus.OK);
    }

}
