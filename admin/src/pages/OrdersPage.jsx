import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, ChevronDown } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];
const STATUS_COLORS = { pending: 'bg-yellow-100 text-yellow-800', confirmed: 'bg-blue-100 text-blue-800', processing: 'bg-purple-100 text-purple-800', shipped: 'bg-indigo-100 text-indigo-800', delivered: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800', returned: 'bg-gray-100 text-gray-700' };

function OrderModal({ order, onClose, onUpdate }) {
  const [status, setStatus] = useState(order.orderStatus);
  const [tracking, setTracking] = useState(order.trackingNumber || '');
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await api.put(`/orders/${order._id}/status`, { status, trackingNumber: tracking });
      toast.success('Order updated');
      onUpdate();
    } catch { toast.error('Update failed'); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between">
          <h2 className="font-cormorant text-2xl">Order #{order._id.slice(-8).toUpperCase()}</h2>
          <button onClick={onClose}>✕</button>
        </div>
        <div className="p-6 space-y-6">
          {/* Customer */}
          <div className="grid grid-cols-2 gap-4">
            <div className="card p-4">
              <h4 className="font-jost text-xs tracking-wider uppercase text-gray-400 mb-3">Customer</h4>
              <p className="font-karla text-sm font-medium">{order.user?.name}</p>
              <p className="font-karla text-xs text-gray-500">{order.user?.email}</p>
            </div>
            <div className="card p-4">
              <h4 className="font-jost text-xs tracking-wider uppercase text-gray-400 mb-3">Shipping Address</h4>
              <p className="font-karla text-sm">{order.shippingAddress?.name}</p>
              <p className="font-karla text-xs text-gray-500">{order.shippingAddress?.street}, {order.shippingAddress?.city}</p>
              <p className="font-karla text-xs text-gray-500">{order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
            </div>
          </div>

          {/* Items */}
          <div>
            <h4 className="font-jost text-xs tracking-wider uppercase text-gray-400 mb-3">Order Items</h4>
            <div className="space-y-3">
              {order.orderItems?.map(item => (
                <div key={item._id} className="flex items-center gap-3 p-3 bg-gray-50">
                  <div className="w-12 h-16 bg-gray-200 overflow-hidden shrink-0">
                    {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1">
                    <p className="font-karla text-sm font-medium">{item.name}</p>
                    <p className="font-jost text-xs text-gray-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-jost text-sm font-medium">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Totals */}
          <div className="card p-4 space-y-2">
            {[['Items', `₹${order.itemsPrice.toLocaleString('en-IN')}`], ['Shipping', order.shippingPrice === 0 ? 'Free' : `₹${order.shippingPrice}`], ['Tax', `₹${order.taxPrice.toLocaleString('en-IN')}`]].map(([k, v]) => (
              <div key={k} className="flex justify-between font-karla text-sm"><span className="text-gray-500">{k}</span><span>{v}</span></div>
            ))}
            <div className="flex justify-between font-jost text-sm font-semibold pt-2 border-t border-gray-100"><span>Total</span><span>₹{order.totalPrice.toLocaleString('en-IN')}</span></div>
          </div>

          {/* Update status */}
          <div className="space-y-3">
            <div>
              <label className="label">Update Status</label>
              <select value={status} onChange={e => setStatus(e.target.value)} className="input">
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Tracking Number</label>
              <input type="text" value={tracking} onChange={e => setTracking(e.target.value)} className="input" placeholder="Enter tracking number" />
            </div>
            <button onClick={handleUpdate} disabled={loading} className="btn-primary w-full">{loading ? 'Updating...' : 'Update Order'}</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [activeOrder, setActiveOrder] = useState(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', statusFilter, page],
    queryFn: () => api.get('/orders/admin/all', { params: { status: statusFilter, page, limit: 20 } }).then(r => r.data),
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-cormorant text-3xl">Orders</h1>
          <p className="font-karla text-sm text-gray-500">{data?.total || 0} orders total</p>
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }} className="input w-auto">
          <option value="">All Status</option>
          {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {['Order', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', ''].map(h => (
                <th key={h} className="px-5 py-3 text-left font-jost text-[10px] tracking-[0.15em] uppercase text-gray-400">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? [...Array(10)].map((_, i) => <tr key={i}><td colSpan={8} className="px-5 py-4"><div className="h-10 shimmer" /></td></tr>) :
              data?.orders?.map(o => (
                <tr key={o._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4 font-jost text-xs text-gray-600">#{o._id.slice(-8).toUpperCase()}</td>
                  <td className="px-5 py-4">
                    <p className="font-karla text-sm text-gray-800">{o.user?.name}</p>
                    <p className="font-karla text-xs text-gray-400">{o.user?.email}</p>
                  </td>
                  <td className="px-5 py-4 font-karla text-sm text-gray-600">{o.orderItems?.length}</td>
                  <td className="px-5 py-4 font-jost text-sm font-medium">₹{o.totalPrice.toLocaleString('en-IN')}</td>
                  <td className="px-5 py-4"><span className={`font-jost text-[9px] tracking-wide uppercase px-2 py-0.5 ${o.isPaid ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{o.isPaid ? 'Paid' : 'Unpaid'}</span></td>
                  <td className="px-5 py-4"><span className={`font-jost text-[9px] tracking-wide uppercase px-2.5 py-1 ${STATUS_COLORS[o.orderStatus]}`}>{o.orderStatus}</span></td>
                  <td className="px-5 py-4 font-karla text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                  <td className="px-5 py-4">
                    <button onClick={() => setActiveOrder(o)} className="p-1.5 text-gray-400 hover:text-wine hover:bg-wine/5 transition-colors rounded"><Eye className="w-4 h-4" /></button>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
        {data?.pages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t border-gray-100">
            {[...Array(Math.min(data.pages, 10))].map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)} className={`w-8 h-8 text-sm font-jost border ${page === i + 1 ? 'bg-wine border-wine text-white' : 'border-gray-200 hover:border-wine'}`}>{i + 1}</button>
            ))}
          </div>
        )}
      </div>

      <AnimatePresence>
        {activeOrder && <OrderModal order={activeOrder} onClose={() => setActiveOrder(null)} onUpdate={() => { setActiveOrder(null); qc.invalidateQueries(['admin-orders']); }} />}
      </AnimatePresence>
    </div>
  );
}
