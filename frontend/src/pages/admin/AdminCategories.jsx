import { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import CategoryForm from '../../components/admin/CategoryForm.jsx';
import Pagination from '../../components/admin/Pagination.jsx';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const loadCategories = () => {
    api.get('/categories', { params: { page, limit: 10 } }).then(({ data }) => {
      setCategories(data.categories);
      setPagination(data.pagination);
    });
  };

  useEffect(loadCategories, [page]);

  const handleDeactivate = async (category) => {
    await api.delete(`/categories/${category._id}`);
    loadCategories();
  };

  const handleSaved = () => {
    setShowForm(false);
    loadCategories();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-display font-bold text-ink-900">Categories</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 bg-brand-gradient hover:opacity-90 text-white text-sm font-semibold rounded-full shadow-card transition"
          >
            + New Category
          </button>
        )}
      </div>

      {showForm ? (
        <CategoryForm onSaved={handleSaved} onCancel={() => setShowForm(false)} />
      ) : (
        <div className="bg-white border border-ink-100 rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-ink-50 text-ink-500 text-left">
                <tr>
                  <th className="px-4 py-3.5 font-semibold">Image</th>
                  <th className="px-4 py-3.5 font-semibold">Name</th>
                  <th className="px-4 py-3.5 font-semibold">Slug</th>
                  <th className="px-4 py-3.5 font-semibold">Description</th>
                  <th className="px-4 py-3.5 font-semibold">Status</th>
                  <th className="px-4 py-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {categories.map((category) => (
                  <tr key={category._id} className="hover:bg-ink-50/60 transition-colors">
                    <td className="px-4 py-3.5">
                      {category.image ? (
                        <img src={category.image} alt={category.name} className="w-10 h-10 rounded-lg object-cover" />
                      ) : (
                        <span className="w-10 h-10 rounded-lg bg-ink-100 flex items-center justify-center text-ink-300 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-ink-800">{category.name}</td>
                    <td className="px-4 py-3.5 text-ink-500">{category.slug}</td>
                    <td className="px-4 py-3.5 text-ink-500">{category.description || '—'}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          category.isActive ? 'bg-green-100 text-green-700' : 'bg-ink-100 text-ink-500'
                        }`}
                      >
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button onClick={() => handleDeactivate(category)} className="text-red-500 font-medium hover:underline">
                        Deactivate
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 pb-4">
            <Pagination pagination={pagination} onPageChange={setPage} />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
