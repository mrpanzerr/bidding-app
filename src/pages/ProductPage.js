import ProductList from "../components/productUI/ProductList";
import { useProduct } from "../hooks/useProduct";
import styles from "../styles/productModules/ProductPage.module.css";

export default function ProductPage() {
  const { products, updateProduct, deleteProduct, addProduct } = useProduct();

  return (
    <div className={styles.pageContainer}>
      <h1>Product Page</h1>
      <ProductList 
        products={products} 
        onUpdate={updateProduct} 
        onDelete={deleteProduct} 
        onAdd={addProduct} 
      />
    </div>
  );
}
