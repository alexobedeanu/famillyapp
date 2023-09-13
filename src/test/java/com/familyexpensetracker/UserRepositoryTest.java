package com.familyexpensetracker;

import com.familyexpensetracker.model.User;
import com.familyexpensetracker.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
public class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void createUserAndSaveToDatabase() {
        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        String rawPassword = "password123";
        String encodedPassword = passwordEncoder.encode(rawPassword);

        User newUser = new User();
        newUser.setUsername("testUser1");
        newUser.setEmail("testuser@example.com");
        newUser.setPassword(encodedPassword);
        newUser.setRole("ROLE_USER");

        userRepository.save(newUser);

        Optional<User> foundUser = userRepository.findByUsername("testUser");

        assertThat(foundUser).isPresent();
        assertThat(foundUser.get().getUsername()).isEqualTo("testUser");
        assertThat(passwordEncoder.matches(rawPassword, foundUser.get().getPassword())).isTrue();
    }
}
