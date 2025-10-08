import { useState } from "react";
import ProductList from "../components/productUI/ProductList";
import { useProduct } from "../hooks/useProduct";
import styles from "../styles/productModules/ProductPage.module.css";

export default function ProductPage() {
  const {
    products,
    searchTerm,
    searchResults,
    setSearchTerm,
    updateProduct,
    deleteProduct,
    addProduct,
    loading,
  } = useProduct();

  const [currentPage, setCurrentPage] = useState(1);
  const pageItemSize = 25;
  const totalPages = Math.ceil(products.length / pageItemSize);

  const paginatedProducts = products.slice(
    (currentPage - 1) * pageItemSize,
    currentPage * pageItemSize
  );

  const displayProducts =
    searchTerm.length > 0 ? searchResults : paginatedProducts;

  return (
    <div className={styles.pageContainer}>
      <div className={styles.contentBox}>
        <h1 className={styles.pageHeader}>Product Page</h1>

        {/* Paginated Product List */}
        <ProductList
          products={displayProducts}
          onUpdate={updateProduct}
          onDelete={deleteProduct}
          onAdd={addProduct}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          loading={loading}
        />

        {/* Pagination Controls */}
        {!searchTerm && (
          <div className={styles.paginationControls}>
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Prev
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                disabled={page === currentPage}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              disabled={currentPage * pageItemSize >= products.length}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
