import { useState } from "react";
import ProductList from "../components/productUI/ProductList";
import { useProduct } from "../hooks/useProduct";
import styles from "../styles/productModules/ProductPage.module.css";

export default function ProductPage() {
  const [page, setPage] = useState(1);
  const pageItemSize = 2;

  const { products, updateProduct, deleteProduct, addProduct } = useProduct();

  const paginatedProducts = products.slice(
    (page - 1) * pageItemSize,
    page * pageItemSize
  );

  return (
    <div className={styles.pageContainer}>
      <h1>Product Page</h1>
      <ProductList
        products={paginatedProducts}
        onUpdate={updateProduct}
        onDelete={deleteProduct}
        onAdd={addProduct}
      />
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </button>
        <button
          disabled={page * pageItemSize >= products.length}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
    </div>
  );
}
