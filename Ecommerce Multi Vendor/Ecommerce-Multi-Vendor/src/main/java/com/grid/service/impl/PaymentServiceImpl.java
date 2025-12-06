package com.grid.service.impl;

import com.grid.domain.PaymentOrderStatus;
import com.grid.domain.PaymentStatus;
import com.grid.modal.Order;
import com.grid.modal.PaymentOrder;
import com.grid.modal.User;
import com.grid.repository.OrderRepository;
import com.grid.repository.PaymentOrderRepository;
import com.grid.service.PaymentService;
import com.razorpay.Payment;
import com.razorpay.PaymentLink;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class PaymentServiceImpl implements PaymentService {

    private final PaymentOrderRepository paymentOrderRepository;
    private final OrderRepository orderRepository;

    @Value("${razorpay.key.id}")
    private String apiKey;

    @Value("${razorpay.key.secret}")
    private String apiSecret;

    @Override
    public PaymentOrder createOrder(User user, Set<Order> orders) {
        Long amount = orders.stream().mapToLong(Order::getTotalSellingPrice).sum();
        PaymentOrder paymentOrder = new PaymentOrder();
        paymentOrder.setAmount(amount);
        paymentOrder.setUser(user);
        paymentOrder.setOrders(new HashSet<>(orders));
        paymentOrder.setStatus(PaymentOrderStatus.PENDING);
        return paymentOrderRepository.save(paymentOrder);
    }

    @Override
    public PaymentOrder getPaymentOrderById(Long id) throws Exception {
        return paymentOrderRepository.findById(id)
                .orElseThrow(() -> new Exception("Payment order not found with ID: " + id));
    }

    @Override
    public PaymentOrder getPaymentOrderPaymentId(String paymentLinkId) throws Exception {
        PaymentOrder paymentOrder = paymentOrderRepository.findByPaymentLinkId(paymentLinkId);
        if (paymentOrder == null) {
            throw new Exception("Payment order not found for payment link ID: " + paymentLinkId);
        }
        return paymentOrder;
    }

    @Override
    @Transactional
    public Boolean ProcessPayment(PaymentOrder paymentOrder, String paymentId, String paymentLinkId) throws RazorpayException {
        if (paymentOrder == null || !paymentOrder.getStatus().equals(PaymentOrderStatus.PENDING)) {
            return false;
        }

        RazorpayClient razorpay = new RazorpayClient(apiKey, apiSecret);
        Payment payment = razorpay.payments.fetch(paymentId);

        String status = payment.get("status");
        System.out.println("Razorpay Payment Status: " + status + " | Payment ID: " + paymentId);

        List<Order> orderList = orderRepository.findByPaymentOrder(paymentOrder);
        Set<Order> orders = new HashSet<>(orderList);

        if ("captured".equalsIgnoreCase(status)) {
            for (Order order : orders) {
                order.setPaymentStatus(PaymentStatus.COMPLETED);
            }
            paymentOrder.setStatus(PaymentOrderStatus.SUCCESS);
            paymentOrder.setPaymentLinkId(paymentId);

            orderRepository.saveAll(orders);
            paymentOrderRepository.save(paymentOrder);

            System.out.println("Payment SUCCESSFUL for Payment Link: " + paymentLinkId);
            return true;
        } else {
            for (Order order : orders) {
                order.setPaymentStatus(PaymentStatus.FAILED);
            }
            paymentOrder.setStatus(PaymentOrderStatus.FAILED);
            paymentOrder.setPaymentLinkId(paymentId);

            orderRepository.saveAll(orders);
            paymentOrderRepository.save(paymentOrder);

            System.out.println("Payment FAILED for Payment Link: " + paymentLinkId);
            return false;
        }
    }

    @Override
    public PaymentLink createRazorpayPaymentLink(User user, Long amount, Long orderId) throws RazorpayException {
        long amountInPaise = amount * 100;

        RazorpayClient razorpay = new RazorpayClient(apiKey, apiSecret);

        JSONObject paymentLinkRequest = new JSONObject();
        paymentLinkRequest.put("amount", amountInPaise);
        paymentLinkRequest.put("currency", "INR");
        paymentLinkRequest.put("accept_partial", false);

        // Set expire_by reliably 20 minutes in the future
        long expireBy = Instant.now().plus(20, ChronoUnit.MINUTES).getEpochSecond();
        paymentLinkRequest.put("expire_by", expireBy);

        // Customer details
        JSONObject customer = new JSONObject();
        customer.put("name", user.getFullName() != null ? user.getFullName() : "Customer");
        customer.put("email", user.getEmail());
        customer.put("contact", user.getMobile());
        paymentLinkRequest.put("customer", customer);

        // Notifications
        JSONObject notify = new JSONObject();
        notify.put("sms", true);
        notify.put("email", true);
        paymentLinkRequest.put("notify", notify);

        // Updated callback URL to match your app's port (5424)
        // In PaymentServiceImpl.java → change this:
        // Inside PaymentServiceImpl.java → createRazorpayPaymentLink()

        paymentLinkRequest.put("callback_url", "http://localhost:3000/payment-success/" + orderId);
        paymentLinkRequest.put("callback_method", "get");

        // Description
        paymentLinkRequest.put("description", "Order Payment #" + orderId);

        PaymentLink paymentLink = razorpay.paymentLink.create(paymentLinkRequest);

        String paymentLinkId = paymentLink.get("id");
        String paymentLinkUrl = paymentLink.get("short_url");

        // Save Razorpay's payment_link_id to your PaymentOrder
        PaymentOrder paymentOrder = paymentOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("PaymentOrder not found: " + orderId));

        paymentOrder.setPaymentLinkId(paymentLinkId);
        paymentOrder.setPaymentLinkUrl(paymentLinkUrl);
        paymentOrderRepository.save(paymentOrder);

        return paymentLink;
    }
}