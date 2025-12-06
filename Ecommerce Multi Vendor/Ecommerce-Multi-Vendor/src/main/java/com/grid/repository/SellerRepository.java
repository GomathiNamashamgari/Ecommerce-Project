package com.grid.repository;

import com.grid.domain.AccountStatus;
import com.grid.modal.Seller;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SellerRepository extends JpaRepository<Seller, Long> {

    Seller findByEmail(String email); // ✅ Case-insensitive
    List<Seller> findByAccountStatus(AccountStatus status);
}

