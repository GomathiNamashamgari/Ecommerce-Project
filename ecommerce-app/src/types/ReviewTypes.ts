import { Product } from "./ProductTypes";
import { User } from "./UserTypes";

export interface Review {
  id: number;
  reviewText: string;
  rating: number;
  productImages: string[];
  user: User;
 product:Product;
}

export interface CreateReviewRequest {
  reviewText: string;
  reviewRating: number;
  productImage: string[];
}
