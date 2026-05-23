import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const useCartContext = () => useContext(CartContext);

export const CartProvider = ({children}) => {
    const [cart, setCart] = useState(() => {
        const storedCart = localStorage.getItem('cart');
        return storedCart? JSON.parse(storedCart) : [];
    })

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (item) => {
        setCart(prev => [...prev, item]);
    }

    const removeFromCart = (id) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    }

    const inCart = (id) => {
        return cart.some(item => item.id === id)
    }

    let totalamount = 0;

    cart.forEach(item => {
        totalamount += item.price
    })

    const value ={
        cart,
        addToCart,
        removeFromCart,
        inCart,
        totalamount,
    }

    return(
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}