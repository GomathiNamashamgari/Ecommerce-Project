package com.grid.repository;


import com.grid.modal.Cart;
import com.grid.modal.CartItem;
import com.grid.modal.Product;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    CartItem findByCartAndProductAndSize(Cart cart, Product product, String size);
}
