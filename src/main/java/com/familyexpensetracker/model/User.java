package com.familyexpensetracker.model;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password;
    private String email;
    private String role;
    @Transient
    private Set<Long> familyIds;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(name = "user_family",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "family_id"))
    private Set<Family> families = new HashSet<>();

    // Getters and Setters

    public Set<Long> getFamilyIds() {
        return familyIds;
    }
    public void setFamilyIds(Set<Long> familyIds) {
        this.familyIds = familyIds;
    }

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

    public Set<Family> getFamilies() {
        return families;
    }

    public void setFamilies(Set<Family> families) {
        this.families = families;
    }
}