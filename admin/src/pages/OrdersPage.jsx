import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, ChevronDown, Phone, Mail, MapPin, CreditCard, Package, Clock, RotateCcw, AlertTriangle, X, Truck } from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const STATUS_OPTIONS = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];
const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-800 border border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border border-blue-200',
  processing: 'bg-purple-100 text-purple-800 border border-purple-200',
  shipped: 'bg-indigo-100 text-indigo-800 border border-indigo-200',
  delivered: 'bg-green-100 text-green-800 border border-green-200',
  cancelled: 'bg-red-100 text-red-800 border border-red-200',
  returned: 'bg-gray-100 text-gray-700 border border-gray-200',
};

const PAYMENT_LABELS = { upi: 'UPI', cod: 'COD', card: 'Card', netbanking: 'Net Banking' };

// Status flow — only allow forward transitions (+ admin can cancel/return from any)
const ALLOWED_NEXT = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered', 'returned'],
  delivered: ['returned'],
  cancelled: [],
  returned: [],
};

function OrderModal({ order, onClose, onUpdate }) {
  const currentStatus = order.orderStatus;
  const allowedStatuses = ALLOWED_NEXT[currentStatus] || [];
  const [status, setStatus] = useState(currentStatus);
  const [tracking, setTracking] = useState(order.trackingNumber || '');
  const [loading, setLoading] = useState(false);

  const isTerminal = currentStatus === 'cancelled' || currentStatus === 'delivered' || currentStatus === 'returned';
  const hasChanged = status !== currentStatus || tracking !== (order.trackingNumber || '');

  const handleUpdate = async () => {
    if (!hasChanged) return;
    setLoading(true);
    try {
      await api.put(`/orders/${order._id}/status`, { status, trackingNumber: tracking });
      toast.success('Order updated successfully');
      onUpdate();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const addr = order.shippingAddress || {};
  const fullAddress = [addr.houseNo, addr.street, addr.landmark].filter(Boolean).join(', ');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-xs" onClick={onClose} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl rounded-lg border border-gray-200"
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#FDFAF5] border-b border-[#DDD0BC]/70 px-6 py-5 flex items-center justify-between z-10">
          <div>
            <p className="font-jost text-[10px] tracking-[0.25em] uppercase text-[#C99B4E] font-semibold">Order Details</p>
            <h2 className="font-cormorant text-2xl text-[#411B1E] mt-0.5">#{order._id.slice(-8).toUpperCase()}</h2>
          </div>
          <div className="flex items-center gap-3">
            <span className={`font-jost text-[10px] tracking-wide uppercase px-2.5 py-1 rounded ${STATUS_COLORS[currentStatus]}`}>
              {currentStatus}
            </span>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 flex items-center justify-center transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Customer + Payment Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <h4 className="font-jost text-[10px] tracking-wider uppercase text-gray-400 mb-3 flex items-center gap-1.5">
                <Mail className="w-3 h-3" /> Customer
              </h4>
              <p className="font-karla text-sm font-medium text-gray-900">{order.user?.name || '—'}</p>
              <p className="font-karla text-xs text-gray-500 mt-0.5">{order.user?.email || '—'}</p>
              {order.user?.phone && (
                <p className="font-karla text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                  <Phone className="w-3 h-3" /> {order.user.phone}
                </p>
              )}
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
              <h4 className="font-jost text-[10px] tracking-wider uppercase text-gray-400 mb-3 flex items-center gap-1.5">
                <CreditCard className="w-3 h-3" /> Payment
              </h4>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-karla text-sm font-medium text-gray-900">
                  {PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod}
                </span>
                <span className={`font-jost text-[9px] tracking-wide uppercase px-2 py-0.5 rounded ${order.isPaid ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-red-100 text-red-600 border border-red-200'}`}>
                  {order.isPaid ? 'Paid' : 'Unpaid'}
                </span>
              </div>
              {order.isPaid && order.paidAt && (
                <p className="font-karla text-xs text-gray-500">
                  Paid on {new Date(order.paidAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              )}
              {order.paymentResult?.id && (
                <p className="font-karla text-[11px] text-gray-400 mt-0.5 font-mono">
                  Txn: {order.paymentResult.id}
                </p>
              )}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
            <h4 className="font-jost text-[10px] tracking-wider uppercase text-gray-400 mb-3 flex items-center gap-1.5">
              <MapPin className="w-3 h-3" /> Shipping Address
            </h4>
            <p className="font-karla text-sm font-medium text-gray-900">{addr.name || '—'}</p>
            {addr.phone && (
              <p className="font-karla text-xs text-gray-600 mt-0.5 flex items-center gap-1">
                <Phone className="w-3 h-3 text-gray-400" /> {addr.phone}
                {addr.alternatePhone && <span className="text-gray-400">| Alt: {addr.alternatePhone}</span>}
              </p>
            )}
            <p className="font-karla text-xs text-gray-500 mt-1">{fullAddress}</p>
            <p className="font-karla text-xs text-gray-500">{addr.city}, {addr.state} — {addr.pincode}</p>
            {addr.addressType && (
              <span className="inline-block font-jost text-[9px] tracking-wide uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100 mt-2">
                {addr.addressType}
              </span>
            )}
          </div>

          {/* Order Items */}
          <div>
            <h4 className="font-jost text-[10px] tracking-wider uppercase text-gray-400 mb-3 flex items-center gap-1.5">
              <Package className="w-3 h-3" /> Order Items ({order.orderItems?.length || 0})
            </h4>
            <div className="space-y-2">
              {order.orderItems?.map(item => (
                <div key={item._id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                  <div className="w-12 h-16 bg-gray-200 overflow-hidden shrink-0 rounded">
                    {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-karla text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="font-jost text-xs text-gray-400">Qty: {item.quantity} × ₹{item.price.toLocaleString('en-IN')}</p>
                  </div>
                  <p className="font-jost text-sm font-semibold text-gray-800 shrink-0">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-100 space-y-2">
            {[
              ['Items Total', `₹${order.itemsPrice?.toLocaleString('en-IN')}`],
              ['Shipping', order.shippingPrice === 0 ? 'Free' : `₹${order.shippingPrice}`],
              ['Tax (GST)', `₹${order.taxPrice?.toLocaleString('en-IN')}`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between font-karla text-sm">
                <span className="text-gray-500">{k}</span><span className="text-gray-700">{v}</span>
              </div>
            ))}
            <div className="flex justify-between font-jost text-base font-semibold pt-2 border-t border-gray-200">
              <span className="text-gray-900">Grand Total</span>
              <span className="text-[#6B2732]">₹{order.totalPrice?.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Cancellation Info (if cancelled) */}
          {currentStatus === 'cancelled' && (
            <div className="bg-red-50 rounded-lg p-4 border border-red-200">
              <h4 className="font-jost text-[10px] tracking-wider uppercase text-red-600 mb-2 flex items-center gap-1.5">
                <AlertTriangle className="w-3 h-3" /> Cancellation Details
              </h4>
              <p className="font-karla text-sm text-red-800">
                {order.cancellationReason || 'No reason provided'}
              </p>
              {order.cancelledAt && (
                <p className="font-karla text-xs text-red-500 mt-1">
                  Cancelled on {new Date(order.cancelledAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              )}
              {order.isPaid && (
                <div className="mt-3 flex items-center gap-2">
                  <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                  <span className={`font-jost text-xs px-2.5 py-1 rounded ${
                    order.refundStatus === 'processed' ? 'bg-green-100 text-green-700 border border-green-200'
                    : order.refundStatus === 'pending' ? 'bg-amber-100 text-amber-700 border border-amber-200'
                    : order.refundStatus === 'failed' ? 'bg-red-100 text-red-700 border border-red-200'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
                  }`}>
                    Refund: {order.refundStatus === 'processed' ? 'Processed' : order.refundStatus === 'pending' ? 'Pending' : order.refundStatus === 'failed' ? 'Failed' : 'N/A'}
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Tracking Info (if shipped/delivered) */}
          {order.trackingNumber && ['shipped', 'delivered'].includes(currentStatus) && (
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-200">
              <h4 className="font-jost text-[10px] tracking-wider uppercase text-indigo-600 mb-1 flex items-center gap-1.5">
                <Truck className="w-3 h-3" /> Tracking
              </h4>
              <p className="font-karla text-sm font-medium text-indigo-800 font-mono">{order.trackingNumber}</p>
            </div>
          )}

          {/* Timestamps */}
          <div className="flex flex-wrap gap-x-6 gap-y-1 font-karla text-xs text-gray-400">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Placed: {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
            {order.isDelivered && order.deliveredAt && (
              <span>Delivered: {new Date(order.deliveredAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            )}
          </div>

          {/* Update Status (only if not terminal) */}
          {!isTerminal && allowedStatuses.length > 0 && (
            <div className="space-y-3 pt-3 border-t border-gray-100">
              <h4 className="font-jost text-xs tracking-wider uppercase text-gray-500 font-semibold">Update Order</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="label">Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value)} className="input">
                    <option value={currentStatus}>{currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)} (Current)</option>
                    {allowedStatuses.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Tracking Number</label>
                  <input type="text" value={tracking} onChange={e => setTracking(e.target.value)} className="input" placeholder="Enter tracking ID" />
                </div>
              </div>
              <button
                onClick={handleUpdate}
                disabled={loading || !hasChanged}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Order'}
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default function OrdersPage() {
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [paidFilter, setPaidFilter] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [activeOrder, setActiveOrder] = useState(null);
  const qc = useQueryClient();

  // Debounce search
  useState(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const activeFiltersCount = [
    debouncedSearch,
    statusFilter,
    paymentFilter,
    paidFilter,
    dateRange,
    sortBy !== 'newest' ? sortBy : null,
  ].filter(Boolean).length;

  const resetFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setStatusFilter('');
    setPaymentFilter('');
    setPaidFilter('');
    setDateRange('');
    setSortBy('newest');
    setPage(1);
  };

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', statusFilter, debouncedSearch, paymentFilter, paidFilter, dateRange, sortBy, page],
    queryFn: () => api.get('/orders/admin/all', {
      params: {
        status: statusFilter || undefined,
        search: debouncedSearch || undefined,
        paymentMethod: paymentFilter || undefined,
        isPaid: paidFilter !== '' ? paidFilter : undefined,
        dateRange: dateRange || undefined,
        sort: sortBy,
        page,
        limit: 20
      }
    }).then(r => r.data),
  });

  return (
    <div className="p-6 sm:p-8 max-w-[1400px] mx-auto space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-jost text-[10px] tracking-[0.25em] uppercase text-[#C99B4E] font-semibold">Store Management</span>
          <h1 className="font-cormorant text-3xl sm:text-4xl text-[#411B1E] font-medium mt-0.5">Orders</h1>
          <p className="font-karla text-sm text-gray-500 mt-1">
            {data?.total || 0} total customer orders
            {activeFiltersCount > 0 && ` · Filters Active (${activeFiltersCount})`}
          </p>
        </div>

        {activeFiltersCount > 0 && (
          <button
            onClick={resetFilters}
            className="self-start sm:self-auto text-xs font-jost text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded border border-rose-200 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset All Filters ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Filter Toolbar */}
      <div className="card p-4 border border-gray-200 bg-white shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="lg:col-span-2 relative">
            <input
              type="text"
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by Order ID, Customer, Phone, City..."
              className="input pl-3.5 w-full text-xs"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
              className="input w-full text-xs"
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map(s => (
                <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>

          {/* Payment Method Filter */}
          <div>
            <select
              value={paymentFilter}
              onChange={e => { setPaymentFilter(e.target.value); setPage(1); }}
              className="input w-full text-xs"
            >
              <option value="">All Payments</option>
              <option value="cod">Cash on Delivery (COD)</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
              <option value="netbanking">Net Banking</option>
            </select>
          </div>

          {/* Payment Status (Paid / Unpaid) */}
          <div>
            <select
              value={paidFilter}
              onChange={e => { setPaidFilter(e.target.value); setPage(1); }}
              className="input w-full text-xs"
            >
              <option value="">All Paid / Unpaid</option>
              <option value="true">Paid Only</option>
              <option value="false">Unpaid Only</option>
            </select>
          </div>

          {/* Date Range */}
          <div>
            <select
              value={dateRange}
              onChange={e => { setDateRange(e.target.value); setPage(1); }}
              className="input w-full text-xs"
            >
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
            </select>
          </div>
        </div>

        {/* Secondary Row: Sorting & Quick Status Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100">
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-jost">
            <span className="text-gray-400 mr-1 text-[11px] uppercase tracking-wider">Quick:</span>
            {['', 'pending', 'confirmed', 'shipped', 'delivered', 'cancelled'].map(st => (
              <button
                key={st}
                onClick={() => { setStatusFilter(st); setPage(1); }}
                className={`px-2.5 py-1 rounded-sm uppercase text-[10px] tracking-wider transition-all ${
                  statusFilter === st
                    ? 'bg-[#6B2732] text-white font-medium'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {st || 'All'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs font-jost">Sort:</span>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="input text-xs py-1 px-2.5 w-auto"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="amount_high">Amount: High to Low</option>
              <option value="amount_low">Amount: Low to High</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="card overflow-hidden rounded-lg border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#FAF6EE] border-b border-[#DDD0BC]/60 font-jost text-[10px] tracking-[0.15em] uppercase text-[#6B2732] font-semibold">
              <tr>
                {['Order ID', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Action'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-karla">
              {isLoading ? (
                [...Array(10)].map((_, i) => (
                  <tr key={i}><td colSpan={8} className="px-5 py-4"><div className="h-10 shimmer rounded" /></td></tr>
                ))
              ) : data?.orders?.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-16 text-center">
                    <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                    <p className="font-karla text-gray-600 font-medium">No orders matched the selected filters</p>
                    {activeFiltersCount > 0 && (
                      <button
                        onClick={resetFilters}
                        className="btn-secondary text-xs mt-3 inline-flex items-center gap-1.5"
                      >
                        <RotateCcw className="w-3.5 h-3.5" /> Clear All Filters
                      </button>
                    )}
                  </td>
                </tr>
              ) : (
                data?.orders?.map(o => (
                  <tr
                    key={o._id}
                    className="hover:bg-[#FBF4E9]/40 transition-colors cursor-pointer"
                    onClick={() => setActiveOrder(o)}
                  >
                    <td className="px-5 py-4">
                      <span className="font-jost text-xs font-semibold text-gray-800">
                        #{o._id.slice(-8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-sm text-gray-800 leading-snug">{o.user?.name || o.shippingAddress?.name || '—'}</p>
                      <p className="font-karla text-[11px] text-gray-400">
                        {o.user?.email || o.shippingAddress?.phone || ''}
                      </p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-karla text-sm text-gray-600">
                        {o.orderItems?.length || 0} {o.orderItems?.length === 1 ? 'item' : 'items'}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-jost text-sm font-semibold text-[#6B2732]">
                        ₹{o.totalPrice?.toLocaleString('en-IN')}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-col gap-1">
                        <span className="font-jost text-[10px] tracking-wide uppercase font-medium text-gray-700">
                          {PAYMENT_LABELS[o.paymentMethod] || o.paymentMethod}
                        </span>
                        <span className={`font-jost text-[9px] tracking-wide uppercase px-2 py-0.5 rounded w-fit border font-medium ${
                          o.isPaid ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {o.isPaid ? 'Paid' : 'Unpaid'}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`font-jost text-[9px] tracking-wide uppercase px-2.5 py-1 rounded font-medium ${STATUS_COLORS[o.orderStatus] || 'bg-gray-100 text-gray-700'}`}>
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-karla text-xs text-gray-500">
                        {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); setActiveOrder(o); }}
                        className="p-1.5 text-gray-500 hover:text-[#6B2732] hover:bg-[#6B2732]/10 transition-colors rounded"
                        title="View & update order"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.pages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-3.5 border-t border-gray-100 bg-[#FDFAF5] gap-3">
            <p className="font-karla text-xs text-gray-500">
              Showing page <span className="font-semibold text-gray-800">{page}</span> of{' '}
              <span className="font-semibold text-gray-800">{data.pages}</span> ({data.total} total orders)
            </p>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-xs font-jost border border-gray-200 rounded hover:border-[#6B2732] disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-white"
              >
                Previous
              </button>
              {[...Array(Math.min(data.pages, 7))].map((_, i) => {
                const pg = i + 1;
                return (
                  <button
                    key={pg}
                    onClick={() => setPage(pg)}
                    className={`w-8 h-8 text-xs font-jost border rounded transition-colors ${
                      page === pg
                        ? 'bg-[#6B2732] border-[#6B2732] text-white font-medium shadow-xs'
                        : 'border-gray-200 text-gray-600 hover:border-[#6B2732] bg-white'
                    }`}
                  >
                    {pg}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(p => Math.min(data.pages, p + 1))}
                disabled={page === data.pages}
                className="px-3 py-1.5 text-xs font-jost border border-gray-200 rounded hover:border-[#6B2732] disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-white"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {activeOrder && (
          <OrderModal
            order={activeOrder}
            onClose={() => setActiveOrder(null)}
            onUpdate={() => { setActiveOrder(null); qc.invalidateQueries(['admin-orders']); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
