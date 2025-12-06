package com.grid.response;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentLinkResponse {

    private String payment_link_url;
    private String payment_link_id;

}
