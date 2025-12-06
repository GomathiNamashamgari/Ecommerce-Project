package com.grid.service.impl;

import com.grid.Exception.ProductException;
import com.grid.modal.Category;
import com.grid.modal.Product;
import com.grid.modal.Seller;
import com.grid.repository.CategoryRepository;
import com.grid.repository.ProductRepository;
import com.grid.request.CreateProductRequest;
import com.grid.service.ProductService;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public Product createProduct(CreateProductRequest req, Seller seller) {
        // 🔹 1. Ensure seller is fully managed
        if (seller.getId() == null) {
            throw new IllegalArgumentException("Seller must be persisted in database");
        }

        // 🔹 2. Handle category hierarchy
        Category category1 = categoryRepository.findByCategoryId(req.getCategory());
        if (category1 == null) {
            category1 = new Category();
            category1.setCategoryId(req.getCategory());
            category1.setLevel(1);
            category1 = categoryRepository.save(category1);
        }

        Category category2 = categoryRepository.findByCategoryId(req.getCategory2());
        if (category2 == null) {
            category2 = new Category();
            category2.setCategoryId(req.getCategory2());
            category2.setLevel(2);
            category2.setParentCategory(category1);
            category2 = categoryRepository.save(category2);
        }

        Category category3 = categoryRepository.findByCategoryId(req.getCategory3());
        if (category3 == null) {
            category3 = new Category();
            category3.setCategoryId(req.getCategory3());
            category3.setLevel(3);
            category3.setParentCategory(category2);
            category3 = categoryRepository.save(category3);
        }

        // 🔹 3. Calculate discount percentage
        int discountPercent = calculateDiscountPercentage(req.getMrpPrice(), req.getSellingPrice());

        // 🔹 4. Create product object
        Product product = new Product();
        product.setSeller(seller);                  // must set seller
        product.setCategory(category3);             // must set category
        product.setTitle(req.getTitle());
        product.setDescription(req.getDescription());
        product.setMrpPrice(req.getMrpPrice());
        product.setSellingPrice(req.getSellingPrice());
        product.setQuantity(req.getQuantity());
        product.setColor(req.getColor());
        product.setSizes(req.getSizes());
        product.setImages(req.getImages() != null ? req.getImages() : new ArrayList<>());
        product.setDiscountPercent(discountPercent);
        product.setCreatedAt(LocalDateTime.now());

        // 🔹 5. Debug logging
        System.out.println("Creating product for seller id: " + seller.getId() + ", title: " + req.getTitle());

        // 🔹 6. Save product
        Product saved = productRepository.save(product);
        System.out.println("Saved product id: " + saved.getId() + ", seller id: " + saved.getSeller().getId());

        return saved;
    }





    private int calculateDiscountPercentage(int mrpPrice, int sellingPrice) {
        if(mrpPrice<=0){
            throw new IllegalArgumentException("Actual price must be greater than 0");
        }
        double discount=mrpPrice-sellingPrice;
        double discountPercentage=(discount/mrpPrice)*100;
        return (int)discountPercentage;
    }

    @Override
    public void deleteProduct(Long productId) throws ProductException {
        Product product=findProductById(productId);
        productRepository.delete(product);
    }

    @Override
    public Product updateProduct(Long productId, Product product) throws ProductException {
        findProductById(productId);
        product.setId(productId);
        return productRepository.save(product);
    }

    @Override
    public Product findProductById(Long productId) throws ProductException {
        return productRepository.findById(productId).orElseThrow(()->
                new ProductException("product not found with id "+productId));
    }

    @Override
    public List<Product> searchProduct(String query) {
        if (query == null || query.trim().isEmpty()) {
            return productRepository.findAll();
        }

        String q = "%" + query.toLowerCase().trim() + "%";

        Specification<Product> spec = (root, cq, cb) -> {
            List<Predicate> preds = new ArrayList<>();

            preds.add(cb.like(cb.lower(root.get("title")), q));
            preds.add(cb.like(cb.lower(root.get("color")), q));

            Join<Product, Category> cat = root.join("category", JoinType.LEFT);
            preds.add(cb.like(cb.lower(cat.get("categoryId")), q));

            Join<Category, Category> parent = cat.join("parentCategory", JoinType.LEFT);
            preds.add(cb.like(cb.lower(parent.get("categoryId")), q));

            return cb.or(preds.toArray(new Predicate[0]));
        };

        return productRepository.findAll(spec);
    }

    @Override
    public Page<Product> getAllProducts(String category, String brand, String color, String sizes,
                                        Integer minPrice, Integer maxPrice, Integer minDiscount,
                                        String sort, String stock, Integer pageNumber) {

        Specification<Product> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // COLOR
            if (color != null && !color.trim().isEmpty()) {
                predicates.add(cb.like(cb.lower(root.get("color")), "%" + color.toLowerCase().trim() + "%"));
            }

            // CATEGORY → USE categoryId (not name)
            if (category != null && !category.trim().isEmpty()) {
                String cat = category.toLowerCase().trim();
                Join<Product, Category> catJoin = root.join("category", JoinType.LEFT);
                Predicate level3 = cb.like(cb.lower(catJoin.get("categoryId")), "%" + cat + "%");

                Join<Category, Category> parent = catJoin.join("parentCategory", JoinType.LEFT);
                Predicate level2 = cb.like(cb.lower(parent.get("categoryId")), "%" + cat + "%");

                Join<Category, Category> grandParent = parent.join("parentCategory", JoinType.LEFT);
                Predicate level1 = cb.like(cb.lower(grandParent.get("categoryId")), "%" + cat + "%");

                predicates.add(cb.or(level1, level2, level3));
            }

            // SIZES
            if (sizes != null && !sizes.trim().isEmpty()) {
                String[] sizeArr = sizes.toLowerCase().split(",");
                List<Predicate> or = new ArrayList<>();
                for (String s : sizeArr) {
                    String size = s.trim();
                    if (!size.isEmpty()) {
                        or.add(cb.like(cb.lower(root.get("sizes")), "%" + size + "%"));
                    }
                }
                if (!or.isEmpty()) predicates.add(cb.or(or.toArray(new Predicate[0])));
            }

            // PRICE
            if (minPrice != null) predicates.add(cb.ge(root.get("sellingPrice"), minPrice));
            if (maxPrice != null) predicates.add(cb.le(root.get("sellingPrice"), maxPrice));

            // DISCOUNT
            if (minDiscount != null) predicates.add(cb.ge(root.get("discountPercent"), minDiscount));

            // STOCK
            if (stock != null && stock.equalsIgnoreCase("in_stock")) {
                predicates.add(cb.gt(root.get("quantity"), 0));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };

        Pageable pageable = PageRequest.of(pageNumber != null ? pageNumber : 0, 10);
        if (sort != null && sort.toLowerCase().contains("price")) {
            Sort s = sort.toLowerCase().contains("high") ? Sort.by("sellingPrice").descending()
                    : Sort.by("sellingPrice").ascending();
            pageable = PageRequest.of(pageNumber != null ? pageNumber : 0, 10, s);
        }

        Page<Product> page = productRepository.findAll(spec, pageable);
        System.out.println("Filtered " + page.getContent().size() + " products for color=" + color + ", category=" + category);
        return page;
    }
    @Override
    public List<Product> getProductBySellerId(Long sellerId) {
        return productRepository.findBySellerId(sellerId);
    }
}
