package com.grid.controller;

import com.grid.Exception.ProductException;
import com.grid.modal.Product;
import com.grid.modal.User;
import com.grid.modal.Wishlist;
import com.grid.service.ProductService;
import com.grid.service.UserService;
import com.grid.service.WishlistService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/wishlist")
public class WishlistController {

    private  final WishlistService wishlistService;
    private final ProductService productService;
    private final UserService userService;

    @GetMapping()
    public ResponseEntity<Wishlist> getWishlistByUserId(@RequestHeader("Authorization") String jwt) throws Exception {
        User user=userService.findUserByJwtToken(jwt);
        Wishlist wishlist=wishlistService.getWishlistByUserId(user);
        return ResponseEntity.ok(wishlist);
    }

    @PostMapping("/add-product/{productId}")
    public ResponseEntity<Wishlist> addProductToWishlist(@PathVariable Long productId,
                                                         @RequestHeader("Authorization") String jwt) throws Exception {
        Product product=productService.findProductById(productId);
        User user=userService.findUserByJwtToken(jwt);
        Wishlist updatedWishlist=wishlistService.addProductToWishlist(user,product);
        return ResponseEntity.ok(updatedWishlist);
    }

}
