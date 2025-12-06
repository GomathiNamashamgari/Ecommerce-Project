package com.grid.service;

import com.grid.modal.Home;
import com.grid.modal.HomeCategory;

import java.util.List;

public interface HomeService {
    public Home createHomePageData(List<HomeCategory> allCategories);
}
