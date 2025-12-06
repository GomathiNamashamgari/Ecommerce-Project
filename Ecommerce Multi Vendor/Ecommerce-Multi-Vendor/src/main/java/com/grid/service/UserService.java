package com.grid.service;

import com.grid.modal.Order;
import com.grid.modal.User;

public interface UserService {

     User findUserByJwtToken(String jwt) throws Exception;
    User findByEmail(String email) throws Exception;

    //Order findOrderById(Long orderId);
}
