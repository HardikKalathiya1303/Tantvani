import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Package, Heart, MapPin, Settings, LogOut, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import api from '../utils/api';
import toast from 'react-hot-toast';

const TABS = [
  { id: 'orders', label: 'My Orders', Icon: Package },
  { id: 'wishlist', label: 'Wishlist', Icon: Heart },
  { id: 'addresses', label: 'Addresses', Icon: MapPin },
  { id: 'settings', label: 'Settings', Icon: Settings },
];

const STATUS_STYLE = {
  pending:    'bg-yellow-50 text-yellow-700 border border-yellow-200',
  confirmed:  'bg-blue-50 text-blue-700 border border-blue-200',
  processing: 'bg-purple-50 text-purple-700 border border-purple-200',
  shipped:    'bg-indigo-50 text-indigo-700 border border-indigo-200',
  delivered:  'bg-green-50 text-green-700 border border-green-200',
  cancelled:  'bg-red-50 text-red-700 border border-red-200',
};

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('orders');
  const { user, logout } = useAuthStore();

  if (!user) return <Navigate to="/login" replace />;

  const { data: ordersData, isLoading: loadingOrders } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => api.get('/orders/my-orders').then(r => r.data),
    enabled: activeTab === 'orders',
  });

  const { data: meData } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.get('/auth/me').then(r => r.data),
  });

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
  };

  return (
    <div className="pb-24 min-h-screen bg-cream">
      {/* Header */}
      <div className="bg-cream-dark/50 py-10 sm:py-14 border-b border-cream-darker/30">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">
          <p className="eyebrow mb-3">Welcome back</p>
          <h1 className="font-cormorant text-3xl sm:text-4xl font-light text-wine-dark">{user.name}</h1>
          <p className="font-karla text-sm text-wine-dark/45 mt-1">{user.email}</p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 pt-8">
        {/* Mobile tab pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 mb-6 lg:hidden">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2 shrink-0 font-jost text-[10px] tracking-[0.18em] uppercase transition-all ${activeTab === id ? 'bg-wine text-cream-light' : 'bg-cream-dark/60 text-wine-dark/60 hover:text-wine-dark'}`}
            >
              <Icon className="w-3 h-3" /> {label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <nav className="space-y-1">
              {TABS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all duration-200 ${activeTab === id ? 'bg-wine text-cream-light' : 'text-wine-dark/65 hover:bg-cream-dark hover:text-wine-dark'}`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span className="font-jost text-[10px] tracking-[0.2em] uppercase">{label}</span>
                </button>
              ))}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-wine-dark/40 hover:text-wine transition-colors mt-4"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span className="font-jost text-[10px] tracking-[0.2em] uppercase">Logout</span>
              </button>
            </nav>
          </div>

          {/* Tab content */}
          <div className="lg:col-span-3">
            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="font-cormorant text-2xl text-wine-dark mb-6">My Orders</h2>
                {loadingOrders ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => <div key={i} className="h-28 shimmer" />)}
                  </div>
                ) : ordersData?.orders?.length === 0 ? (
                  <div className="text-center py-16 border border-dashed border-cream-darker/50">
                    <Package className="w-12 h-12 text-wine-dark/20 mx-auto mb-4" />
                    <p className="font-cormorant text-2xl text-wine-dark/40 mb-2">No orders yet</p>
                    <Link to="/collections" className="btn-outline mt-4 inline-flex">Start Shopping</Link>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {ordersData?.orders?.map(order => (
                      <div key={order._id} className="border border-cream-darker/40 p-5 sm:p-6 bg-cream-light">
                        <div className="flex items-start justify-between mb-4">
                          <div>
                            <p className="font-jost text-[10px] tracking-[0.2em] uppercase text-wine-dark/45">
                              Order #{order._id.slice(-8).toUpperCase()}
                            </p>
                            <p className="font-karla text-xs text-wine-dark/40 mt-1">
                              {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </p>
                          </div>
                          <span className={`font-jost text-[9px] tracking-[0.15em] uppercase px-2.5 py-1 ${STATUS_STYLE[order.orderStatus] || ''}`}>
                            {order.orderStatus}
                          </span>
                        </div>
                        <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1">
                          {order.orderItems.map(item => (
                            <div key={item._id} className="shrink-0 text-center">
                              <div className="w-14 h-18 bg-cream-dark overflow-hidden">
                                {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                              </div>
                              <p className="font-karla text-[10px] text-wine-dark/40 mt-1 max-w-[56px] truncate">{item.name}</p>
                            </div>
                          ))}
                        </div>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-cream-darker/30">
                          <p className="font-karla text-sm text-wine-dark/45">{order.orderItems.length} item{order.orderItems.length !== 1 ? 's' : ''}</p>
                          <p className="font-cormorant text-xl text-wine">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'wishlist' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="font-cormorant text-2xl text-wine-dark mb-6">Wishlist</h2>
                {!meData?.user?.wishlist?.length ? (
                  <div className="text-center py-16 border border-dashed border-cream-darker/50">
                    <Heart className="w-12 h-12 text-wine-dark/20 mx-auto mb-4" />
                    <p className="font-cormorant text-2xl text-wine-dark/40 mb-2">Your wishlist is empty</p>
                    <Link to="/collections" className="btn-outline mt-4 inline-flex">Explore Sarees</Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-5">
                    {meData.user.wishlist.map(p => (
                      <Link key={p._id} to={`/product/${p.slug}`} className="group block card-product">
                        <div className="aspect-portrait overflow-hidden bg-cream-dark">
                          {p.images?.[0] && (
                            <img src={p.images[0].url} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          )}
                        </div>
                        <div className="p-3">
                          <p className="font-cormorant text-base text-wine-dark group-hover:text-wine transition-colors line-clamp-2">{p.name}</p>
                          <p className="font-cormorant text-lg text-wine mt-1">₹{(p.discountPrice || p.price)?.toLocaleString('en-IN')}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'addresses' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="font-cormorant text-2xl text-wine-dark mb-6">Saved Addresses</h2>
                {!meData?.user?.addresses?.length ? (
                  <div className="text-center py-16 border border-dashed border-cream-darker/50">
                    <MapPin className="w-12 h-12 text-wine-dark/20 mx-auto mb-4" />
                    <p className="font-cormorant text-2xl text-wine-dark/40">No saved addresses</p>
                    <p className="body-sm text-wine-dark/35 mt-2">Addresses saved during checkout will appear here.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {meData.user.addresses.map(a => (
                      <div key={a._id} className="border border-cream-darker/40 p-5 bg-cream-light">
                        {a.isDefault && (
                          <span className="font-jost text-[9px] tracking-[0.15em] uppercase bg-gold/20 text-gold px-2 py-0.5 mb-3 inline-block">Default</span>
                        )}
                        <p className="font-karla text-sm font-medium text-wine-dark">{a.name || a.label}</p>
                        <p className="font-karla text-sm text-wine-dark/50 mt-1">{a.street}, {a.city}</p>
                        <p className="font-karla text-sm text-wine-dark/50">{a.state} — {a.pincode}</p>
                        {a.phone && <p className="font-karla text-sm text-wine-dark/40 mt-1">{a.phone}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <h2 className="font-cormorant text-2xl text-wine-dark mb-6">Account Settings</h2>
                <ProfileForm user={user} />
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileForm({ user }) {
  const [form, setForm] = useState({ name: user.name || '', phone: user.phone || '' });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/auth/profile', form);
      toast.success('Profile updated');
    } catch {
      toast.error('Update failed');
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-md">
      {[['name', 'Full Name', 'text'], ['phone', 'Phone', 'tel']].map(([key, label, type]) => (
        <div key={key}>
          <label className="font-jost text-[10px] tracking-[0.25em] uppercase text-wine-dark/55 block mb-2">{label}</label>
          <input type={type} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="input-field" />
        </div>
      ))}
      <div>
        <label className="font-jost text-[10px] tracking-[0.25em] uppercase text-wine-dark/55 block mb-2">Email</label>
        <input type="email" value={user.email} disabled className="input-field opacity-50 cursor-not-allowed" />
      </div>
      <button type="submit" className="btn-primary">Save Changes</button>
    </form>
  );
}
