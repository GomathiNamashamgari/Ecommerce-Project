package com.grid.modal;

import com.grid.domain.PaymentMethod;
import com.grid.domain.PaymentOrderStatus;
import jakarta.persistence.*;
import lombok.*;
import org.aspectj.weaver.ast.Or;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(exclude = {"orders"})
public class PaymentOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Long amount;

    private PaymentOrderStatus status = PaymentOrderStatus.PENDING;

    private PaymentMethod paymentMethod;

    private String paymentLinkId;

    private String paymentLinkUrl;


    @ManyToOne
    private  User user;

    @OneToMany(mappedBy = "paymentOrder", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Set<Order> orders = new HashSet<>();


    @ManyToOne
    @JoinColumn(name = "seller_id")
    private Seller seller;



}
