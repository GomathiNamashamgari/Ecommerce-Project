package com.grid.service.impl;

import com.grid.config.JwtProvider;
import com.grid.modal.User;
import com.grid.repository.UserRepository;
import com.grid.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final JwtProvider jwtProvider;

    @Override
    public User findUserByJwtToken(String jwt) throws Exception {
        String email=jwtProvider.getEmailFromJwtToken(jwt);


        return this.findByEmail(email);
    }

    @Override
    public User findByEmail(String email) {
        if (email == null || email.trim().isEmpty()) {
            return null;  // Don't throw
        }
        return userRepository.findByEmail(email);  // Returns User or null
    }
}
