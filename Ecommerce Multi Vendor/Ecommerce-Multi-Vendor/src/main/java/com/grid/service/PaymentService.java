package com.grid.service;

import com.grid.modal.Order;
import com.grid.modal.PaymentOrder;
import com.grid.modal.User;
import com.razorpay.PaymentLink;
import com.razorpay.RazorpayException;

import java.util.Set;

public interface PaymentService {

    PaymentOrder createOrder(User user, Set<Order> orders);
    PaymentOrder getPaymentOrderById(Long orderId) throws Exception;
    PaymentOrder getPaymentOrderPaymentId(String orderId) throws Exception;
    Boolean ProcessPayment(PaymentOrder paymentOrder,
                             String paymentId, String paymentLinkId) throws RazorpayException;
    PaymentLink createRazorpayPaymentLink(User user, Long amount,
                                      Long orderId) throws RazorpayException;

}
