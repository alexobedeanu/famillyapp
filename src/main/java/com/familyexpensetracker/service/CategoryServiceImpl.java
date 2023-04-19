package com.familyexpensetracker.service;

import com.familyexpensetracker.dto.CategoryDTO;
import com.familyexpensetracker.model.Category;
import com.familyexpensetracker.repository.CategoryRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryServiceImpl implements CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        Category category = new Category();
        BeanUtils.copyProperties(categoryDTO, category);
        Category savedCategory = categoryRepository.save(category);
        CategoryDTO savedCategoryDTO = new CategoryDTO();
        BeanUtils.copyProperties(savedCategory, savedCategoryDTO);
        return savedCategoryDTO;
    }

    @Override
    public CategoryDTO updateCategory(Long id, CategoryDTO categoryDTO) {
        Optional<Category> existingCategory = categoryRepository.findById(id);
        if (existingCategory.isPresent()) {
            Category updatedCategory = existingCategory.get();
            BeanUtils.copyProperties(categoryDTO, updatedCategory);
            updatedCategory.setId(id);
            Category savedCategory = categoryRepository.save(updatedCategory);
            CategoryDTO savedCategoryDTO = new CategoryDTO();
            BeanUtils.copyProperties(savedCategory, savedCategoryDTO);
            return savedCategoryDTO;
        } else {
            return null;
        }
    }

    @Override
    public CategoryDTO getCategoryById(Long id) {
        Optional<Category> category = categoryRepository.findById(id);
        if (category.isPresent()) {
            CategoryDTO categoryDTO = new CategoryDTO();
            BeanUtils.copyProperties(category.get(), categoryDTO);
            return categoryDTO;
        } else {
            return null;
        }
    }

    @Override
    public List<CategoryDTO> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        List<CategoryDTO> categoryDTOs = new ArrayList<>();
        for (Category category : categories) {
            CategoryDTO categoryDTO = new CategoryDTO();
            BeanUtils.copyProperties(category, categoryDTO);
            categoryDTOs.add(categoryDTO);
        }
        return categoryDTOs;
    }

    @Override
    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}
