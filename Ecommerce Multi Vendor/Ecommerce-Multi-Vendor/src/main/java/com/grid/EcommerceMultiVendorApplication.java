package com.grid;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@EnableTransactionManagement
@SpringBootApplication
public class EcommerceMultiVendorApplication {

	public static void main(String[] args) {

        SpringApplication.run(EcommerceMultiVendorApplication.class, args);
	}

}
