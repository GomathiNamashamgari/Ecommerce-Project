import React from 'react';

const CategoryGrid = () => {
  return (
    <div className="grid grid-cols-12 grid-rows-12 gap-4 lg:h-[600px] px-5 lg:px-20">
      
      <div className="col-span-3 row-span-12">
        <img
          src="https://rukminim2.flixcart.com/image/832/832/xif0q/sari/z/z/h/-original-imaheycye7dsy8z7.jpeg?q=70&crop=false"
          alt="Sari"
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      
      <div className="col-span-2 row-span-6">
        <img
          src="https://rukminim2.flixcart.com/image/612/612/xif0q/shoe/v/d/f/10-g-1003-10-0-zixer-white-original-imahhnd6chwyzyyp.jpeg?q=70"
          alt="Shoes"
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      <div className="col-span-4 row-span-6">
        <img
          src="https://images.pexels.com/photos/27155550/pexels-photo-27155550.jpeg"
          alt="Model"
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      <div className="col-span-3 row-span-12">
        <img
          src="https://assets2.andaazfashion.com/media/catalog/product/cache/1/thumbnail/500x750/a12781a7f2ccb3d663f7fd01e1bd2e4e/j/a/jacquard-dusty-blue-weaved-jacket-style-mens-sherwani-mstv03574-1.jpg"
          alt="Sherwani"
          className="w-full h-full object-cover rounded-md"
        />
      </div>

     
      <div className="col-span-4 row-span-6">
        <img
          src="https://media.istockphoto.com/id/1276740606/photo/indian-traditional-gold-necklace-with-earrings.jpg?s=612x612&w=0&k=20&c=S3602ImAUY4KXSwJcXreMLfxxSVKDC2oTYZKL0aoIKY="
          alt="Jewelry"
          className="w-full h-full object-cover rounded-md"
        />
      </div>

      <div className="col-span-2 row-span-6">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSqLldHkVnsfbm4YSDrSEOAXnv1kBQWqVqCGDbVXtMlPSgM9vUkxlKedp1pq1FeLZURXyM&usqp=CAU"
          alt="Sandals"
          className="w-full h-full object-cover rounded-md"
        />
      </div>
    </div>
  );
};

export default CategoryGrid;
