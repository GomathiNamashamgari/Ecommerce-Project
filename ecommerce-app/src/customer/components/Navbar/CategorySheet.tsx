// CategorySheet.tsx
import { Box } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { electronicsLevelThree } from "../../../data/category/levelThree/electronicsLevelThree";
import { homeLevelThree } from "../../../data/category/levelThree/homeLevelThree";
import { menLevelThree } from "../../../data/category/levelThree/menLevelThree";
import { womenLevelThree } from "../../../data/category/levelThree/womenLevelThree";
import { electronicsLevelTwo } from "../../../data/category/levelTwo/electronicsLevelTwo";
import { homeLevelTwo } from "../../../data/category/levelTwo/homeLevelTwo";
import { menLevelTwo } from "../../../data/category/levelTwo/menLevelTwo";
import { womenLevelTwo } from "../../../data/category/levelTwo/womenLevelTwo";

const categoryTwo: { [key: string]: any[] } = {
  men: menLevelTwo,
  women: womenLevelTwo,
  home_furniture: homeLevelTwo,
  electronics: electronicsLevelTwo,
};

const categoryThree: { [key: string]: any[] } = {
  men: menLevelThree,
  women: womenLevelThree,
  home_furniture: homeLevelThree,
  electronics: electronicsLevelThree,
};

const CategorySheet = ({ selectedCategory,setShowSheet }: any) => {
  const navigate=useNavigate()
  const childCategory = (category: any, parentCategoryId: any) => {
    return category.filter(
      (child:any) => child.parentCategoryId === parentCategoryId
    );
  };

  // Defensive check if category exists
  if (!categoryTwo[selectedCategory] || !categoryThree[selectedCategory]) {
    return null;
  }

  return (
    <Box
      className="bg-white text-black shadow-lg lg:h-[500px] overflow-y-auto p-10"
      sx={{ zIndex: 2 }}
    >
      <div className="flex text-sm gap-10 flex-wrap">
        {categoryTwo[selectedCategory].map((item:any, index) => (
  <div
    key={item.categoryId} 
    className={`p-8 lg:w-[20%] ${index % 2 === 0 ? "bg-slate-50" : "bg-white"}`}
  >
    <p className="text-primary-color font-semibold mb-5">{item.name}</p>

    <ul className="space-y-3">
      {childCategory(categoryThree[selectedCategory], item.categoryId).map((child:any) => (
        <li
          key={child.categoryId}
          onClick={() => navigate("/products/" + child.categoryId)}
          className="cursor-pointer hover:text-primary-color"
        >
          {child.name}
        </li>
      ))}
    </ul>

  </div>
))}

      </div>
    </Box>
  );
};

export default CategorySheet;
