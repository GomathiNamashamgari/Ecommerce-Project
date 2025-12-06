package com.grid.modal;

import com.fasterxml.jackson.annotation.JsonIgnore; // Add this import
import com.grid.domain.AccountStatus;
import com.grid.domain.USER_ROLE;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class Seller {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String sellerName;

    @Column(unique = true, nullable = false)
    private String email;

    private Long mobile;

    @Embedded
    private BusinessDetails businessDetails = new BusinessDetails();

    @Embedded
    private BankDetails bankDetails = new BankDetails();

    @OneToOne(cascade = CascadeType.ALL)
    private Address pickupAddress = new Address();

    private String GSTIN;

    private USER_ROLE role = USER_ROLE.ROLE_SELLER;

    private boolean isEmailVerified = false;

    private AccountStatus accountStatus = AccountStatus.PENDING_VERIFICATION;

    @OneToMany(mappedBy = "seller", cascade = CascadeType.ALL)
    @JsonIgnore // FIX: Prevents JSON serialization of lazy collection, avoiding Hibernate session error
    private List<Order> orders = new ArrayList<>();

    private String password;

    // ... (any other fields)
}
