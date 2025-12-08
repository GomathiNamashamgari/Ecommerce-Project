import { CartItem } from "../types/CartTypes";

export const sumCartItemMrpPrice = (cartItems:CartItem[])=>{
    return cartItems.reduce((acc,item)=>acc+item.mrpPrice*item.quantity,0)
}