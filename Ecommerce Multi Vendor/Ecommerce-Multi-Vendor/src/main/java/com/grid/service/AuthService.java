package com.grid.service;

import com.grid.domain.USER_ROLE;
import com.grid.request.LoginRequest;
import com.grid.response.AuthResponse;
import com.grid.response.SignupRequest;

public interface AuthService {

    void sentLoginOtp(String email) throws Exception;
    String createUser(SignupRequest req) throws Exception;
    AuthResponse signin(LoginRequest req) throws Exception;


}
