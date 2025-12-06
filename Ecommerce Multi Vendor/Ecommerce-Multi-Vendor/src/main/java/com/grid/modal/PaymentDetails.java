package com.grid.modal;

import com.grid.domain.PaymentStatus;
import lombok.Data;

@Data
public class PaymentDetails {

    private String paymentId;
    private String razorpayPaymentLinkId;
    private  String razorpayPaymentReferenceId;
    private String razorpayPaymentLinkStatus;
    private String razorpayPaymentIdZWSP;
    private PaymentStatus status;
}
