package com.grid.service;

import com.grid.modal.Product;
import com.grid.modal.User;
import com.grid.modal.Wishlist;

public interface WishlistService {
    Wishlist createWishlist(User user);
    Wishlist getWishlistByUserId(User user);
    Wishlist addProductToWishlist(User user, Product product);
}
