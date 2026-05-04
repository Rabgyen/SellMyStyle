import { createContext, useContext, useEffect, useState } from "react";

const FavoriteContext = createContext();

export const useFavoriteContext = () => useContext(FavoriteContext);

export const FavoriteProvider = ( {children} ) => {
    
    const [favorite, setFavorite] = useState(() => {
        const storeFav = localStorage.getItem('favorite');
        return storeFav ? JSON.parse(storeFav) : [];
    })

    useEffect(() => {
        localStorage.setItem('favorite', JSON.stringify(favorite));
    }, [favorite])

    const addToFavorite = (item) => {
        setFavorite((prev) => [...prev, item])
    }

    const removeFromFavorite = (id) => {
        setFavorite((prev) => prev.filter(item => item.id !== id))
    }

    const isFavorite = (id) => {
        return favorite.some(item => item.id === id)
    }

    const value = {
        addToFavorite,
        removeFromFavorite,
        isFavorite
    }

    return(
        <FavoriteContext.Provider value = {value} >{children}</FavoriteContext.Provider>
    )
}