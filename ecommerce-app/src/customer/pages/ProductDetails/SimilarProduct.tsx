import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../State/Store";
import { fetchAllProducts } from "../../../State/customer/ProductSlice";
import SimilarProductCard from "./SimilarProductCard";

const SimilarProduct = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { productId } = useParams<{ productId: string }>();

  const products = useAppSelector(
    (store) => store.product.products
  );

  useEffect(() => {
    dispatch(fetchAllProducts({}));
  }, [dispatch]);

  // remove current product
  const filteredProducts = products?.filter(
    (p: any) => p.id !== Number(productId)
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {filteredProducts?.slice(0, 6).map((item: any) => (
        <SimilarProductCard
          key={item.id}
          product={item}
          onClick={() => navigate(`/product-details/${item.id}`)}
        />
      ))}
    </div>
  );
};

export default SimilarProduct;
