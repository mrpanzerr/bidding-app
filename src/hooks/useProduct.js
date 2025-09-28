import { useEffect, useState } from "react";
import { addNewProduct, deleteProductById, fetchProducts, updateProductData } from "../firebase/productServices";

export function useProduct() {
  const [products, setProducts] = useState([]);

  // Fetch products on mount
  useEffect(() => {
    const getProducts = async () => {
      const productList = await fetchProducts();
      setProducts(productList);
    };
    getProducts();
  }, []);

  // Update a product in state and database
  const updateProduct = async (productId, updatedFields) => {
    // Optimistically update state
    setProducts(prev =>
      prev.map(p => (p.id === productId ? { ...p, ...updatedFields } : p))
    );

    // Persist to database
    await updateProductData(productId, updatedFields);
  };

  // Delete a product from state and database
  const deleteProduct = async (productId) => {
    // Update state
    setProducts(prev => prev.filter(p => p.id !== productId));

    // Remove from database
    await deleteProductById(productId);
  };

  const addProduct = async (productData) => {
    // Add to database
    const newProductId = await addNewProduct(productData);

    // Update state with new product including its ID
    setProducts(prev => [...prev, { id: newProductId, ...productData }]);
  };

  return { products, updateProduct, deleteProduct, addProduct };
}
