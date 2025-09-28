import { useState } from "react";
import styles from "../../styles/productModules/ProductList.module.css";
import DeleteModal from "../modals/deleteModal";

export default function ProductList({ products, onUpdate, onDelete, searchTerm, setSearchTerm, loading }) {
  const [modalProductId, setModalProductId] = useState(null);

  return (
    <>
      <ul className={styles.productList}>
        <li className={styles.productItem}>
          {/* Table Headers */}
          <span>Product Code</span>
          <span>Product Description</span>
          <span>Price Per Unit</span>
          <span>
            {/* Search bar */}
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </span>
        </li>
        {products.map((product) => (
          <li key={product.id} className={styles.productItem}>
            {/* Product details */}
            <span>{product.id}</span>
            {/* Editable name field */}
            <span>
              <input
                type="text"
                defaultValue={product.name}
                onBlur={(e) => onUpdate(product.id, { name: e.target.value })}
              />
            </span>
            {/* Editable price field */}
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
            {/* Delete button */}
            <span>
              <button onClick={() => setModalProductId(product.id)}>
                Delete Product
              </button>
            </span>
          </li>
        ))}
      </ul>

      {/* Delete Confirmation Modal */}
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
