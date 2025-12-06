package com.grid.service.impl;

import com.grid.modal.HomeCategory;
import com.grid.repository.HomeCategoryRepository;
import com.grid.service.HomeCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class HomeCategoryServiceImpl implements HomeCategoryService {

    private final HomeCategoryRepository homeCategoryRepository;


    @Override
    public HomeCategory createHomeCategory(HomeCategory homeCategory) {
        return homeCategoryRepository.save(homeCategory);
    }

    @Override
    public List<HomeCategory> createCategories(List<HomeCategory> homeCategories) {
        if (homeCategoryRepository.findAll().isEmpty()){
            return homeCategoryRepository.saveAll(homeCategories);
        }
        return homeCategoryRepository.findAll();
    }

    @Override
    public HomeCategory updateHomeCategory(HomeCategory category, Long id) throws Exception {
        HomeCategory exitingCategory = homeCategoryRepository.findById(id).orElseThrow(()->new Exception("Category not found.."));
        if (category.getImage()!=null){
            exitingCategory.setImage(category.getImage());
        }
        if (category.getCategoryId()!=null) {
            exitingCategory.setCategoryId(category.getCategoryId());
        }
        return homeCategoryRepository.save(exitingCategory);
    }

    @Override
    public List<HomeCategory> getAllHomeCategory() {
        return homeCategoryRepository.findAll();
    }
}
