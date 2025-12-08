import { CartItem } from "../types/CartTypes";

export const sumCartItemSellingPrice = (cartItems:CartItem[])=>{
    return cartItems.reduce((acc,item)=> acc+item.sellingPrice*item.quantity,0)    
}