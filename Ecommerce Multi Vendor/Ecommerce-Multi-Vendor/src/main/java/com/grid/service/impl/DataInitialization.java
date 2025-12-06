package com.grid.service.impl;

import com.grid.domain.USER_ROLE;
import com.grid.modal.User;
import com.grid.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitialization implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args){
        initializeAdminUser();

    }

    private void initializeAdminUser(){
        String adminUsername = "gridstore724@gmail.com";

        if (userRepository.findByEmail(adminUsername)==null){
            User adminUser = new User();
            adminUser.setPassword(passwordEncoder.encode("gridstore"));
            adminUser.setFullName("Grid");
            adminUser.setEmail(adminUsername);

            adminUser.setRole(USER_ROLE.ROLE_ADMIN);

            User admin=userRepository.save(adminUser);
        }
    }

}
