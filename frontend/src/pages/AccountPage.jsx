import { useState, useRef, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Heart, MapPin, Settings, LogOut, ShoppingBag,
  Plus, Edit2, Trash2, Home, Briefcase, Check, X, Sparkles,
  MoreVertical, CheckCircle2, Phone, Mail
} from 'lucide-react';
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

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh'
];

const EMPTY_ADDR = {
  name: '',
  phone: '',
  alternatePhone: '',
  email: '',
  houseNo: '',
  street: '',
  landmark: '',
  city: '',
  state: 'Gujarat',
  pincode: '',
  country: 'India',
  addressType: 'Home',
  isDefault: false,
};

function MobileTabNav({ tabs, activeTab, onSelectTab }) {
  const scrollRef = useRef(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const maxScroll = scrollWidth - clientWidth;
      if (maxScroll > 0) {
        setScrollProgress((scrollLeft / maxScroll) * 100);
      }
    }
  };

  useEffect(() => {
    handleScroll();
  }, [activeTab]);

  return (
    <div className="mb-6 lg:hidden">
      {/* Scrollable Tabs */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-hide select-none"
      >
        {tabs.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onSelectTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl shrink-0 font-jost text-xs font-bold uppercase tracking-wider transition-all shadow-xs ${
              activeTab === id
                ? 'bg-black text-white shadow-sm'
                : 'bg-white text-neutral-600 border border-neutral-200 hover:text-black'
            }`}
          >
            <Icon className="w-3.5 h-3.5" /> {label}
          </button>
        ))}
      </div>

      {/* 100% Guaranteed Visible Sleek Scroll Indicator */}
      <div className="w-24 h-1 bg-neutral-300/80 rounded-full mx-auto mt-1.5 overflow-hidden relative">
        <div
          className="h-full bg-black rounded-full transition-all duration-150 absolute top-0"
          style={{
            width: '45%',
            left: `${Math.min(55, Math.max(0, scrollProgress * 0.55)).toFixed(1)}%`,
          }}
        />
      </div>
    </div>
  );
}

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
    <div className="pb-24 min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <div className="bg-white py-8 sm:py-12 border-b border-neutral-200">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">
          <span className="font-jost text-[10px] sm:text-xs tracking-[0.25em] uppercase text-gold font-bold flex items-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            Tantvani Member Portal
          </span>
          <h1 className="font-jost text-2xl sm:text-3xl lg:text-4xl font-bold text-black tracking-tight">
            Hello, {user.name}
          </h1>
          <p className="font-karla text-xs sm:text-sm text-neutral-500 mt-0.5">{user.email}</p>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8">
        {/* Mobile tab pills with guaranteed visible custom scrollbar */}
        <MobileTabNav tabs={TABS} activeTab={activeTab} onSelectTab={setActiveTab} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="bg-white border border-neutral-200 rounded-2xl p-3 shadow-xs space-y-1">
              {TABS.map(({ id, label, Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 font-jost text-xs font-bold uppercase tracking-wider ${
                    activeTab === id
                      ? 'bg-black text-white shadow-xs'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-black'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{label}</span>
                </button>
              ))}

              <div className="pt-2 mt-2 border-t border-neutral-100">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left font-jost text-xs font-bold uppercase tracking-wider text-red-500 hover:bg-red-50 hover:text-red-700 transition-colors"
                >
                  <LogOut className="w-4 h-4 shrink-0" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Tab content */}
          <div className="lg:col-span-3">
            {/* ORDERS TAB */}
            {activeTab === 'orders' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="pb-3 border-b border-neutral-200">
                  <h2 className="font-jost text-xl sm:text-2xl font-bold text-black tracking-tight">
                    Order History
                  </h2>
                  <p className="font-karla text-xs sm:text-sm text-neutral-500 mt-0.5">
                    Track and view invoices for all your handloom saree purchases.
                  </p>
                </div>

                {loadingOrders ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-32 bg-white rounded-2xl border border-neutral-200 animate-pulse" />
                    ))}
                  </div>
                ) : ordersData?.orders?.length === 0 ? (
                  <div className="text-center py-16 bg-white border border-neutral-200 rounded-2xl p-6">
                    <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <p className="font-jost text-lg font-bold text-black">No Orders Yet</p>
                    <p className="font-karla text-xs sm:text-sm text-neutral-500 mt-1 max-w-sm mx-auto">
                      Explore our handloom saree collections and place your first royal order today.
                    </p>
                    <Link
                      to="/collections"
                      className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-neutral-800 text-white font-jost text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs"
                    >
                      Explore Sarees
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {ordersData?.orders?.map(order => (
                      <div key={order._id} className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-6 shadow-xs">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-100 gap-2">
                          <div>
                            <span className="font-jost text-xs font-bold text-black uppercase tracking-wider">
                              Order #{order._id.slice(-8).toUpperCase()}
                            </span>
                            <p className="font-karla text-xs text-neutral-500 mt-0.5">
                              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                          <span className={`self-start sm:self-auto font-jost text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full ${STATUS_STYLE[order.orderStatus] || 'bg-neutral-100 text-neutral-700'}`}>
                            {order.orderStatus}
                          </span>
                        </div>

                        <div className="py-4 flex gap-3 overflow-x-auto scrollbar-hide">
                          {order.orderItems.map(item => (
                            <div key={item._id} className="shrink-0 flex items-center gap-3 p-2 rounded-xl bg-neutral-50 border border-neutral-200/60 min-w-[200px]">
                              <div className="w-12 h-16 rounded-lg overflow-hidden bg-neutral-100 shrink-0">
                                {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="font-jost text-xs font-bold text-black truncate">{item.name}</p>
                                <p className="font-karla text-[11px] text-neutral-500 mt-0.5">Qty: {item.quantity}</p>
                                <p className="font-jost text-xs font-bold text-black mt-0.5">₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-neutral-100">
                          <p className="font-karla text-xs text-neutral-500">
                            {order.orderItems.length} {order.orderItems.length === 1 ? 'Item' : 'Items'}
                          </p>
                          <p className="font-jost text-base font-bold text-black">
                            Total: ₹{order.totalPrice.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* WISHLIST TAB */}
            {activeTab === 'wishlist' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="pb-3 border-b border-neutral-200 flex items-center justify-between">
                  <div>
                    <h2 className="font-jost text-xl sm:text-2xl font-bold text-black tracking-tight">
                      My Wishlist
                    </h2>
                    <p className="font-karla text-xs sm:text-sm text-neutral-500 mt-0.5">
                      Your saved handloom sarees for future moments.
                    </p>
                  </div>
                  <Link
                    to="/wishlist"
                    className="font-jost text-xs font-bold uppercase tracking-wider text-black hover:underline"
                  >
                    View Full Wishlist →
                  </Link>
                </div>

                {!meData?.user?.wishlist?.length ? (
                  <div className="text-center py-16 bg-white border border-neutral-200 rounded-2xl p-6">
                    <Heart className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                    <p className="font-jost text-lg font-bold text-black">Your Wishlist is Empty</p>
                    <p className="font-karla text-xs sm:text-sm text-neutral-500 mt-1 max-w-sm mx-auto">
                      Save weaves you adore while browsing through our collections.
                    </p>
                    <Link
                      to="/collections"
                      className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-neutral-800 text-white font-jost text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs"
                    >
                      Explore Sarees
                    </Link>
                  </div>
                ) : (
                  <div className="bg-white border border-neutral-200 rounded-2xl p-6 text-center">
                    <p className="font-jost text-base font-bold text-black">
                      You have {meData.user.wishlist.length} {meData.user.wishlist.length === 1 ? 'saree' : 'sarees'} saved.
                    </p>
                    <Link
                      to="/wishlist"
                      className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-neutral-800 text-white font-jost text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs"
                    >
                      Go to Wishlist Page
                    </Link>
                  </div>
                )}
              </motion.div>
            )}

            {/* ADDRESSES TAB */}
            {activeTab === 'addresses' && (
              <AddressManager meData={meData} />
            )}

            {/* SETTINGS TAB */}
            {activeTab === 'settings' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                <div className="pb-3 border-b border-neutral-200">
                  <h2 className="font-jost text-xl sm:text-2xl font-bold text-black tracking-tight">
                    Account Profile Settings
                  </h2>
                  <p className="font-karla text-xs sm:text-sm text-neutral-500 mt-0.5">
                    Update your personal profile details.
                  </p>
                </div>
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
      toast.success('Profile updated successfully');
    } catch {
      toast.error('Profile update failed');
    }
  };
  return (
    <form onSubmit={handleSubmit} className="bg-white border border-neutral-200 rounded-2xl p-6 sm:p-7 shadow-xs space-y-4 max-w-lg">
      <div>
        <label className="block font-jost text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
          Full Name
        </label>
        <input
          type="text"
          value={form.name}
          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          className="w-full px-4 py-3 text-sm font-karla bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-black outline-none transition-all"
        />
      </div>
      <div>
        <label className="block font-jost text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
          Phone Number
        </label>
        <input
          type="tel"
          value={form.phone}
          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
          className="w-full px-4 py-3 text-sm font-karla bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-black outline-none transition-all font-mono"
        />
      </div>
      <div>
        <label className="block font-jost text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
          Email Address
        </label>
        <input
          type="email"
          value={user.email}
          disabled
          className="w-full px-4 py-3 text-sm font-karla bg-neutral-100 border border-neutral-200 rounded-xl opacity-60 cursor-not-allowed"
        />
      </div>
      <button
        type="submit"
        className="px-6 py-3 bg-black hover:bg-neutral-800 text-white font-jost text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs"
      >
        Save Profile Changes
      </button>
    </form>
  );
}

function AddressCardItem({ addr, onEdit, onDelete, onSetDefault }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close 3-dot dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div
      className={`relative bg-white border-2 rounded-2xl p-5 sm:p-6 transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-md ${
        addr.isDefault ? 'border-neutral-900 bg-neutral-50/20' : 'border-neutral-200 hover:border-neutral-300'
      }`}
    >
      <div>
        {/* Top Header with Badges & 3-Dot Menu */}
        <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-neutral-100">
          <div className="flex items-center gap-2">
            {addr.addressType && (
              <span className="text-[10px] font-jost font-bold tracking-wider uppercase px-2.5 py-1 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200 flex items-center gap-1.5">
                {addr.addressType === 'Work' ? <Briefcase className="w-3 h-3" /> : <Home className="w-3 h-3" />}
                {addr.addressType}
              </span>
            )}
            {addr.isDefault && (
              <span className="text-[10px] font-jost font-bold tracking-wider uppercase px-2.5 py-1 rounded-md bg-amber-100 text-amber-900 border border-amber-200 flex items-center gap-1">
                <Check className="w-3 h-3 text-amber-900" />
                Default Address
              </span>
            )}
          </div>

          {/* 3-Dot Action Button & Dropdown (ONLY for Default Toggle) */}
          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-neutral-500 hover:text-black hover:bg-neutral-100 transition-colors"
              title="Address options"
            >
              <MoreVertical className="w-4 h-4" />
            </button>

            {/* 3-Dot Dropdown Menu */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -6 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-9 w-44 bg-white rounded-xl shadow-xl border border-neutral-200 p-1.5 z-30 font-jost text-xs font-bold uppercase tracking-wider text-left"
                >
                  {addr.isDefault ? (
                    <div className="px-3 py-2 text-emerald-700 bg-emerald-50 rounded-lg flex items-center gap-2 cursor-default">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Default Address</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        onSetDefault(addr._id);
                      }}
                      className="w-full px-3 py-2 hover:bg-neutral-50 text-neutral-800 hover:text-black rounded-lg flex items-center gap-2 text-left transition-colors"
                    >
                      <Check className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Set as Default</span>
                    </button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Recipient Name */}
        <h3 className="font-jost text-base font-bold text-neutral-900">
          {addr.name || addr.label}
        </h3>

        {/* Formatted Address Details */}
        <div className="text-xs font-karla text-neutral-600 space-y-1 mt-2 leading-relaxed">
          {addr.houseNo && <p className="font-medium text-neutral-900">{addr.houseNo}</p>}
          <p>{addr.street}</p>
          {addr.landmark && (
            <p className="text-neutral-500 italic">Landmark: {addr.landmark}</p>
          )}
          <p className="font-medium text-neutral-900">
            {addr.city}, {addr.state} — <span className="font-mono font-bold text-black">{addr.pincode}</span>
          </p>

          <div className="pt-2 space-y-1">
            <p className="flex items-center gap-1.5 text-neutral-800 font-jost font-medium">
              <Phone className="w-3 h-3 text-neutral-500" />
              +91 {addr.phone} {addr.alternatePhone ? `| Alt: ${addr.alternatePhone}` : ''}
            </p>
            {addr.email && (
              <p className="flex items-center gap-1.5 text-neutral-600">
                <Mail className="w-3 h-3 text-neutral-400" />
                {addr.email}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Footer Action Row */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-neutral-100">
        <button
          type="button"
          onClick={() => onEdit(addr)}
          className="text-xs font-jost font-bold uppercase tracking-wider text-neutral-600 hover:text-black flex items-center gap-1.5 transition-colors"
        >
          <Edit2 className="w-3.5 h-3.5" />
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(addr._id)}
          className="text-xs font-jost font-bold uppercase tracking-wider text-red-500 hover:text-red-700 flex items-center gap-1.5 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Delete
        </button>
      </div>
    </div>
  );
}

function AddressManager({ meData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(EMPTY_ADDR);
  const qc = useQueryClient();
  const addresses = meData?.user?.addresses || [];

  const addMutation = useMutation({
    mutationFn: (data) => api.post('/auth/address', data),
    onSuccess: () => {
      qc.invalidateQueries(['me']);
      setIsEditing(false);
      setEditingId(null);
      setForm(EMPTY_ADDR);
      toast.success('Address added successfully!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to add address'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/auth/address/${id}`, data),
    onSuccess: () => {
      qc.invalidateQueries(['me']);
      setIsEditing(false);
      setEditingId(null);
      setForm(EMPTY_ADDR);
      toast.success('Address updated successfully!');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to update address'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.delete(`/auth/address/${id}`),
    onSuccess: () => {
      qc.invalidateQueries(['me']);
      toast.success('Address deleted');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to delete address'),
  });

  const setDefaultMutation = useMutation({
    mutationFn: (id) => api.put(`/auth/address/${id}/default`),
    onSuccess: () => {
      qc.invalidateQueries(['me']);
      toast.success('Default address updated');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Failed to set default address'),
  });

  const handleStartAdd = () => {
    setEditingId(null);
    setForm({
      ...EMPTY_ADDR,
      name: meData?.user?.name || '',
      email: meData?.user?.email || '',
      phone: meData?.user?.phone || '',
    });
    setIsEditing(true);
  };

  const handleStartEdit = (addr) => {
    setEditingId(addr._id);
    setForm({ ...EMPTY_ADDR, ...addr });
    setIsEditing(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.name?.trim() || !form.phone?.trim() || !form.street?.trim() || !form.city?.trim() || !form.pincode?.trim()) {
      toast.error('Please fill all required fields');
      return;
    }
    if (form.phone.replace(/\D/g, '').length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return;
    }
    if (form.pincode.replace(/\D/g, '').length !== 6) {
      toast.error('Please enter a valid 6-digit PIN code');
      return;
    }

    if (editingId) {
      updateMutation.mutate({ id: editingId, data: form });
    } else {
      addMutation.mutate(form);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-200">
        <div>
          <h2 className="font-jost text-xl sm:text-2xl font-bold text-black tracking-tight">
            Saved Delivery Addresses
          </h2>
          <p className="font-karla text-xs sm:text-sm text-neutral-500 mt-0.5">
            Manage multiple delivery locations for 1-click seamless checkout.
          </p>
        </div>
        {!isEditing && (
          <button
            onClick={handleStartAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-black hover:bg-neutral-800 text-white font-jost text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            Add New Address
          </button>
        )}
      </div>

      {/* Inline Add / Edit Form */}
      {isEditing ? (
        <form onSubmit={handleSave} className="bg-white border border-neutral-200 rounded-2xl p-5 sm:p-7 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
            <div>
              <h3 className="font-jost text-lg font-bold text-black">
                {editingId ? 'Edit Address Details' : 'Add New Delivery Address'}
              </h3>
              <p className="font-karla text-xs text-neutral-500 mt-0.5">
                Fill in your location details for precise delivery.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditingId(null);
              }}
              className="text-xs font-jost font-bold uppercase tracking-wider text-neutral-500 hover:text-black px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-all flex items-center gap-1"
            >
              <X className="w-3.5 h-3.5" />
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-jost text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full px-4 py-3 text-sm font-karla bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-black outline-none transition-all"
                placeholder="Radhika Sharma"
              />
            </div>

            <div>
              <label className="block font-jost text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                10-Digit Mobile <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-jost text-xs font-bold text-neutral-400">
                  +91
                </span>
                <input
                  type="tel"
                  maxLength={10}
                  required
                  value={form.phone}
                  onChange={(e) => setForm(f => ({ ...f, phone: e.target.value }))}
                  className="w-full pl-12 pr-4 py-3 text-sm font-karla bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-black outline-none transition-all font-mono"
                  placeholder="9876543210"
                />
              </div>
            </div>

            <div>
              <label className="block font-jost text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Alternate Mobile <span className="text-neutral-400 font-normal">(Optional)</span>
              </label>
              <input
                type="tel"
                maxLength={10}
                value={form.alternatePhone}
                onChange={(e) => setForm(f => ({ ...f, alternatePhone: e.target.value }))}
                className="w-full px-4 py-3 text-sm font-karla bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-black outline-none transition-all font-mono"
                placeholder="Optional backup phone"
              />
            </div>

            <div>
              <label className="block font-jost text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                className="w-full px-4 py-3 text-sm font-karla bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-black outline-none transition-all"
                placeholder="radhika@example.com"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-jost text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Flat / House No. / Building / Floor <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.houseNo}
                onChange={(e) => setForm(f => ({ ...f, houseNo: e.target.value }))}
                className="w-full px-4 py-3 text-sm font-karla bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-black outline-none transition-all"
                placeholder="Flat 402, Royal Residency, Wing B"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-jost text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Street / Area / Locality <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.street}
                onChange={(e) => setForm(f => ({ ...f, street: e.target.value }))}
                className="w-full px-4 py-3 text-sm font-karla bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-black outline-none transition-all"
                placeholder="Near Silk Heritage Chowk, Ring Road"
              />
            </div>

            <div>
              <label className="block font-jost text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                Landmark <span className="text-neutral-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={form.landmark}
                onChange={(e) => setForm(f => ({ ...f, landmark: e.target.value }))}
                className="w-full px-4 py-3 text-sm font-karla bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-black outline-none transition-all"
                placeholder="Opp. City Grand Temple"
              />
            </div>

            <div>
              <label className="block font-jost text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                6-Digit PIN Code <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                maxLength={6}
                required
                value={form.pincode}
                onChange={(e) => setForm(f => ({ ...f, pincode: e.target.value }))}
                className="w-full px-4 py-3 text-sm font-karla bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-black outline-none transition-all font-mono"
                placeholder="395007"
              />
            </div>

            <div>
              <label className="block font-jost text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                City / Town <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={form.city}
                onChange={(e) => setForm(f => ({ ...f, city: e.target.value }))}
                className="w-full px-4 py-3 text-sm font-karla bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-black outline-none transition-all"
                placeholder="Surat"
              />
            </div>

            <div>
              <label className="block font-jost text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                State <span className="text-red-500">*</span>
              </label>
              <select
                value={form.state}
                onChange={(e) => setForm(f => ({ ...f, state: e.target.value }))}
                className="w-full px-4 py-3 text-sm font-karla bg-neutral-50 border border-neutral-300 rounded-xl focus:bg-white focus:border-black outline-none transition-all cursor-pointer"
              >
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="pt-2 border-t border-neutral-100">
            <label className="block font-jost text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2.5">
              Address Type
            </label>
            <div className="flex flex-wrap gap-2.5">
              {[
                { id: 'Home', label: 'Home (All-Day)', Icon: Home },
                { id: 'Work', label: 'Work (9 AM - 6 PM)', Icon: Briefcase },
                { id: 'Other', label: 'Other', Icon: MapPin },
              ].map(({ id, label, Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, addressType: id }))}
                  className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-jost font-bold uppercase tracking-wider rounded-xl border transition-all ${
                    form.addressType === id
                      ? 'bg-black text-white border-black shadow-xs'
                      : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>

            <label className="flex items-center gap-2 mt-4 cursor-pointer text-xs font-karla text-neutral-700 select-none">
              <input
                type="checkbox"
                checked={form.isDefault}
                onChange={(e) => setForm(f => ({ ...f, isDefault: e.target.checked }))}
                className="w-4 h-4 rounded text-black border-neutral-300 focus:ring-black accent-black"
              />
              <span className="font-medium text-neutral-800">Set as my default delivery address</span>
            </label>
          </div>

          <div className="flex gap-3 pt-3 border-t border-neutral-100">
            <button
              type="submit"
              disabled={addMutation.isPending || updateMutation.isPending}
              className="px-6 py-3 bg-black hover:bg-neutral-800 text-white font-jost text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs disabled:opacity-60"
            >
              {addMutation.isPending || updateMutation.isPending ? 'Saving…' : (editingId ? 'Update Address' : 'Save Address')}
            </button>
            <button
              type="button"
              onClick={() => {
                setIsEditing(false);
                setEditingId(null);
              }}
              className="px-6 py-3 border border-neutral-300 hover:border-black font-jost text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : addresses.length === 0 ? (
        <div className="text-center py-16 bg-white border border-neutral-200 rounded-2xl p-6">
          <MapPin className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
          <p className="font-jost text-lg font-bold text-black">No Saved Addresses</p>
          <p className="font-karla text-xs sm:text-sm text-neutral-500 mt-1 max-w-sm mx-auto">
            Add your home or office delivery address for fast 1-click checkout.
          </p>
          <button
            onClick={handleStartAdd}
            className="mt-5 inline-flex items-center gap-2 px-6 py-3 bg-black hover:bg-neutral-800 text-white font-jost text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" /> Add Address
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
          {addresses.map((a) => (
            <AddressCardItem
              key={a._id}
              addr={a}
              onEdit={handleStartEdit}
              onDelete={handleDelete}
              onSetDefault={(id) => setDefaultMutation.mutate(id)}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}
