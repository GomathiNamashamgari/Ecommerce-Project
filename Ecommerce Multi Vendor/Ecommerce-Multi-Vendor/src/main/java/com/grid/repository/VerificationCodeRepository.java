package com.grid.repository;

import com.grid.modal.VerificationCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface VerificationCodeRepository extends JpaRepository<VerificationCode,Long> {

    List<VerificationCode> findAllByEmail(String email);
    VerificationCode findByEmail(String email);


    @Modifying
    @Transactional
    @Query("DELETE FROM VerificationCode v WHERE v.email = :email")
    void deleteAllByEmail(@Param("email") String email);




    VerificationCode findByOtp(String otp);
}
