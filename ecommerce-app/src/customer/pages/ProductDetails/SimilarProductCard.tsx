import React from "react";

interface SimilarProductCardProps {
  product: any;
  onClick: () => void;
}

const SimilarProductCard: React.FC<SimilarProductCardProps> = ({
  product,
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition bg-white"
    >
      {/* IMAGE */}
      <img
        src={product?.images?.[0]}
        alt={product?.title}
        className="w-full h-[260px] object-cover"
      />

      {/* DETAILS */}
      <div className="p-3 space-y-1">
        <h3 className="text-sm font-semibold truncate">
          {product?.seller?.businessDetails?.businessName}
        </h3>

        <p className="text-sm text-gray-600 truncate">
          {product?.title}
        </p>

        <div className="flex items-center gap-2">
          <span className="font-bold text-gray-800">
            ₹{product?.sellingPrice}
          </span>

          <span className="line-through text-gray-400 text-sm">
            ₹{product?.mrpPrice}
          </span>

          <span className="text-primary-color text-sm font-semibold">
            {product?.discountPercent}%
          </span>
        </div>
      </div>
    </div>
  );
};

export default SimilarProductCard;
