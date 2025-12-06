package com.grid.controller;

import com.grid.modal.Cart;
import com.grid.modal.Coupon;
import com.grid.modal.User;
import com.grid.service.CartService;
import com.grid.service.CouponService;
import com.grid.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/coupons")
public class AdminCouponController {
    private final CouponService couponService;
    private final UserService userService;
    private final CartService cartService;

    @PostMapping("/apply")
    public ResponseEntity<Cart> applyCoupon(@RequestParam String apply, @RequestParam String code, @RequestParam double orderValue, @RequestHeader("Authorization") String jwt) throws Exception {
        User user=userService.findUserByJwtToken(jwt);
        Cart cart;
        if (apply.equals("true")){
            cart=couponService.applyCoupon(code, orderValue,user);
        }
        else {
            cart=couponService.removeCoupon(code,user);
        }
        return ResponseEntity.ok(cart);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/create")
    public ResponseEntity<Coupon> createCoupon(@RequestBody Coupon coupon){
        Coupon createdCoupon=couponService.createCoupon(coupon);
        return ResponseEntity.ok(createdCoupon);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteCoupon(@PathVariable Long id) throws Exception {
        couponService.deleteCoupon(id);
        return ResponseEntity.ok("Coupon deleted Successfully");
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/all")
    public ResponseEntity<List<Coupon>> getAllCoupons(){
        List<Coupon> coupons=couponService.findAllCoupons();
        return ResponseEntity.ok(coupons);

    }
}
