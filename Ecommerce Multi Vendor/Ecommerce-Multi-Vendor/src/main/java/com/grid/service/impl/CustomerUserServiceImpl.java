package com.grid.service.impl;

import com.grid.domain.USER_ROLE;
import com.grid.modal.Seller;
import com.grid.modal.User;
import com.grid.repository.SellerRepository;
import com.grid.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerUserServiceImpl implements UserDetailsService {
    private final UserRepository userRepository;
    private final SellerRepository sellerRepository;
    private static final Logger log = LoggerFactory.getLogger(CustomerUserServiceImpl.class);

    private static final String SELLER_PREFIX ="seller_";


    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        if (username.startsWith(SELLER_PREFIX)){
            String actualUsername = username.substring(SELLER_PREFIX.length());
            Seller seller=sellerRepository.findByEmail(actualUsername);
            if (seller!=null){
                return buildUserDetails(seller.getEmail(),seller.getPassword(),seller.getRole());
            }
        }
        else {
            User user=userRepository.findByEmail(username);
            if (user!=null){
                return buildUserDetails(user.getEmail(),user.getPassword(),user.getRole());
            }
        }
        log.debug("Loading user for email: {}", username);


        throw new UsernameNotFoundException("user or seller not found with email - "+username);
    }

    private UserDetails buildUserDetails(String email, String password, USER_ROLE role) {
        if (role==null) role=USER_ROLE.ROLE_USER;

        List<GrantedAuthority> authorityList=new ArrayList<>();
        authorityList.add(new SimpleGrantedAuthority(role.toString()));
        return new org.springframework.security.core.userdetails.User(
                email,
                password, authorityList);
    }
}
