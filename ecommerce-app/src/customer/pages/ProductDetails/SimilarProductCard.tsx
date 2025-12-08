import React from 'react'

const SimilarProductCard = () => {
  return (
    <div><div className='group px-4 relative'>
        <div className='card'
            
            >
            <img 
            className='card-media object-top'
            src={"https://m.media-amazon.com/images/I/81DEE+ytZ6L._SY879_.jpg"} 
            alt="" 
        
            />

              
            
        </div>
        <div className='details pt-3 space-y-1 group-hover-effect rounded-md'>
            <div className='name'>
                <h1>Elite Weaves Store</h1>
                <p>  Maharashtrian Chandrakor Swan Paithani Silk Zari Woven Saree  
                    </p>

            </div>
            <div className='price flex items-center gap-3'>

                <span className='font-sans text-gray-800'>
                    ₹ 1910
                </span>
                <span className='line-through text-gray-400'>
                    ₹ 6998
                </span>
                <span className='text-primary-color font-semibold'>
                    73%
                </span>

            </div>

        </div>

    </div></div>
  )
}

export default SimilarProductCard