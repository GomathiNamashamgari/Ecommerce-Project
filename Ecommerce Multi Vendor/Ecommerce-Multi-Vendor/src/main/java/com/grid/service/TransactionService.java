package com.grid.service;

import com.grid.modal.Order;
import com.grid.modal.Seller;
import com.grid.modal.Transaction;

import java.util.List;

public interface TransactionService {

    Transaction createTransaction(Order order);
    List<Transaction> getTransactionsBySellerId(Seller seller);
    List<Transaction> getAllTransaction();
}
