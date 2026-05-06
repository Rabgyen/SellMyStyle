import { createContext, useContext, useEffect, useState } from "react";

const FavoriteContext = createContext();

export const useFavoriteContext = () => useContext(FavoriteContext);

export const FavoriteProvider = ( {children} ) => {
    
    const [favorite, setFavorite] = useState(() => {
        const storedFav = localStorage.getItem('favorite');
        return storedFav ? JSON.parse(storedFav) : [];
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
        favorite,
        addToFavorite,
        removeFromFavorite,
        isFavorite
    }

    return(
        <FavoriteContext.Provider value = {value} >{children}</FavoriteContext.Provider>
    )
}