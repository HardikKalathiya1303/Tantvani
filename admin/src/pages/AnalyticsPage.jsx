import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  TrendingUp, ShoppingBag, CheckCircle2, XCircle, Users,
  CreditCard, Package, RefreshCw, Calendar, ArrowUpRight,
  PieChart as PieIcon, Layers, AlertTriangle, Sparkles, Tag,
  Percent, ArrowRight, Flame, ShieldAlert, Award, ChevronRight
} from 'lucide-react';
import api from '../utils/api';

const RANGE_OPTIONS = [
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 90 Days', value: '90d' },
  { label: 'Past 1 Year', value: '1y' },
];

const STATUS_COLORS = {
  delivered: '#10B981', // green
  shipped: '#6366F1',   // indigo
  processing: '#8B5CF6',// purple
  confirmed: '#3B82F6', // blue
  pending: '#F59E0B',   // amber
  cancelled: '#EF4444', // red
  returned: '#6B7280',  // gray
};

const PAYMENT_COLORS = ['#6B2732', '#C99B4E', '#2563EB', '#059669', '#D97706'];

const DEMAND_BADGE_STYLES = {
  HERO_PRODUCT: {
    label: '⭐ Bestseller Hero',
    badge: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: Flame,
    color: 'text-amber-600',
  },
  RESTOCK_URGENT: {
    label: '⚠️ Restock Urgent',
    badge: 'bg-rose-100 text-rose-800 border-rose-200 font-bold',
    icon: AlertTriangle,
    color: 'text-rose-600',
  },
  OUT_OF_STOCK: {
    label: '🚨 Out of Stock',
    badge: 'bg-red-100 text-red-800 border-red-200 font-bold',
    icon: ShieldAlert,
    color: 'text-red-600',
  },
  HEALTHY: {
    label: '🟢 Steady Seller',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: Award,
    color: 'text-emerald-600',
  },
};

export default function AnalyticsPage() {
  const [range, setRange] = useState('30d');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'topSarees', 'offers', 'fabrics'

  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ['admin-analytics', range],
    queryFn: () => api.get('/admin/analytics', { params: { range } }).then(r => r.data),
  });

  const analytics = data?.analytics || {};

  // Status pie chart data
  const statusPieData = (analytics.statusCounts || []).map(s => ({
    name: s._id ? s._id.charAt(0).toUpperCase() + s._id.slice(1) : 'Unknown',
    rawStatus: s._id,
    value: s.count,
    revenue: s.revenue,
  }));

  // Payment pie chart data
  const paymentPieData = (analytics.paymentDistribution || []).map(p => ({
    name: p._id ? p._id.toUpperCase() : 'OTHER',
    value: p.count,
    revenue: p.revenue,
  }));

  // Trend data
  const trendData = (analytics.salesTrend || []).map(t => ({
    date: t._id,
    revenue: t.revenue || 0,
    orders: t.orders || 0,
  }));

  const topSarees = analytics.topSellingSarees || [];
  const fabricStats = analytics.fabricVelocity || [];
  const colorStats = analytics.colorDemand || [];
  const priceBands = analytics.priceBandStats || [];

  const topPerformer = topSarees[0];
  const topFabric = fabricStats[0];
  const topPriceBand = [...priceBands].sort((a, b) => b.totalSold - a.totalSold)[0];

  return (
    <div className="p-6 sm:p-8 max-w-[1400px] mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-jost text-[10px] tracking-[0.25em] uppercase text-[#C99B4E] font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#C99B4E]" /> AI Saree Intelligence & Future Strategy
          </span>
          <h1 className="font-cormorant text-3xl sm:text-4xl text-[#411B1E] font-medium mt-0.5">
            Sales & Demand Analytics
          </h1>
          <p className="font-karla text-sm text-gray-500 mt-1">
            Track top-performing sarees, identify restock priorities, and plan future catalog sourcing.
          </p>
        </div>

        {/* Range Selector & Refresh */}
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-gray-200 shadow-xs self-start sm:self-auto">
          {RANGE_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setRange(opt.value)}
              className={`px-3 py-1.5 rounded text-xs font-jost tracking-wide transition-all ${
                range === opt.value
                  ? 'bg-[#6B2732] text-white font-medium shadow-xs'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {opt.label}
            </button>
          ))}
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh analytics"
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? 'animate-spin text-[#6B2732]' : ''}`} />
          </button>
        </div>
      </div>

      {/* STRATEGIC ACTION SUMMARY CARDS (Top Guidance for Admin) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Top Product / Restock Focus */}
        <div className="card p-5 border-l-4 border-l-[#C99B4E] bg-gradient-to-br from-amber-50/50 to-white shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-jost text-[11px] uppercase tracking-wider text-amber-800 font-semibold flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-600" /> #1 Saree in Demand
            </span>
            {topPerformer && (
              <span className="font-jost text-xs text-amber-900 bg-amber-100 px-2 py-0.5 rounded font-semibold">
                {topPerformer.soldCount} Sold
              </span>
            )}
          </div>
          {topPerformer ? (
            <div>
              <p className="font-karla text-base font-semibold text-gray-900 truncate">{topPerformer.name}</p>
              <p className="font-karla text-xs text-gray-500 mt-1">
                Stock remaining: <strong className={topPerformer.stock <= 3 ? 'text-rose-600' : 'text-gray-800'}>{topPerformer.stock} units</strong> · Generated ₹{topPerformer.totalRevenue.toLocaleString('en-IN')}
              </p>
              <div className="mt-3 pt-3 border-t border-amber-100 text-xs font-karla text-amber-900 flex items-center justify-between">
                <span>{topPerformer.demandAdvice}</span>
                <Link to="/products" className="text-[#6B2732] font-semibold hover:underline shrink-0 ml-2">
                  View →
                </Link>
              </div>
            </div>
          ) : (
            <p className="font-karla text-xs text-gray-400">Recording sales activity...</p>
          )}
        </div>

        {/* Fabric to Source Next */}
        <div className="card p-5 border-l-4 border-l-[#6B2732] bg-gradient-to-br from-[#6B2732]/5 to-white shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-jost text-[11px] uppercase tracking-wider text-[#6B2732] font-semibold flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#6B2732]" /> Next Season Sourcing Focus
            </span>
            {topFabric && (
              <span className="font-jost text-xs text-[#6B2732] bg-[#6B2732]/10 px-2 py-0.5 rounded font-semibold">
                {topFabric.totalSold || 0} Units Sold
              </span>
            )}
          </div>
          {topFabric ? (
            <div>
              <p className="font-karla text-base font-semibold text-gray-900 truncate">
                {topFabric._id || 'Pure Silk'} Sarees
              </p>
              <p className="font-karla text-xs text-gray-500 mt-1">
                Highest turnover fabric across catalog. {topFabric.productCount} active styles with {topFabric.totalStock} units in stock.
              </p>
              <div className="mt-3 pt-3 border-t border-rose-100 text-xs font-karla text-gray-700">
                💡 <strong>Advice:</strong> Prioritize sourcing and new arrivals in {topFabric._id}.
              </div>
            </div>
          ) : (
            <p className="font-karla text-xs text-gray-400">Loading fabric velocity...</p>
          )}
        </div>

        {/* Top Converting Price Band */}
        <div className="card p-5 border-l-4 border-l-emerald-600 bg-gradient-to-br from-emerald-50/50 to-white shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-jost text-[11px] uppercase tracking-wider text-emerald-800 font-semibold flex items-center gap-1.5">
              <Percent className="w-3.5 h-3.5 text-emerald-600" /> Best Converting Price Band
            </span>
            {topPriceBand && (
              <span className="font-jost text-xs text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded font-semibold">
                {topPriceBand.totalSold || 0} Sold
              </span>
            )}
          </div>
          <div>
            <p className="font-karla text-base font-semibold text-gray-900">
              {topPriceBand ? topPriceBand.band : 'Catalog Demand'}
            </p>
            <p className="font-karla text-xs text-gray-500 mt-1">
              Customer buying sweet spot where sales volume is concentrated. {topPriceBand ? `${topPriceBand.productsCount} sarees listed in this price range.` : ''}
            </p>
            <div className="mt-3 pt-3 border-t border-emerald-100 text-xs font-karla text-emerald-900">
              💡 <strong>Advice:</strong> Price upcoming collections within this range for highest turnover.
            </div>
          </div>
        </div>
      </div>

      {/* FILTER TABS FOR DETAILED SECTIONS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-3">
        {[
          { id: 'all', label: 'Overview & All Analytics' },
          { id: 'topSarees', label: `🔥 Top Selling Sarees (${topSarees.length})` },
          { id: 'fabrics', label: '🧵 Fabric, Color & Price Band Demands' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`px-4 py-2 rounded-lg text-xs font-jost tracking-wide transition-all ${
              activeTab === t.id
                ? 'bg-[#6B2732] text-white font-medium shadow-xs'
                : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* SECTION 1: TOP SELLING SAREES (Which saree sells most & what to restock) */}
      {(activeTab === 'all' || activeTab === 'topSarees') && (
        <div className="card p-6 border border-gray-200 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-600" />
                <h3 className="font-cormorant text-2xl text-gray-900 font-medium">
                  Top Selling Sarees & Future Demand Analysis
                </h3>
              </div>
              <p className="font-karla text-xs text-gray-500 mt-1">
                Identify your bestsellers, spot fast-selling sarees running low on stock, and know which designs to reorder from weavers.
              </p>
            </div>
            <Link
              to="/products"
              className="btn-secondary text-xs px-3.5 py-1.5 self-start sm:self-auto inline-flex items-center gap-1.5"
            >
              Manage Catalog <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#FAF6EE] border-b border-[#DDD0BC]/60 font-jost text-[10px] tracking-[0.15em] uppercase text-[#6B2732] font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Rank & Saree</th>
                  <th className="px-5 py-3.5">Fabric & Cat</th>
                  <th className="px-5 py-3.5">Price</th>
                  <th className="px-5 py-3.5">Units Sold</th>
                  <th className="px-5 py-3.5">Gross Revenue</th>
                  <th className="px-5 py-3.5">Stock Left</th>
                  <th className="px-5 py-3.5">Demand Status</th>
                  <th className="px-5 py-3.5">Actionable Strategic Advice</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-karla text-sm">
                {isLoading ? (
                  [...Array(6)].map((_, i) => (
                    <tr key={i}><td colSpan={8} className="px-5 py-4"><div className="h-10 shimmer rounded" /></td></tr>
                  ))
                ) : topSarees.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-gray-400">
                      <ShoppingBag className="w-10 h-10 mx-auto mb-2 text-gray-300" />
                      <p className="font-medium text-gray-600">No saree sales recorded yet</p>
                      <p className="text-xs text-gray-400 mt-0.5">As customer purchases occur, performance rankings will appear here automatically.</p>
                    </td>
                  </tr>
                ) : (
                  topSarees.map((saree, idx) => {
                    const badgeConfig = DEMAND_BADGE_STYLES[saree.demandBadge] || DEMAND_BADGE_STYLES.HEALTHY;
                    const BadgeIcon = badgeConfig.icon;

                    return (
                      <tr key={saree._id} className="hover:bg-[#FBF4E9]/40 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <span className="font-jost text-xs font-bold text-gray-400 w-5">
                              #{idx + 1}
                            </span>
                            <div className="w-10 h-13 rounded bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                              {saree.image ? (
                                <img src={saree.image} alt={saree.name} className="w-full h-full object-cover" />
                              ) : (
                                <Package className="w-4 h-4 text-gray-300 m-auto mt-4" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900 leading-snug max-w-[200px] truncate">{saree.name}</p>
                              <p className="font-jost text-[10px] text-gray-400 uppercase tracking-wider">{saree.sku}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-xs text-gray-800 font-medium">{saree.fabric}</p>
                          <p className="text-[11px] text-gray-400">{saree.categoryName}</p>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-jost text-sm font-semibold text-[#6B2732]">
                            ₹{(saree.discountPrice || saree.price).toLocaleString('en-IN')}
                          </p>
                          {saree.discountPrice && (
                            <p className="font-jost text-[11px] text-gray-400 line-through">
                              ₹{saree.price.toLocaleString('en-IN')}
                            </p>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-jost text-sm font-bold text-gray-900 bg-gray-100 px-2.5 py-1 rounded">
                            {saree.soldCount}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-jost text-sm font-semibold text-emerald-700">
                            ₹{saree.totalRevenue.toLocaleString('en-IN')}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`font-jost text-xs font-bold px-2 py-0.5 rounded ${
                            saree.stock <= 0
                              ? 'bg-red-100 text-red-800'
                              : saree.stock <= 3
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-emerald-50 text-emerald-800'
                          }`}>
                            {saree.stock} left
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1 font-jost text-[10px] uppercase tracking-wider px-2 py-0.5 rounded border ${badgeConfig.badge}`}>
                            <BadgeIcon className="w-3 h-3" /> {badgeConfig.label}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-xs text-gray-700 leading-relaxed max-w-xs font-medium">
                            {saree.demandAdvice}
                          </p>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 2: FABRIC, COLOR & PRICE BAND DEMANDS */}
      {(activeTab === 'all' || activeTab === 'fabrics') && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Fabric Turnover Ranking */}
          <div className="card p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-cormorant text-2xl text-gray-900 font-medium">Fabric Demand Velocity</h3>
                <p className="font-karla text-xs text-gray-400 mt-0.5">Which fabrics sell best to customer base</p>
              </div>
              <Layers className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-3">
              {fabricStats.map((f, i) => (
                <div key={f._id || i} className="p-3 bg-gray-50 rounded border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 font-jost text-xs font-bold text-gray-400">#{i + 1}</span>
                    <div>
                      <p className="font-karla text-sm font-semibold text-gray-900">{f._id}</p>
                      <p className="font-jost text-[10px] text-gray-400 uppercase">{f.productCount} Styles · {f.totalStock} in stock</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-jost text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {f.totalSold || 0} Sold
                    </span>
                  </div>
                </div>
              ))}
              {fabricStats.length === 0 && (
                <p className="text-center py-6 text-xs text-gray-400 font-karla">No fabric data recorded yet</p>
              )}
            </div>
          </div>

          {/* Color Preferences */}
          <div className="card p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-cormorant text-2xl text-gray-900 font-medium">Customer Color Favorites</h3>
                <p className="font-karla text-xs text-gray-400 mt-0.5">Most in-demand saree colorways</p>
              </div>
              <Award className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-3">
              {colorStats.map((c, i) => (
                <div key={c._id || i} className="p-3 bg-gray-50 rounded border border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-5 font-jost text-xs font-bold text-gray-400">#{i + 1}</span>
                    <span className="font-karla text-sm font-semibold text-gray-900 capitalize">{c._id}</span>
                  </div>
                  <span className="font-jost text-xs font-bold text-[#6B2732] bg-[#6B2732]/10 px-2 py-0.5 rounded">
                    {c.totalSold || 0} Sarees Sold
                  </span>
                </div>
              ))}
              {colorStats.length === 0 && (
                <p className="text-center py-6 text-xs text-gray-400 font-karla">No color data recorded yet</p>
              )}
            </div>
          </div>

          {/* Price Sweet Spot */}
          <div className="card p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-cormorant text-2xl text-gray-900 font-medium">Price Sweet Spot</h3>
                <p className="font-karla text-xs text-gray-400 mt-0.5">Where customer purchases are clustered</p>
              </div>
              <Percent className="w-5 h-5 text-gray-400" />
            </div>

            <div className="space-y-4">
              {priceBands.map((pb) => (
                <div key={pb.band} className="space-y-1">
                  <div className="flex justify-between font-jost text-xs">
                    <span className="font-medium text-gray-800">{pb.band}</span>
                    <span className="font-semibold text-[#6B2732]">{pb.totalSold} sold ({pb.productsCount} products)</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#6B2732] h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, Math.max(5, (pb.totalSold / (analytics.totalOrders || 1)) * 100))}%`
                      }}
                    />
                  </div>
                </div>
              ))}
              {priceBands.length === 0 && (
                <p className="text-center py-6 text-xs text-gray-400 font-karla">Calculating price bands...</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 4: OVERVIEW CHARTS (Revenue Trend, Status Donut & Payment Share) */}
      {(activeTab === 'all') && (
        <div className="space-y-6">
          {/* Main Revenue & Order Volume Chart */}
          <div className="card p-6 border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <h3 className="font-cormorant text-2xl text-gray-900">Sales & Revenue Timeline</h3>
                <p className="font-karla text-xs text-gray-400 mt-0.5">Realized revenue and order volumes during the selected period</p>
              </div>
              <div className="flex items-center gap-4 text-xs font-jost text-gray-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#6B2732]" /> Revenue (₹)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-[#C99B4E]" /> Orders Placed
                </span>
              </div>
            </div>

            {isLoading ? (
              <div className="h-72 shimmer rounded-lg" />
            ) : trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="analyticsRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6B2732" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#6B2732" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#888', fontFamily: 'Jost' }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fontSize: 11, fill: '#888', fontFamily: 'Jost' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}k`} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11, fill: '#888', fontFamily: 'Jost' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(val, name) => [
                      name === 'revenue' ? `₹${Number(val).toLocaleString('en-IN')}` : val,
                      name === 'revenue' ? 'Revenue' : 'Orders'
                    ]}
                    contentStyle={{ fontFamily: 'Karla', fontSize: 12, borderRadius: '8px', border: '1px solid #e5e7eb' }}
                  />
                  <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#6B2732" strokeWidth={2.5} fill="url(#analyticsRev)" />
                  <Area yAxisId="right" type="monotone" dataKey="orders" stroke="#C99B4E" strokeWidth={2} fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
                <Calendar className="w-10 h-10 text-gray-300 mb-2" />
                <p className="font-karla text-sm font-medium text-gray-600">No Orders in Selected Timeframe</p>
                <p className="font-karla text-xs text-gray-400 mt-1 max-w-sm">
                  Try switching to "Last 90 Days" or "Past 1 Year" to see historical sales patterns.
                </p>
              </div>
            )}
          </div>

          {/* 2-Column Insight Grids: Order Status Breakdown & Payment Methods */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="card p-6 border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-cormorant text-2xl text-gray-900">Order Status Distribution</h3>
                    <p className="font-karla text-xs text-gray-400 mt-0.5">Proportion of orders by current lifecycle stage</p>
                  </div>
                  <PieIcon className="w-5 h-5 text-gray-400" />
                </div>

                {statusPieData.length > 0 ? (
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={statusPieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={3}
                        >
                          {statusPieData.map(entry => (
                            <Cell key={entry.name} fill={STATUS_COLORS[entry.rawStatus] || '#9CA3AF'} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(val, name, item) => [`${val} orders (₹${(item.payload.revenue || 0).toLocaleString('en-IN')})`, name]}
                          contentStyle={{ fontFamily: 'Karla', fontSize: 12, borderRadius: '8px', border: '1px solid #e5e7eb' }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontFamily: 'Jost', fontSize: 11 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-60 flex items-center justify-center text-gray-400 font-karla text-xs">
                    No status data available for this range
                  </div>
                )}
              </div>
            </div>

            <div className="card p-6 border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-cormorant text-2xl text-gray-900">Payment Methods Share</h3>
                    <p className="font-karla text-xs text-gray-400 mt-0.5">Prepaid vs Cash on Delivery distribution</p>
                  </div>
                  <CreditCard className="w-5 h-5 text-gray-400" />
                </div>

                {paymentPieData.length > 0 ? (
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={paymentPieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={50}
                          outerRadius={80}
                          paddingAngle={3}
                        >
                          {paymentPieData.map((entry, index) => (
                            <Cell key={entry.name} fill={PAYMENT_COLORS[index % PAYMENT_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(val, name, item) => [`${val} orders (₹${(item.payload.revenue || 0).toLocaleString('en-IN')})`, name]}
                          contentStyle={{ fontFamily: 'Karla', fontSize: 12, borderRadius: '8px', border: '1px solid #e5e7eb' }}
                        />
                        <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontFamily: 'Jost', fontSize: 11 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-60 flex items-center justify-center text-gray-400 font-karla text-xs">
                    No payment data available for this range
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
