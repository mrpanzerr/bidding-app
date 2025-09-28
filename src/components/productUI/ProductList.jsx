import { useState } from "react";
import styles from "../../styles/productModules/ProductList.module.css";
import DeleteModal from "../modals/deleteModal";

export default function ProductList({ products, onUpdate, onDelete }) {
  const [search, setSearch] = useState("");
  const [modalProductId, setModalProductId] = useState(null);

  // Filter products based on search input
  const filteredProducts = products.filter(
    (product) =>
      product.id.toUpperCase().includes(search.toUpperCase()) ||
      product.name.toUpperCase().includes(search.toUpperCase())
  );

  // Use filtered products for rendering
  products = filteredProducts;

  return (
    <>
      <ul className={styles.productList}>
        <li className={styles.productItem}>
          <span>Product Code</span>
          <span>Product Description</span>
          <span>Price Per Unit</span>
          <span>
            {/* Search bar */}
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </span>
        </li>
        {products.map((product) => (
          <li key={product.id} className={styles.productItem}>
            <span>{product.id}</span>
            <span>
              <input
                type="text"
                defaultValue={product.name}
                onBlur={(e) => onUpdate(product.id, { name: e.target.value })}
              />
            </span>
            <span>
              <input
                type="number"
                defaultValue={product.price}
                onBlur={(e) =>
                  onUpdate(product.id, {
                    price: parseFloat(e.target.value),
                  })
                }
              />
            </span>
            <span>
              <button onClick={() => setModalProductId(product.id)}>
                Delete Product
              </button>
            </span>
          </li>
        ))}
      </ul>


      {modalProductId && (
        <DeleteModal
          label="Delete Product?"
          onSave={async () => {
            await onDelete(modalProductId);
            setModalProductId(null); // close modal after delete
          }}
          onCancel={() => setModalProductId(null)} // close modal without deleting
        />
      )}
    </>
  );
}
