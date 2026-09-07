import { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import ProductTable from '../../components/admin/ProductTable.jsx';
import ProductForm from '../../components/admin/ProductForm.jsx';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadProducts = () => {
    api.get('/products', { params: { limit: 100 } }).then(({ data }) => setProducts(data.products));
  };

  useEffect(loadProducts, []);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (product) => {
    if (!confirm(`Deactivate "${product.name}"?`)) return;
    await api.delete(`/products/${product._id}`);
    loadProducts();
  };

  const handleSaved = () => {
    setShowForm(false);
    setEditingProduct(null);
    loadProducts();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-display font-bold text-ink-900">Products</h1>
        {!showForm && (
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowForm(true);
            }}
            className="px-5 py-2.5 bg-brand-gradient hover:opacity-90 text-white text-sm font-semibold rounded-full shadow-card transition"
          >
            + New Product
          </button>
        )}
      </div>

      {showForm ? (
        <ProductForm
          product={editingProduct}
          onSaved={handleSaved}
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      ) : (
        <ProductTable products={products} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default AdminProducts;
