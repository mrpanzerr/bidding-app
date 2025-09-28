import { useEffect, useState } from "react";
import {
    addNewProduct,
    deleteProductById,
    fetchProducts,
    searchProducts,
    updateProductData,
} from "../firebase/productServices";

export function useProduct() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch products on mount
  useEffect(() => {
    const getProducts = async () => {
      const productList = await fetchProducts();
      setProducts(productList);
    };
    getProducts();
  }, []);

  // Trigger sever-side search
  useEffect(() => {
    if (!searchTerm) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      const results = await searchProducts(searchTerm);
      setSearchResults(results);
      setLoading(false);
    }, 300); // debounce 300ms

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Update a product in state and database
  const updateProduct = async (productId, updatedFields) => {
    // Optimistically update state
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, ...updatedFields } : p))
    );

    // Persist to database
    await updateProductData(productId, updatedFields);
  };

  // Delete a product from state and database
  const deleteProduct = async (productId) => {
    // Update state
    setProducts((prev) => prev.filter((p) => p.id !== productId));

    // Remove from database
    await deleteProductById(productId);
  };

  const addProduct = async (id, productData) => {
    // Add to database
    const newProductId = await addNewProduct(id, productData);

    // Update state with new product including its ID
    setProducts((prev) => [...prev, { id: newProductId, ...productData }]);
  };

  return {
    products,
    searchResults,
    searchTerm,
    setSearchTerm,
    updateProduct,
    deleteProduct,
    addProduct,
    loading,
  };
}
