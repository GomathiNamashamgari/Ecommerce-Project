package com.grid.service.impl;

import com.grid.modal.Product;
import com.grid.modal.Review;
import com.grid.modal.User;
import com.grid.repository.ReviewRepository;
import com.grid.request.CreateReviewRequest;
import com.grid.service.ProductService;
import com.grid.service.ReviewService;
import com.grid.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductService productService;
    private final UserService userService;

    @Override
    public Review createReview(CreateReviewRequest req, User user, Product product) {
        Review review=new Review();
        review.setUser(user);
        review.setProduct(product);
        review.setReviewText(req.getReviewText());
        review.setRating(req.getReviewRating());
        review.setProductImages(req.getProductImage());
        product.getReviews().add(review);
        return reviewRepository.save(review);
    }

    @Override
    public List<Review> getReviewByProductId(Long productId) {
        return reviewRepository.findByProductId(productId);
    }

    @Override
    public Review updateReview(Long reviewId, String reviewText, double rating, Long userId) throws Exception {
        Review review=gerReviewById(reviewId);

        if (review.getUser().getId().equals(userId)){
            review.setReviewText(reviewText);
            review.setRating(rating);
            return reviewRepository.save(review);
        }
        throw new Exception("you can't update this review");
    }

    @Override
    public void deleteReview(Long reviewId, Long userId) throws Exception {
        Review review=gerReviewById(reviewId);
        if(review.getUser().getId().equals(userId)){
            throw new Exception("you can't delete review");
        }
        reviewRepository.delete(review);
    }

    @Override
    public Review gerReviewById(Long reviewId) throws Exception {
        return reviewRepository.findById(reviewId).orElseThrow(()-> new Exception("review not found...."));
    }
}
