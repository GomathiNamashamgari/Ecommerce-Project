import { HomeCategory } from "./HomeCategoryTypes";

export interface Deal{
    id?:number;
    discount:number;
    category:HomeCategory
    
}

export interface ApiResponse{
    message:string;
    status:boolean;
}
export interface DealState{
    deals: Deal[];
    loading:boolean;
    error:string | null;
    dealCreated:boolean;
    dealUpdated:boolean;
}