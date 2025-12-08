import { Deal } from "./DealTypes";

export interface HomeData {
    id:number;
    grid: HomeCategory[];
    shopByCategories: HomeCategory[];
    electricCategories:HomeCategory[];
    deals: Deal[];
    dealCategories: HomeCategory[];
}
export interface HomeCategory {
    id?:number | string ;
    categoryId?:string;
    section?:string;
    name?:string;
    image?: string;
    parcentCategoryId?:string;
}