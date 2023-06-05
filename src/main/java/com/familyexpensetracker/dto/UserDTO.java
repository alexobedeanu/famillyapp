package com.familyexpensetracker.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.Set;

public class UserDTO {
    private Long id;
    @JsonProperty("username")
    private String username;
    private String email;
    @JsonProperty("role")
    private String role;
    @JsonProperty("password")
    private String password;

    public Set<Long> getFamilyIds() {
        return familyIds;
    }

    public void setFamilyIds(Set<Long> familyIds) {
        this.familyIds = familyIds;
    }

    private Set<Long> familyIds;



    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}