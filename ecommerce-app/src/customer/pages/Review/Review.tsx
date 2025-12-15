import React, { useEffect, useState } from "react";
import { Divider } from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import ReviewCard from "./ReviewCard";
import { Review } from "../../../types/ReviewTypes";

const ReviewPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!productId) return;

    axios
      .get<Review[]>(`/review/products/${productId}/reviews`)
      .then(res => setReviews(res.data))
      .finally(() => setLoading(false));
  }, [productId]);

  return (
    <div className="p-5 lg:px-20">
      {loading ? (
        <p>Loading reviews...</p>
      ) : reviews.length === 0 ? (
        <p>No reviews yet</p>
      ) : (
        reviews.map(review => (
          <div key={review.id} className="space-y-3">
            <ReviewCard review={review} />
            <Divider />
          </div>
        ))
      )}
    </div>
  );
};

export default ReviewPage;
