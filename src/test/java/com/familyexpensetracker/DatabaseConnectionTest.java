package com.familyexpensetracker;

import com.familyexpensetracker.model.User;
import com.familyexpensetracker.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.List;

@SpringBootTest
public class DatabaseConnectionTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    public void testDatabaseConnection() {
        List<User> users = userRepository.findAll();
        System.out.println("Users in the database:");
        users.forEach(System.out::println);
    }
}
