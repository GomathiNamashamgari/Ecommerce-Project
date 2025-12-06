package com.grid.service;

import com.grid.modal.HomeCategory;

import java.util.List;

public interface HomeCategoryService {
    HomeCategory createHomeCategory(HomeCategory homeCategory);
    List<HomeCategory> createCategories(List<HomeCategory> homeCategories);
    HomeCategory updateHomeCategory(HomeCategory category, Long id) throws Exception;
    List<HomeCategory> getAllHomeCategory();
}
