const ProductTable = ({ products, onEdit, onDelete }) => (
  <div className="overflow-x-auto bg-white border border-ink-100 rounded-2xl shadow-card">
    <table className="min-w-full text-sm">
      <thead className="bg-ink-50 text-ink-500 text-left">
        <tr>
          <th className="px-4 py-3.5 font-semibold">Product</th>
          <th className="px-4 py-3.5 font-semibold">Category</th>
          <th className="px-4 py-3.5 font-semibold">Variants</th>
          <th className="px-4 py-3.5 font-semibold">Price</th>
          <th className="px-4 py-3.5 font-semibold">Stock</th>
          <th className="px-4 py-3.5 font-semibold">Status</th>
          <th className="px-4 py-3.5 font-semibold text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-ink-100">
        {products.map((product) => {
          const totalStock = product.variants.reduce((sum, v) => sum + v.stockQuantity, 0);
          return (
            <tr key={product._id} className="hover:bg-ink-50/60 transition-colors">
              <td className="px-4 py-3.5 font-semibold text-ink-800">{product.name}</td>
              <td className="px-4 py-3.5 text-ink-500">{product.category?.name}</td>
              <td className="px-4 py-3.5 text-ink-500">{product.variants.length}</td>
              <td className="px-4 py-3.5 text-ink-800 font-medium">₹{product.finalPrice}</td>
              <td className="px-4 py-3.5 text-ink-500">{totalStock}</td>
              <td className="px-4 py-3.5">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    product.isActive ? 'bg-green-100 text-green-700' : 'bg-ink-100 text-ink-500'
                  }`}
                >
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
              </td>
              <td className="px-4 py-3.5 text-right space-x-4">
                <button onClick={() => onEdit(product)} className="text-brand-600 font-medium hover:underline">
                  Edit
                </button>
                <button onClick={() => onDelete(product)} className="text-red-500 font-medium hover:underline">
                  Deactivate
                </button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default ProductTable;
