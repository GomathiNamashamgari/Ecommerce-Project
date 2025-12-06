// src/main/java/com/grid/controller/PaymentController.java

package com.grid.controller;

import com.grid.modal.PaymentOrder;
import com.grid.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/payment-success")
public class PaymentController {

    private final PaymentService paymentService;
    private static final Logger logger = LoggerFactory.getLogger(PaymentController.class);

    /**
     * Called by React frontend after Razorpay redirects to /payment-success/:paymentOrderId
     *
     * Example URL:
     * GET /payment-success/1552?razorpay_payment_id=pay_XXX&razorpay_payment_link_id=plink_XXX
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<?> verifyPayment(
            @PathVariable("orderId") Long orderId,  // This is your PaymentOrder.id
            @RequestParam("razorpay_payment_id") String razorpayPaymentId,
            @RequestParam("razorpay_payment_link_id") String razorpayPaymentLinkId) {

        logger.info("Verifying payment for PaymentOrder ID: {} | Razorpay Payment ID: {}",
                orderId, razorpayPaymentId);

        try {
            // Find PaymentOrder using Razorpay's payment_link_id (most reliable)
            PaymentOrder paymentOrder = paymentService.getPaymentOrderPaymentId(razorpayPaymentLinkId);

            if (paymentOrder == null) {
                logger.warn("PaymentOrder not found for razorpay_payment_link_id: {}", razorpayPaymentLinkId);
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "message", "Invalid payment link ID"));
            }

            // Optional: extra safety – ensure the IDs match
            if (!paymentOrder.getId().equals(orderId)) {
                logger.warn("Mismatch: URL paymentOrderId {} ≠ DB paymentOrderId {}", orderId, paymentOrder.getId());
            }

            boolean success = paymentService.ProcessPayment(paymentOrder, razorpayPaymentId, razorpayPaymentLinkId);

            if (success) {
                logger.info("Payment SUCCESS for PaymentOrder ID: {}", paymentOrder.getId());
                return ResponseEntity.ok(Map.of(
                        "success", true,
                        "message", "Payment Successful!",
                        "paymentOrderId", paymentOrder.getId(),
                        "razorpayPaymentId", razorpayPaymentId
                ));
            } else {
                logger.info("Payment already processed or failed for PaymentOrder ID: {}", paymentOrder.getId());
                return ResponseEntity.ok(Map.of(  // 200 so frontend stops polling
                        "success", false,
                        "message", "Payment failed or already processed"
                ));
            }

        } catch (Exception e) {
            logger.error("Error during payment verification", e);
            return ResponseEntity.status(500)
                    .body(Map.of("success", false, "message", "Internal server error"));
        }
    }
}