package com.grid.service;

import com.grid.modal.Cart;
import com.grid.modal.CartItem;
import com.grid.modal.Product;
import com.grid.modal.User;

public interface CartService {

    public CartItem addCartItem(
            User user, Product product,String size,
            int quantity
            );
    public Cart findUserCart(User user);

}
