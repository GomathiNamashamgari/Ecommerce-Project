package com.grid.service.impl;

import com.grid.Exception.SellerException;
import com.grid.config.JwtProvider;
import com.grid.domain.AccountStatus;
import com.grid.domain.USER_ROLE;
import com.grid.modal.Address;
import com.grid.modal.Seller;
import com.grid.repository.AddressRepository;
import com.grid.repository.SellerRepository;
import com.grid.service.SellerService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SellerServiceImpl implements SellerService {

    private final SellerRepository sellerRepository;
    private final JwtProvider jwtProvider;
    private final PasswordEncoder passwordEncoder;
    private final AddressRepository addressRepository;

    @Override
    public Seller getSellerProfile(String jwt) throws Exception {
        String email = jwtProvider.getEmailFromJwtToken(jwt); // NOW WORKS
        Seller seller = sellerRepository.findByEmail(email);
        if (seller == null) {
            throw new Exception("Seller not found");
        }
        return seller;
    }

    @Override
    public Seller createSeller(Seller seller) throws Exception {
        Seller sellerExist = sellerRepository.findByEmail(seller.getEmail());
        if (sellerExist != null) {
            throw new Exception("Seller already exists, use a different email");
        }

        Address savedAddress = addressRepository.save(seller.getPickupAddress());

        Seller newSeller = new Seller();
        newSeller.setEmail(seller.getEmail());
        newSeller.setPassword(passwordEncoder.encode(seller.getPassword()));
        newSeller.setSellerName(seller.getSellerName());
        newSeller.setPickupAddress(savedAddress);
        newSeller.setGSTIN(seller.getGSTIN());
        newSeller.setRole(USER_ROLE.ROLE_SELLER);
        newSeller.setMobile(seller.getMobile());
        newSeller.setBankDetails(seller.getBankDetails());
        newSeller.setBusinessDetails(seller.getBusinessDetails());

        return sellerRepository.save(newSeller);
    }

    @Override
    public Seller getSellerById(Long id) throws SellerException {
        return sellerRepository.findById(id)
                .orElseThrow(() -> new SellerException("Seller not found with id " + id));
    }

    @Override
    public Seller getSellerByEmail(String email) throws Exception {
        Seller seller = sellerRepository.findByEmail(email);
        if (seller == null) {
            return null; // FIX: Return null instead of throwing exception to avoid 500
        }
        return seller;
    }

    @Override
    public List<Seller> getAllSellers(AccountStatus status) {
        if (status != null) {
            return sellerRepository.findByAccountStatus(status);
        }
        return sellerRepository.findAll();
    }

    @Override
    public Seller updateSeller(Long id, Seller seller) throws Exception {
        Seller existingSeller = this.getSellerById(id);

        if (seller.getSellerName() != null) {
            existingSeller.setSellerName(seller.getSellerName());
        }
        if (seller.getMobile() != null) {
            existingSeller.setMobile(seller.getMobile());
        }
        if (seller.getEmail() != null) {
            existingSeller.setEmail(seller.getEmail());
        }
        if (seller.getPassword() != null && !seller.getPassword().isBlank()) {
            existingSeller.setPassword(passwordEncoder.encode(seller.getPassword()));
        }

        if (seller.getBusinessDetails() != null) {
            if (seller.getBusinessDetails().getBusinessName() != null)
                existingSeller.getBusinessDetails().setBusinessName(seller.getBusinessDetails().getBusinessName());
            if (seller.getBusinessDetails().getBusinessEmail() != null)
                existingSeller.getBusinessDetails().setBusinessEmail(seller.getBusinessDetails().getBusinessEmail());
            if (seller.getBusinessDetails().getBusinessMobile() != null)
                existingSeller.getBusinessDetails().setBusinessMobile(seller.getBusinessDetails().getBusinessMobile());
            if (seller.getBusinessDetails().getBusinessAddress() != null)
                existingSeller.getBusinessDetails().setBusinessAddress(seller.getBusinessDetails().getBusinessAddress());
            if (seller.getBusinessDetails().getLogo() != null)
                existingSeller.getBusinessDetails().setLogo(seller.getBusinessDetails().getLogo());
            if (seller.getBusinessDetails().getBanner() != null)
                existingSeller.getBusinessDetails().setBanner(seller.getBusinessDetails().getBanner());
        }

        if (seller.getBankDetails() != null) {
            if (seller.getBankDetails().getAccountHolderName() != null)
                existingSeller.getBankDetails().setAccountHolderName(seller.getBankDetails().getAccountHolderName());
            if (seller.getBankDetails().getAccountNumber() != null)
                existingSeller.getBankDetails().setAccountNumber(seller.getBankDetails().getAccountNumber());
            if (seller.getBankDetails().getIfsCode() != null)
                existingSeller.getBankDetails().setIfsCode(seller.getBankDetails().getIfsCode());
        }

        if (seller.getPickupAddress() != null) {
            Address pickup = existingSeller.getPickupAddress();
            Address incoming = seller.getPickupAddress();
            if (incoming.getAddress() != null) pickup.setAddress(incoming.getAddress());
            if (incoming.getMobile() != null) pickup.setMobile(incoming.getMobile());
            if (incoming.getCity() != null) pickup.setCity(incoming.getCity());
            if (incoming.getState() != null) pickup.setState(incoming.getState());
            if (incoming.getPinCode() != null) pickup.setPinCode(incoming.getPinCode());
            if (incoming.getLocality() != null) pickup.setLocality(incoming.getLocality());
        }

        if (seller.getGSTIN() != null) {
            existingSeller.setGSTIN(seller.getGSTIN());
        }


        return sellerRepository.save(existingSeller);
    }

    @Override
    public void deleteSeller(Long id) throws Exception {
        Seller seller = getSellerById(id);
        sellerRepository.delete(seller);
    }

    @Override
    public Seller verifyEmail(String email, String otp) throws Exception {
        Seller seller = getSellerByEmail(email);
        seller.setEmailVerified(true);
        return sellerRepository.save(seller);
    }

    @Override
    public Seller updateSellerAccountStatus(Long sellerId, AccountStatus status) throws Exception {
        Seller seller = getSellerById(sellerId);
        seller.setAccountStatus(status);
        return sellerRepository.save(seller);
    }
}
