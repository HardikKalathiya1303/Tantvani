import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, ShoppingCart, Users, TrendingUp, ArrowUpRight, CreditCard, ChevronRight } from 'lucide-react';
import api from '../utils/api';

const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/admin/stats').then(r => r.data),
    refetchInterval: 30000,
  });

  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: ['recent-orders'],
    queryFn: () => api.get('/orders/admin/all', { params: { limit: 6 } }).then(r => r.data),
  });

  const stats = data?.stats;
  const chartData = stats?.monthlyRevenue?.map(m => ({
    name: monthNames[m._id.month - 1],
    revenue: m.revenue,
    orders: m.orders,
  })) || [];

  const statCards = [
    { label: 'Total Revenue', value: stats ? `₹${stats.totalRevenue.toLocaleString('en-IN')}` : '—', Icon: TrendingUp, color: 'bg-emerald-50 text-emerald-600', link: '/orders' },
    { label: 'Total Orders', value: stats?.totalOrders ?? '—', Icon: ShoppingCart, color: 'bg-blue-50 text-blue-600', link: '/orders' },
    { label: 'Total Products', value: stats?.totalProducts ?? '—', Icon: Package, color: 'bg-purple-50 text-purple-600', link: '/products' },
    { label: 'Total Customers', value: stats?.totalUsers ?? '—', Icon: Users, color: 'bg-orange-50 text-orange-600', link: '/users' },
  ];

  const statusBadge = {
    pending: 'bg-amber-100 text-amber-800 border-amber-200',
    confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
    shipped: 'bg-indigo-100 text-indigo-800 border-indigo-200',
    delivered: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    cancelled: 'bg-rose-100 text-rose-800 border-rose-200',
  };

  return (
    <div className="p-6 sm:p-8 max-w-[1400px] mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-cormorant text-3xl sm:text-4xl text-[#411B1E] font-medium">Dashboard</h1>
          <p className="font-karla text-sm text-gray-500 mt-1">Welcome back! Here's an overview of your store's performance.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/orders"
            className="btn-secondary text-xs px-4 py-2 inline-flex items-center gap-1.5"
          >
            Manage Orders <ChevronRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            to="/products"
            className="btn-primary text-xs px-4 py-2 inline-flex items-center gap-1.5"
          >
            Manage Products <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map(({ label, value, Icon, color, link }) => (
          <Link
            to={link}
            key={label}
            className="card p-6 hover:shadow-md transition-all group block border border-gray-100 hover:border-gray-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 rounded-lg ${color} flex items-center justify-center transition-transform group-hover:scale-105`}>
                <Icon className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-gray-600 transition-colors" />
            </div>
            <p className="font-karla text-2xl font-semibold text-gray-900 mb-1">
              {isLoading ? <span className="shimmer inline-block w-24 h-7 rounded" /> : value}
            </p>
            <p className="font-jost text-xs text-gray-500 tracking-wide uppercase">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 card p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-cormorant text-2xl text-gray-900">Revenue Overview</h3>
              <p className="font-karla text-xs text-gray-400 mt-0.5">Monthly revenue generated from completed orders</p>
            </div>
            {chartData.length > 0 && (
              <span className="font-jost text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-medium">
                Live Data
              </span>
            )}
          </div>

          {isLoading ? (
            <div className="h-64 shimmer rounded-lg" />
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(354,42%,32%)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="hsl(354,42%,32%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#888', fontFamily: 'Jost' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#888', fontFamily: 'Jost' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip
                  formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']}
                  contentStyle={{ fontFamily: 'Karla', fontSize: 12, borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="hsl(354,42%,32%)" strokeWidth={2.5} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
              <TrendingUp className="w-10 h-10 text-gray-300 mb-2" />
              <p className="font-karla text-sm font-medium text-gray-600">No Revenue Data Yet</p>
              <p className="font-karla text-xs text-gray-400 mt-1 max-w-sm">
                As customers place and pay for orders, monthly revenue analytics will automatically appear here.
              </p>
            </div>
          )}
        </div>

        {/* Top products */}
        <div className="card p-6 border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-cormorant text-2xl text-gray-900">Top Sarees</h3>
              <Link to="/products" className="font-jost text-xs text-wine hover:underline tracking-wide">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {stats?.topProducts?.map((p, i) => (
                <div key={p._id} className="flex items-center gap-3">
                  <div className="w-10 h-12 bg-gray-100 overflow-hidden shrink-0 rounded border border-gray-200">
                    {p.images?.[0] ? (
                      <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-4 h-4 text-gray-300 m-auto mt-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-karla text-sm text-gray-800 truncate font-medium">{p.name}</p>
                    <p className="font-jost text-xs text-gray-400">{p.soldCount || 0} sold</p>
                  </div>
                  <span className="font-jost text-xs font-semibold text-gray-400 bg-gray-100 w-6 h-6 rounded-full flex items-center justify-center">
                    #{i + 1}
                  </span>
                </div>
              ))}
              {isLoading && [...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="w-10 h-12 shimmer shrink-0 rounded" />
                  <div className="flex-1">
                    <div className="h-4 shimmer mb-2 rounded" />
                    <div className="h-3 shimmer w-1/2 rounded" />
                  </div>
                </div>
              ))}
              {!isLoading && (!stats?.topProducts || stats.topProducts.length === 0) && (
                <div className="text-center py-10">
                  <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="font-karla text-xs text-gray-400">No sales recorded yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="card mt-6 border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="font-cormorant text-2xl text-gray-900">Recent Orders</h3>
            <p className="font-karla text-xs text-gray-400 mt-0.5">Latest customer purchases</p>
          </div>
          <Link to="/orders" className="font-jost text-xs text-wine hover:underline tracking-wide font-medium flex items-center gap-1">
            View all orders <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#FAF6EE] border-b border-[#DDD0BC]/60">
              <tr>
                {['Order ID', 'Customer', 'Payment', 'Amount', 'Status', 'Date', 'Action'].map(h => (
                  <th key={h} className="px-6 py-3.5 font-jost text-[10px] tracking-[0.15em] uppercase text-[#6B2732] font-semibold">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 font-karla">
              {ordersLoading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}><td colSpan={7} className="px-6 py-4"><div className="h-4 shimmer rounded" /></td></tr>
                ))
              ) : ordersData?.orders?.length > 0 ? (
                ordersData.orders.map(o => (
                  <tr key={o._id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="px-6 py-4 font-jost text-xs font-semibold text-gray-700">
                      #{o._id.slice(-8).toUpperCase()}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-sm text-gray-800 leading-snug">{o.user?.name || 'Guest'}</p>
                      <p className="text-xs text-gray-400">{o.user?.email || o.shippingAddress?.phone || '—'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                        <span className="uppercase font-jost text-[11px] font-medium tracking-wide">
                          {o.paymentMethod || 'Online'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-jost text-sm font-semibold text-gray-900">
                      ₹{o.totalPrice?.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-jost text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-sm border font-medium ${statusBadge[o.orderStatus] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                        {o.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-karla text-xs text-gray-500">
                      {new Date(o.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to="/orders"
                        className="text-xs text-[#6B2732] hover:text-[#411B1E] font-medium font-jost hover:underline"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                    <ShoppingCart className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                    <p className="font-karla text-sm font-medium text-gray-600">No Orders Placed Yet</p>
                    <p className="font-karla text-xs text-gray-400 mt-1">
                      New orders placed by customers will be listed here in real-time.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
