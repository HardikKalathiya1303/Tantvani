import { useQuery } from '@tanstack/react-query';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Package, ShoppingCart, Users, TrendingUp, ArrowUpRight, Clock } from 'lucide-react';
import api from '../utils/api';

const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function DashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/admin/stats').then(r => r.data),
    refetchInterval: 30000,
  });

  const { data: ordersData } = useQuery({
    queryKey: ['recent-orders'],
    queryFn: () => api.get('/orders/admin/all', { params: { limit: 5 } }).then(r => r.data),
  });

  const stats = data?.stats;
  const chartData = stats?.monthlyRevenue?.map(m => ({
    name: monthNames[m._id.month - 1],
    revenue: m.revenue,
    orders: m.orders,
  })) || [];

  const statCards = [
    { label: 'Total Revenue', value: stats ? `₹${stats.totalRevenue.toLocaleString('en-IN')}` : '—', Icon: TrendingUp, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'Total Orders', value: stats?.totalOrders || '—', Icon: ShoppingCart, color: 'bg-blue-50 text-blue-600' },
    { label: 'Total Products', value: stats?.totalProducts || '—', Icon: Package, color: 'bg-purple-50 text-purple-600' },
    { label: 'Total Customers', value: stats?.totalUsers || '—', Icon: Users, color: 'bg-orange-50 text-orange-600' },
  ];

  const statusBadge = { pending: 'bg-yellow-100 text-yellow-800', confirmed: 'bg-blue-100 text-blue-800', shipped: 'bg-indigo-100 text-indigo-800', delivered: 'bg-green-100 text-green-800', cancelled: 'bg-red-100 text-red-800' };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-cormorant text-3xl text-gray-900">Dashboard</h1>
        <p className="font-karla text-sm text-gray-500 mt-1">Welcome back! Here's what's happening with Tantvani.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map(({ label, value, Icon, color }) => (
          <div key={label} className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
                <Icon className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-gray-300" />
            </div>
            <p className="font-karla text-2xl font-semibold text-gray-900 mb-1">
              {isLoading ? <span className="shimmer inline-block w-24 h-7 rounded" /> : value}
            </p>
            <p className="font-jost text-xs text-gray-500 tracking-wide">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 card p-6">
          <h3 className="font-cormorant text-xl mb-6">Revenue Overview</h3>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(354,42%,32%)" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="hsl(354,42%,32%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#888', fontFamily: 'Jost' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#888', fontFamily: 'Jost' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={(v) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']} contentStyle={{ fontFamily: 'Karla', fontSize: 12, border: '1px solid #eee' }} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(354,42%,32%)" strokeWidth={2} fill="url(#revGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-64 shimmer rounded" />
          )}
        </div>

        {/* Top products */}
        <div className="card p-6">
          <h3 className="font-cormorant text-xl mb-5">Top Products</h3>
          <div className="space-y-4">
            {stats?.topProducts?.map((p, i) => (
              <div key={p._id} className="flex items-center gap-3">
                <div className="w-10 h-12 bg-gray-100 overflow-hidden shrink-0">
                  {p.images?.[0] && <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-karla text-sm text-gray-800 truncate">{p.name}</p>
                  <p className="font-jost text-xs text-gray-400">{p.soldCount} sold</p>
                </div>
                <span className="font-jost text-xs font-medium text-gray-500">#{i + 1}</span>
              </div>
            ))}
            {!stats?.topProducts && [...Array(5)].map((_, i) => (
              <div key={i} className="flex gap-3"><div className="w-10 h-12 shimmer shrink-0" /><div className="flex-1"><div className="h-4 shimmer mb-2" /><div className="h-3 shimmer w-1/2" /></div></div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="card mt-6">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h3 className="font-cormorant text-xl">Recent Orders</h3>
          <a href="/orders" className="font-jost text-xs text-wine hover:underline tracking-wide">View all</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Order ID', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                  <th key={h} className="px-6 py-3 text-left font-jost text-[10px] tracking-[0.15em] uppercase text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {ordersData?.orders?.map(o => (
                <tr key={o._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 font-jost text-xs text-gray-600">#{o._id.slice(-8).toUpperCase()}</td>
                  <td className="px-6 py-4 font-karla text-sm text-gray-800">{o.user?.name}</td>
                  <td className="px-6 py-4 font-jost text-sm font-medium">₹{o.totalPrice.toLocaleString('en-IN')}</td>
                  <td className="px-6 py-4">
                    <span className={`font-jost text-[10px] tracking-wide uppercase px-2.5 py-1 rounded-sm ${statusBadge[o.orderStatus] || 'bg-gray-100 text-gray-600'}`}>{o.orderStatus}</span>
                  </td>
                  <td className="px-6 py-4 font-karla text-xs text-gray-400">{new Date(o.createdAt).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
              {!ordersData && [...Array(5)].map((_, i) => (
                <tr key={i}><td colSpan={5} className="px-6 py-4"><div className="h-4 shimmer" /></td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
