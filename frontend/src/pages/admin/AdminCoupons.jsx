import { useEffect, useState } from 'react';
import api from '../../api/axios.js';
import CouponForm from '../../components/admin/CouponForm.jsx';
import Pagination from '../../components/admin/Pagination.jsx';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const loadCoupons = () => {
    api.get('/coupons', { params: { page, limit: 10 } }).then(({ data }) => {
      setCoupons(data.coupons);
      setPagination(data.pagination);
    });
  };

  useEffect(loadCoupons, [page]);

  const handleDeactivate = async (coupon) => {
    await api.delete(`/coupons/${coupon._id}`);
    loadCoupons();
  };

  const handleSaved = () => {
    setShowForm(false);
    loadCoupons();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-display font-bold text-ink-900">Coupons</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 bg-brand-gradient hover:opacity-90 text-white text-sm font-semibold rounded-full shadow-card transition"
          >
            + New Coupon
          </button>
        )}
      </div>

      {showForm ? (
        <CouponForm onSaved={handleSaved} onCancel={() => setShowForm(false)} />
      ) : (
        <div className="bg-white border border-ink-100 rounded-2xl shadow-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-ink-50 text-ink-500 text-left">
                <tr>
                  <th className="px-4 py-3.5 font-semibold">Code</th>
                  <th className="px-4 py-3.5 font-semibold">Type</th>
                  <th className="px-4 py-3.5 font-semibold">Value</th>
                  <th className="px-4 py-3.5 font-semibold">Min Order</th>
                  <th className="px-4 py-3.5 font-semibold">Valid Until</th>
                  <th className="px-4 py-3.5 font-semibold">Status</th>
                  <th className="px-4 py-3.5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-ink-50/60 transition-colors">
                    <td className="px-4 py-3.5 font-semibold text-ink-800">{coupon.code}</td>
                    <td className="px-4 py-3.5 text-ink-500 capitalize">{coupon.discountType}</td>
                    <td className="px-4 py-3.5 text-ink-800 font-medium">
                      {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                    </td>
                    <td className="px-4 py-3.5 text-ink-500">₹{coupon.minOrderValue}</td>
                    <td className="px-4 py-3.5 text-ink-500">{new Date(coupon.validUntil).toLocaleDateString()}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-ink-100 text-ink-500'
                        }`}
                      >
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <button onClick={() => handleDeactivate(coupon)} className="text-red-500 font-medium hover:underline">
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

export default AdminCoupons;
