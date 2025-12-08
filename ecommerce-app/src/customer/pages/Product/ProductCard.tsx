import React, { useEffect, useState } from 'react'
import { Button } from '@mui/material'
import { Favorite, ModeComment } from '@mui/icons-material'
import "./ProductCard.css"
import { pink } from '@mui/material/colors'
import { Product } from '../../../types/ProductTypes';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../State/Store'
import { addProductToWishlist } from '../../../State/customer/WishlistSlice'

const ProductCard = ({ item }: { item: Product }) => {
    const [currentImage, setCurrentImage] = useState(0)
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    useEffect(() => {
        let interval: any;

        if (isHovered && item.images?.length > 0) {
            interval = setInterval(() => {
                setCurrentImage((prev) => (prev + 1) % item.images.length);
            }, 1000);
        }

        return () => clearInterval(interval);
    }, [isHovered, item.images]);

    // ---------- FIXED NAVIGATION ----------
    const handleProductClick = () => {
        const productId = Number(item.id);

        if (!productId || isNaN(productId)) {
            console.error("❌ Invalid product ID:", item.id);
            return;
        }

        const title = encodeURIComponent(item.title);
        const image = encodeURIComponent(item.images?.[0] || "no-image");

        navigate(`/product-details/${productId}`);
    };
    // ------------------------------------

    const handleWishlist =(e:any) =>{
        e.stopPropagation();
        item.id && dispatch(addProductToWishlist({productId: item.id }))
    }

    return (
        <div onClick={handleProductClick} className='group px-4 relative'>
            <div className='card'
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {item.images?.map((img, index) => (
                    <img
                        key={index}
                        className='card-media object-top'
                        src={img}
                        alt=""
                        style={{ transform: `translateX(${(index - currentImage) * 100}%)` }}
                    />
                ))}

                {isHovered && (
                    <div className='indicator flex flex-col item-center space-y-2'>
                        <div className='flex gap-3'>
                            <Button onClick={handleWishlist} variant="contained" sx={{ backgroundColor: pink[500] }}>
                                <Favorite sx={{ color: 'white' }} />
                            </Button>

                            <Button variant="contained" sx={{ backgroundColor: pink[500] }}>
                                <ModeComment sx={{ color: 'white' }} />
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <div className='details pt-3 space-y-1 group-hover-effect rounded-md'>
                <div className='name'>
                    <h1>{item.seller?.businessDetails?.businessName}</h1>
                    <p>{item.title}</p>
                </div>

                <div className='price flex items-center gap-3'>
                    <span className='font-sans text-gray-800'>₹ {item.sellingPrice}</span>
                    <span className='thin-line-through text-gray-400'>₹ {item.mrpPrice}</span>
                    <span className='text-primary-color font-semibold'>{item.discountPercent}%</span>
                </div>
            </div>
        </div>
    )
}

export default ProductCard;
