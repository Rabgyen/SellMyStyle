import { createContext, useContext, useState } from "react";

const CategoryContext = createContext();

export const useCategoryContext = () => useContext(CategoryContext);

export const CategoryProvider = ({ children }) => {
  const [category, setCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <CategoryContext.Provider value={{ category, setCategory, searchTerm, setSearchTerm }}>
      {children}
    </CategoryContext.Provider>
  );
};