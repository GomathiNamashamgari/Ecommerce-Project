package com.grid.service;

import com.grid.modal.Product;
import com.grid.modal.Review;
import com.grid.modal.User;
import com.grid.request.CreateReviewRequest;

import java.util.List;

public interface ReviewService {

    Review createReview(CreateReviewRequest req, User user, Product product);
    List<Review> getReviewByProductId(Long productId);
    Review updateReview(Long reviewId, String reviewText, double rating, Long userId) throws Exception;
    void deleteReview(Long reviewId, Long userId) throws Exception;
    Review gerReviewById(Long reviewId) throws Exception;

}
