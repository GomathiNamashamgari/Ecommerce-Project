package com.grid.repository;

import com.grid.modal.Order;
import com.grid.modal.PaymentOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByUser_Id(Long userId);
    List<Order> findBySeller_Id(Long sellerId);

    // New method for explicit fetching by PaymentOrder
    @Query("SELECT o FROM Order o WHERE o.paymentOrder = :paymentOrder")
    List<Order> findByPaymentOrder(@Param("paymentOrder") PaymentOrder paymentOrder);
}