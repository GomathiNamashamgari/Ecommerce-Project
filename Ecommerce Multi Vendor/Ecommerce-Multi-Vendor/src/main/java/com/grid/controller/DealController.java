package com.grid.controller;

import com.grid.modal.Deal;
import com.grid.response.ApiResponse;
import com.grid.service.DealService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/admin/deals")
public class DealController {

    private final DealService dealService;

    @GetMapping()
    public ResponseEntity<List<Deal>> getDeals(){
        List<Deal> createdDeals = dealService.getDeals();
        return new ResponseEntity<>(createdDeals,HttpStatus.ACCEPTED);
    }

    @PostMapping
    public ResponseEntity<Deal> createDeals(@RequestBody Deal deal)
    {
        Deal createdDeals=dealService.createDeal(deal);
        return new ResponseEntity<>(createdDeals, HttpStatus.ACCEPTED);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Deal> updateDeal(@PathVariable Long id, @RequestBody Deal deal) throws Exception {

        Deal updatedDeal = dealService.updateDeal(deal,id);
        return ResponseEntity.ok(updatedDeal);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> deleteDeal(@PathVariable Long id) throws Exception {

        dealService.deleteDeal(id);

        ApiResponse apiResponse=new ApiResponse();
        apiResponse.setMessage("Deal deleted");


        return new ResponseEntity<>(apiResponse,HttpStatus.ACCEPTED);
    }
}
