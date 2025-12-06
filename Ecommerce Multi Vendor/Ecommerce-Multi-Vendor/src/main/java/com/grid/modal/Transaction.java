package com.grid.modal;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    private User Customer;

    @OneToOne
    private Order order;

    @ManyToOne
    @JoinColumn(name = "seller_id")
    private Seller seller;


    private LocalDateTime date = LocalDateTime.now();
}
