package com.grid.response;

import lombok.Data;

@Data
public class SignupRequest {
    private String email;
    private String fullName;      // for signup only
    private String mobile;        // for signup only
    private String password;
    private String otp;

}

