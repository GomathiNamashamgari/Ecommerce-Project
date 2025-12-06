package com.grid.controller;

import com.grid.modal.Product;
import com.grid.modal.Review;
import com.grid.modal.User;
import com.grid.request.CreateReviewRequest;
import com.grid.response.ApiResponse;
import com.grid.service.ProductService;
import com.grid.service.ReviewService;
import com.grid.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/review")
public class ReviewController {
    private final ReviewService reviewService;
    private final UserService userService;
    private final ProductService productService;

    @GetMapping("/products/{productId}/reviews")
    public ResponseEntity<List<Review>> getReviewByProductId(@PathVariable Long productId){
        List<Review> reviews = reviewService.getReviewByProductId(productId);
        return ResponseEntity.ok(reviews);
    }

    @PostMapping("/products/{productId}/reviews")
    public ResponseEntity<Review> writeReview(@RequestBody CreateReviewRequest req,
                                              @PathVariable Long productId,
                                              @RequestHeader("Authorization") String jwt) throws Exception {
        User user=userService.findUserByJwtToken(jwt);
        Product product=productService.findProductById(productId);
        Review review=reviewService.createReview(req,user,product);
        return ResponseEntity.ok(review);
    }

    @PatchMapping("/reviews/{reviewId}")
    public ResponseEntity<Review> updateReview(@RequestBody CreateReviewRequest req, @PathVariable Long reviewId, @RequestHeader("Authorization") String jwt) throws Exception {
        User user=userService.findUserByJwtToken(jwt);
        Review review=reviewService.updateReview(reviewId,req.getReviewText(),req.getReviewRating(),user.getId());
        return ResponseEntity.ok(review);
    }

    @DeleteMapping("/review/{reviewId}")
    public ResponseEntity<ApiResponse> deleteReview(@PathVariable Long reviewId, @RequestHeader("Authorization")String jwt) throws Exception {
        User user=userService.findUserByJwtToken(jwt);
        reviewService.deleteReview(reviewId,user.getId());
        ApiResponse res=new ApiResponse();
        res.setMessage("Review deleted successfully");

        return  ResponseEntity.ok(res);
    }
}
