import { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import CategoryForm from '../../components/admin/CategoryForm.jsx';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);

  const loadCategories = () => {
    api.get('/categories').then(({ data }) => setCategories(data.categories));
  };

  useEffect(loadCategories, []);

  const handleDeactivate = async (category) => {
    await api.delete(`/categories/${category._id}`);
    loadCategories();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-display font-bold text-ink-900">Categories</h1>

      <CategoryForm onSaved={loadCategories} />

      <div className="overflow-x-auto bg-white border border-ink-100 rounded-2xl shadow-card">
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
    </div>
  );
};

export default AdminCategories;
