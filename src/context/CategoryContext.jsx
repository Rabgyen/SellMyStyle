import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CategoryContext = createContext();

export const useCategoryContext = () => useContext(CategoryContext);

export const CategoryProvider = ({ children }) => {
  const [category, setCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categoryResponse = await axios.get(
          "http://localhost:5000/product/product_categories",
        );
        setCategories(categoryResponse.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategory();
  }, []);

  return (
    <CategoryContext.Provider
      value={{ category, setCategory, searchTerm, setSearchTerm, categories, setCategories }}
    >
      {children}
    </CategoryContext.Provider>
  );
};
