import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  CheckCircle, Banknote, CreditCard, Smartphone, Building2,
  MapPin, Plus, Trash2, Edit2, ShieldCheck, Truck, RotateCcw,
  Sparkles, Tag, ChevronRight, Home, Briefcase, Check, ArrowRight, X,
  ShoppingBag
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import api from '../utils/api';
import toast from 'react-hot-toast';

const loadRazorpayScript = () =>
  new Promise(resolve => {
    if (document.getElementById('razorpay-script')) return resolve(true);
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const STEPS = ['Shipping', 'Payment', 'Confirmed'];

const PAYMENT_OPTIONS = [
  { id: 'upi', Icon: Smartphone, label: 'UPI / QR Code', sub: 'Instant & Secure via GPay, PhonePe, Paytm, BHIM', popular: true },
  { id: 'card', Icon: CreditCard, label: 'Credit / Debit Cards', sub: 'Visa, Mastercard, RuPay, Diners & Amex', popular: false },
  { id: 'netbanking', Icon: Building2, label: 'Net Banking', sub: 'All major Indian private & PSU banks', popular: false },
  { id: 'cod', Icon: Banknote, label: 'Cash on Delivery (COD)', sub: 'Pay with cash or UPI at delivery doorstep', popular: false },
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry', 'Chandigarh'
];

const EMPTY_ADDRESS = {
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

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [orderId, setOrderId] = useState(null);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState(EMPTY_ADDRESS);

  // Coupon state
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('upi');

  const { items, clearCart } = useCartStore();
  const { user, token } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Fetch logged in user details with saved addresses
  const { data: meData, refetch: refetchMe } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.get('/auth/me').then(r => r.data),
    enabled: !!token,
  });

  const savedAddresses = meData?.user?.addresses || user?.addresses || [];

  // Pre-select default address or first saved address
  useEffect(() => {
    if (savedAddresses.length > 0 && !selectedAddressId && !isAddingNew) {
      const defaultAddr = savedAddresses.find(a => a.isDefault) || savedAddresses[0];
      setSelectedAddressId(defaultAddr._id);
      setAddressForm({ ...EMPTY_ADDRESS, ...defaultAddr });
    } else if (savedAddresses.length === 0) {
      setIsAddingNew(true);
      if (user) {
        setAddressForm(prev => ({
          ...prev,
          name: prev.name || user.name || '',
          email: prev.email || user.email || '',
          phone: prev.phone || user.phone || '',
        }));
      }
    }
  }, [savedAddresses, user]);

  // Pricing calculations
  const subtotal = items.reduce((s, i) => s + (i.discountPrice || i.price) * i.quantity, 0);
  const originalSubtotal = items.reduce((s, i) => s + (i.price || i.discountPrice) * i.quantity, 0);
  const productDiscount = Math.max(0, originalSubtotal - subtotal);

  // Coupon calculations
  let couponDiscount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') {
      couponDiscount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else if (appliedCoupon.type === 'flat') {
      couponDiscount = appliedCoupon.value;
    }
  }

  const discountedSubtotal = Math.max(0, subtotal - couponDiscount);
  const shipping = discountedSubtotal >= 2000 ? 0 : 99;
  const tax = Math.round(discountedSubtotal * 0.05); // 5% Handloom GST
  const grandTotal = discountedSubtotal + shipping + tax;
  const totalSavings = productDiscount + couponDiscount + (shipping === 0 && subtotal >= 2000 ? 99 : 0);

  // Add Address Mutation
  const addAddressMutation = useMutation({
    mutationFn: (newAddr) => api.post('/auth/address', newAddr),
    onSuccess: (res) => {
      queryClient.invalidateQueries(['me']);
      refetchMe();
      const created = res.data?.newAddress || res.data?.addresses?.[res.data.addresses.length - 1];
      if (created?._id) {
        setSelectedAddressId(created._id);
      }
      setIsAddingNew(false);
      setEditingAddressId(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to save address');
    },
  });

  // Update Address Mutation
  const updateAddressMutation = useMutation({
    mutationFn: ({ id, data }) => api.put(`/auth/address/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['me']);
      refetchMe();
      setIsAddingNew(false);
      setEditingAddressId(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to update address');
    },
  });

  // Delete Address Mutation
  const deleteAddressMutation = useMutation({
    mutationFn: (id) => api.delete(`/auth/address/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries(['me']);
      refetchMe();
      toast.success('Address removed');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to delete address');
    },
  });

  const getActiveShippingAddress = () => {
    if (!isAddingNew && selectedAddressId) {
      const found = savedAddresses.find(a => a._id === selectedAddressId);
      if (found) {
        return {
          name: found.name,
          phone: found.phone,
          alternatePhone: found.alternatePhone || '',
          email: found.email || user?.email || '',
          houseNo: found.houseNo || '',
          street: found.street || '',
          landmark: found.landmark || '',
          city: found.city,
          state: found.state,
          pincode: found.pincode,
          country: found.country || 'India',
          addressType: found.addressType || 'Home',
        };
      }
    }
    return {
      name: addressForm.name,
      phone: addressForm.phone,
      alternatePhone: addressForm.alternatePhone || '',
      email: addressForm.email || user?.email || '',
      houseNo: addressForm.houseNo || '',
      street: addressForm.street || '',
      landmark: addressForm.landmark || '',
      city: addressForm.city,
      state: addressForm.state,
      pincode: addressForm.pincode,
      country: addressForm.country || 'India',
      addressType: addressForm.addressType || 'Home',
    };
  };

  // Order Placement Mutation
  const orderMutation = useMutation({
    mutationFn: () => {
      const activeShippingAddress = getActiveShippingAddress();
      return api.post('/orders', {
        orderItems: items.map(i => ({
          product: i._id,
          name: i.name,
          image: i.images?.[0]?.url || '',
          price: i.discountPrice || i.price,
          quantity: i.quantity,
        })),
        shippingAddress: activeShippingAddress,
        paymentMethod,
        itemsPrice: subtotal,
        shippingPrice: shipping,
        taxPrice: tax,
        totalPrice: grandTotal,
      });
    },
    onSuccess: ({ data }) => {
      setOrderId(data.order._id);
      clearCart();
      setStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Could not place order. Please try again.');
    },
  });

  const handleFormChange = (key) => (e) => {
    setAddressForm(prev => ({ ...prev, [key]: e.target.value }));
  };

  const handleSelectSavedAddress = (addr) => {
    setSelectedAddressId(addr._id);
    setAddressForm({ ...EMPTY_ADDRESS, ...addr });
    setIsAddingNew(false);
    setEditingAddressId(null);
  };

  const handleStartEdit = (addr, e) => {
    e.stopPropagation();
    setEditingAddressId(addr._id);
    setAddressForm({ ...EMPTY_ADDRESS, ...addr });
    setIsAddingNew(true);
  };

  const handleDeleteAddress = (id, e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this address?')) {
      deleteAddressMutation.mutate(id);
      if (selectedAddressId === id) {
        const remaining = savedAddresses.filter(a => a._id !== id);
        if (remaining.length > 0) {
          setSelectedAddressId(remaining[0]._id);
          setAddressForm({ ...EMPTY_ADDRESS, ...remaining[0] });
        } else {
          setSelectedAddressId(null);
          setIsAddingNew(true);
          setAddressForm(EMPTY_ADDRESS);
        }
      }
    }
  };

  const validateAddressForm = () => {
    const required = [
      { key: 'name', label: 'Full Name' },
      { key: 'phone', label: '10-digit Phone Number' },
      { key: 'houseNo', label: 'Flat / House No. / Building' },
      { key: 'street', label: 'Street / Area / Locality' },
      { key: 'city', label: 'City' },
      { key: 'state', label: 'State' },
      { key: 'pincode', label: '6-digit PIN Code' },
    ];

    for (const { key, label } of required) {
      if (!addressForm[key]?.toString().trim()) {
        toast.error(`Please enter ${label}`);
        return false;
      }
    }

    if (addressForm.phone.replace(/\D/g, '').length < 10) {
      toast.error('Please enter a valid 10-digit mobile number');
      return false;
    }

    if (addressForm.pincode.replace(/\D/g, '').length !== 6) {
      toast.error('Please enter a valid 6-digit PIN code');
      return false;
    }

    return true;
  };

  const handleProceedFromShipping = async () => {
    if (isAddingNew || savedAddresses.length === 0) {
      if (!validateAddressForm()) return;

      // Always automatically save to account if user is logged in
      if (token) {
        if (editingAddressId) {
          updateAddressMutation.mutate({ id: editingAddressId, data: addressForm });
        } else {
          addAddressMutation.mutate(addressForm);
        }
      }
    } else {
      if (!selectedAddressId) {
        toast.error('Please select a delivery address');
        return;
      }
    }

    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyCoupon = (e) => {
    e?.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) {
      toast.error('Please enter a coupon code');
      return;
    }

    if (code === 'TANTVANI10') {
      setAppliedCoupon({ code, value: 10, type: 'percentage', label: '10% Handloom Welcome Discount' });
      toast.success('Coupon "TANTVANI10" applied! 10% discount added.');
      setCouponCode('');
    } else if (code === 'ROYAL2000') {
      if (subtotal < 20000) {
        toast.error('ROYAL2000 requires a minimum order value of ₹20,000');
        return;
      }
      setAppliedCoupon({ code, value: 2000, type: 'flat', label: '₹2,000 Royal Wedding Discount' });
      toast.success('Coupon "ROYAL2000" applied! ₹2,000 flat discount added.');
      setCouponCode('');
    } else if (code === 'HERITAGE500') {
      if (subtotal < 5000) {
        toast.error('HERITAGE500 requires a minimum order value of ₹5,000');
        return;
      }
      setAppliedCoupon({ code, value: 500, type: 'flat', label: '₹500 Heritage Artisan Discount' });
      toast.success('Coupon "HERITAGE500" applied! ₹500 discount added.');
      setCouponCode('');
    } else {
      toast.error('Invalid or expired coupon code');
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toast.success('Coupon removed');
  };

  if (items.length === 0 && step !== 2) {
    return (
      <div className="min-h-screen bg-white pt-24 sm:pt-28 pb-20 flex items-center justify-center">
        <div className="text-center max-w-md px-4 space-y-6">
          <div className="w-20 h-20 rounded-full bg-neutral-100 border border-neutral-200 mx-auto flex items-center justify-center text-neutral-400 shadow-xs">
            <ShoppingBag className="w-9 h-9 text-neutral-500" />
          </div>
          <div className="space-y-2">
            <h1 className="font-jost text-2xl sm:text-3xl font-bold text-black tracking-tight">
              Your Bag is Empty
            </h1>
            <p className="font-karla text-sm text-neutral-500">
              There are no sarees in your shopping bag to checkout.
            </p>
          </div>
          <Link
            to="/collections"
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-black hover:bg-neutral-800 text-white font-jost text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md"
          >
            Explore Sarees <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-2 sm:pt-4 lg:pt-16 pb-24">
      <div className="max-w-screen-xl mx-auto px-3.5 sm:px-6 lg:px-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-4 text-[11px] sm:text-xs text-neutral-500 font-jost uppercase tracking-wider">
          <Link to="/" className="hover:text-black transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-400" />
          <Link to="/cart" className="hover:text-black transition-colors">Shopping Bag</Link>
          <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-400" />
          <span className="text-black font-bold">Secure Checkout</span>
        </nav>

        {/* Stepper Header */}
        <div className="mb-6 sm:mb-10 text-center max-w-2xl mx-auto">
          <span className="font-jost text-[10px] sm:text-xs tracking-[0.25em] uppercase text-gold font-bold flex items-center justify-center gap-1.5 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            Express Pan-India Handloom Delivery
          </span>
          <h1 className="font-jost text-2xl sm:text-3xl lg:text-4xl font-bold text-black tracking-tight">
            {step === 0 && 'Delivery & Shipping Details'}
            {step === 1 && 'Choose Payment Method'}
            {step === 2 && 'Order Placed Successfully'}
          </h1>

          {/* Stepper Progress Bar */}
          <div className="flex items-center justify-center mt-6 max-w-md mx-auto">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-initial">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-jost font-bold transition-all duration-300 shadow-xs ${
                    i < step
                      ? 'bg-emerald-600 text-white'
                      : i === step
                      ? 'bg-black text-white ring-4 ring-black/10'
                      : 'bg-white text-neutral-400 border border-neutral-300'
                  }`}>
                    {i < step ? <Check className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className={`font-jost text-[11px] font-bold tracking-wider uppercase hidden sm:block ${
                    i === step ? 'text-black' : i < step ? 'text-emerald-700' : 'text-neutral-400'
                  }`}>
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-3 transition-colors duration-500 ${
                    i < step ? 'bg-emerald-600' : 'bg-neutral-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          {/* Left Column (Forms & Selection - 7/12) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-6">
            
            {/* STEP 0: SHIPPING ADDRESS */}
            {step === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Saved Addresses Section (If user has addresses) */}
                {savedAddresses.length > 0 && !isAddingNew && (
                  <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 sm:p-7 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-100">
                      <div>
                        <h2 className="font-jost text-lg sm:text-xl font-bold text-black tracking-tight">
                          Select Delivery Address
                        </h2>
                        <p className="font-karla text-xs sm:text-sm text-neutral-500 mt-0.5">
                          Choose from your saved addresses or add a new delivery location.
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setIsAddingNew(true);
                          setEditingAddressId(null);
                          setAddressForm({
                            ...EMPTY_ADDRESS,
                            name: user?.name || '',
                            email: user?.email || '',
                            phone: user?.phone || '',
                          });
                        }}
                        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-black text-white text-xs font-jost font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add New Address
                      </button>
                    </div>

                    {/* Address Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
                      {savedAddresses.map((addr) => {
                        const isSelected = selectedAddressId === addr._id;
                        return (
                          <div
                            key={addr._id}
                            onClick={() => handleSelectSavedAddress(addr)}
                            className={`relative border-2 rounded-xl p-4 sm:p-5 cursor-pointer transition-all duration-200 flex flex-col justify-between ${
                              isSelected
                                ? 'border-black bg-neutral-50/50 shadow-sm'
                                : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-xs'
                            }`}
                          >
                            {/* Card Header */}
                            <div>
                              <div className="flex items-center justify-between gap-2 mb-2.5">
                                <div className="flex items-center gap-2">
                                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                                    isSelected ? 'border-black bg-black' : 'border-neutral-400'
                                  }`}>
                                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                                  </div>
                                  <span className="font-jost text-sm font-bold text-black flex items-center gap-1.5">
                                    {addr.name}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  {addr.addressType && (
                                    <span className="text-[10px] font-jost font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-700 border border-neutral-200 flex items-center gap-1">
                                      {addr.addressType === 'Work' ? <Briefcase className="w-2.5 h-2.5" /> : <Home className="w-2.5 h-2.5" />}
                                      {addr.addressType}
                                    </span>
                                  )}
                                  {addr.isDefault && (
                                    <span className="text-[10px] font-jost font-bold tracking-wider uppercase px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-200 font-bold">
                                      Default
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Formatted Address Text */}
                              <div className="text-xs font-karla text-neutral-600 space-y-1 pl-6 leading-relaxed">
                                {addr.houseNo && <p className="font-medium text-neutral-900">{addr.houseNo}</p>}
                                <p>{addr.street}</p>
                                {addr.landmark && (
                                  <p className="text-neutral-500 italic">Landmark: {addr.landmark}</p>
                                )}
                                <p className="font-medium text-neutral-900">
                                  {addr.city}, {addr.state} — <span className="font-mono font-bold text-black">{addr.pincode}</span>
                                </p>
                                <p className="text-neutral-700 pt-1 font-jost">
                                  📞 +91 {addr.phone} {addr.alternatePhone ? `| Alt: ${addr.alternatePhone}` : ''}
                                </p>
                                {addr.email && <p className="text-neutral-500 text-[11px]">✉️ {addr.email}</p>}
                              </div>
                            </div>

                            {/* Card Footer Actions */}
                            <div className="flex items-center justify-between pt-4 mt-3 border-t border-neutral-100 pl-6">
                              <button
                                type="button"
                                onClick={(e) => handleStartEdit(addr, e)}
                                className="text-xs font-jost font-bold uppercase tracking-wider text-neutral-600 hover:text-black flex items-center gap-1 transition-colors"
                              >
                                <Edit2 className="w-3 h-3" /> Edit
                              </button>

                              <button
                                type="button"
                                onClick={(e) => handleDeleteAddress(addr._id, e)}
                                className="text-xs font-jost font-bold uppercase tracking-wider text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" /> Remove
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* New / Edit Address Form */}
                {(isAddingNew || savedAddresses.length === 0) && (
                  <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 sm:p-7 shadow-xs space-y-6">
                    <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                      <div>
                        <h2 className="font-jost text-lg sm:text-xl font-bold text-black tracking-tight">
                          {editingAddressId ? 'Edit Delivery Address' : 'Add New Delivery Address'}
                        </h2>
                        <p className="font-karla text-xs sm:text-sm text-neutral-500 mt-0.5">
                          Please provide complete address details to ensure safe and prompt delivery.
                        </p>
                      </div>

                      {savedAddresses.length > 0 && (
                        <button
                          onClick={() => {
                            setIsAddingNew(false);
                            setEditingAddressId(null);
                          }}
                          className="text-xs font-jost font-bold uppercase tracking-wider text-neutral-500 hover:text-black px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-all flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          Cancel
                        </button>
                      )}
                    </div>

                    {/* Address Form Inputs */}
                    <div className="space-y-5">
                      {/* Section 1: Contact Information */}
                      <div>
                        <h3 className="font-jost text-xs font-bold uppercase tracking-[0.2em] text-neutral-400 mb-3 flex items-center gap-1.5">
                          <span>1. Contact Information</span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block font-jost text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                              Recipient Full Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Radhika Sharma"
                              value={addressForm.name}
                              onChange={handleFormChange('name')}
                              className="w-full px-4 py-3 text-sm font-karla bg-neutral-50/70 border border-neutral-300 rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                            />
                          </div>

                          <div>
                            <label className="block font-jost text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                              10-Digit Mobile Number <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-jost text-xs font-bold text-neutral-400">
                                +91
                              </span>
                              <input
                                type="tel"
                                maxLength={10}
                                required
                                placeholder="9876543210"
                                value={addressForm.phone}
                                onChange={handleFormChange('phone')}
                                className="w-full pl-12 pr-4 py-3 text-sm font-karla bg-neutral-50/70 border border-neutral-300 rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all font-mono"
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
                              placeholder="Optional backup phone"
                              value={addressForm.alternatePhone}
                              onChange={handleFormChange('alternatePhone')}
                              className="w-full px-4 py-3 text-sm font-karla bg-neutral-50/70 border border-neutral-300 rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all font-mono"
                            />
                          </div>

                          <div>
                            <label className="block font-jost text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                              Email Address <span className="text-neutral-400 font-normal">(For tracking & invoice)</span>
                            </label>
                            <input
                              type="email"
                              placeholder="radhika@example.com"
                              value={addressForm.email}
                              onChange={handleFormChange('email')}
                              className="w-full px-4 py-3 text-sm font-karla bg-neutral-50/70 border border-neutral-300 rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Section 2: Address Location */}
                      <div className="pt-2">
                        <h3 className="font-jost text-xs font-bold uppercase tracking-[0.2em] text-neutral-400 mb-3 flex items-center gap-1.5">
                          <span>2. Delivery Address</span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="sm:col-span-2">
                            <label className="block font-jost text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                              Flat / House No. / Building / Floor / Apartment <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Flat 402, Royal Residency, Wing B"
                              value={addressForm.houseNo}
                              onChange={handleFormChange('houseNo')}
                              className="w-full px-4 py-3 text-sm font-karla bg-neutral-50/70 border border-neutral-300 rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block font-jost text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                              Area / Street / Sector / Village / Road <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Near Silk Heritage Chowk, Ring Road"
                              value={addressForm.street}
                              onChange={handleFormChange('street')}
                              className="w-full px-4 py-3 text-sm font-karla bg-neutral-50/70 border border-neutral-300 rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                            />
                          </div>

                          <div>
                            <label className="block font-jost text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                              Landmark <span className="text-neutral-400 font-normal">(Optional)</span>
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Opp. City Grand Temple"
                              value={addressForm.landmark}
                              onChange={handleFormChange('landmark')}
                              className="w-full px-4 py-3 text-sm font-karla bg-neutral-50/70 border border-neutral-300 rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
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
                              placeholder="e.g. 395007"
                              value={addressForm.pincode}
                              onChange={handleFormChange('pincode')}
                              className="w-full px-4 py-3 text-sm font-karla bg-neutral-50/70 border border-neutral-300 rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all font-mono"
                            />
                          </div>

                          <div>
                            <label className="block font-jost text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                              Town / City <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Surat"
                              value={addressForm.city}
                              onChange={handleFormChange('city')}
                              className="w-full px-4 py-3 text-sm font-karla bg-neutral-50/70 border border-neutral-300 rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all"
                            />
                          </div>

                          <div>
                            <label className="block font-jost text-xs font-bold uppercase tracking-wider text-neutral-700 mb-1.5">
                              State <span className="text-red-500">*</span>
                            </label>
                            <select
                              value={addressForm.state}
                              onChange={handleFormChange('state')}
                              className="w-full px-4 py-3 text-sm font-karla bg-neutral-50/70 border border-neutral-300 rounded-xl focus:bg-white focus:border-black focus:ring-1 focus:ring-black outline-none transition-all cursor-pointer"
                            >
                              {INDIAN_STATES.map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Address Type & Default Choice */}
                      <div className="pt-2 border-t border-neutral-100">
                        <label className="block font-jost text-xs font-bold uppercase tracking-wider text-neutral-700 mb-2.5">
                          Address Type
                        </label>
                        <div className="flex flex-wrap gap-3">
                          {[
                            { id: 'Home', label: 'Home (All Day Delivery)', Icon: Home },
                            { id: 'Work', label: 'Work (9 AM - 6 PM)', Icon: Briefcase },
                            { id: 'Other', label: 'Other', Icon: MapPin },
                          ].map(({ id, label, Icon }) => (
                            <button
                              key={id}
                              type="button"
                              onClick={() => setAddressForm(prev => ({ ...prev, addressType: id }))}
                              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-jost font-bold uppercase tracking-wider transition-all ${
                                addressForm.addressType === id
                                  ? 'border-black bg-black text-white shadow-xs'
                                  : 'border-neutral-200 bg-neutral-50/70 text-neutral-700 hover:border-neutral-300'
                              }`}
                            >
                              <Icon className="w-3.5 h-3.5" />
                              {label}
                            </button>
                          ))}
                        </div>

                        {/* Clean Single Default Checkbox */}
                        {token && (
                          <div className="mt-4 pt-3 border-t border-neutral-100">
                            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-karla text-neutral-800 select-none">
                              <input
                                type="checkbox"
                                checked={addressForm.isDefault}
                                onChange={(e) => setAddressForm(prev => ({ ...prev, isDefault: e.target.checked }))}
                                className="w-4 h-4 rounded text-black border-neutral-300 focus:ring-black accent-black"
                              />
                              <span className="font-medium">Set as my default delivery address</span>
                            </label>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Continue to Payment CTA */}
                <div className="pt-2">
                  <button
                    onClick={handleProceedFromShipping}
                    className="w-full sm:w-auto px-10 py-4 bg-black hover:bg-neutral-800 text-white font-jost text-xs sm:text-sm font-bold uppercase tracking-widest rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    Continue to Payment Method
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 1: PAYMENT METHOD */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-neutral-200/90 rounded-2xl p-5 sm:p-7 shadow-xs space-y-6"
              >
                <div>
                  <h2 className="font-jost text-lg sm:text-xl font-bold text-black tracking-tight">
                    Select Payment Method
                  </h2>
                  <p className="font-karla text-xs sm:text-sm text-neutral-500 mt-0.5">
                    All transactions are 100% bank-grade encrypted and securely processed.
                  </p>
                </div>

                {/* Selected Delivery Address Preview */}
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-700 shrink-0 mt-0.5">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-karla text-neutral-700">
                      <p className="font-jost font-bold text-black text-sm">
                        Delivering to {getActiveShippingAddress().name} ({getActiveShippingAddress().phone})
                      </p>
                      <p className="text-neutral-500 line-clamp-1 mt-0.5">
                        {getActiveShippingAddress().houseNo ? `${getActiveShippingAddress().houseNo}, ` : ''}
                        {getActiveShippingAddress().street}, {getActiveShippingAddress().city}, {getActiveShippingAddress().state} - {getActiveShippingAddress().pincode}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setStep(0)}
                    className="text-xs font-jost font-bold uppercase tracking-wider text-neutral-900 hover:underline shrink-0"
                  >
                    Change
                  </button>
                </div>

                {/* Payment Options */}
                <div className="space-y-3.5">
                  {PAYMENT_OPTIONS.map(({ id, Icon, label, sub, popular }) => {
                    const isChecked = paymentMethod === id;
                    return (
                      <label
                        key={id}
                        className={`relative flex items-center gap-4 p-4 sm:p-5 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          isChecked
                            ? 'border-black bg-neutral-50/60 shadow-xs'
                            : 'border-neutral-200 hover:border-neutral-300 bg-white'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={id}
                          checked={isChecked}
                          onChange={() => setPaymentMethod(id)}
                          className="sr-only"
                        />
                        
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center border transition-all ${
                          isChecked ? 'border-black bg-black text-white' : 'border-neutral-200 bg-neutral-50 text-neutral-600'
                        }`}>
                          <Icon className="w-5 h-5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-jost text-xs sm:text-sm font-bold uppercase tracking-wider text-black">
                              {label}
                            </p>
                            {popular && (
                              <span className="text-[9px] font-jost font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                                Fastest
                              </span>
                            )}
                          </div>
                          <p className="font-karla text-xs text-neutral-500 mt-0.5">{sub}</p>
                        </div>

                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isChecked ? 'border-black bg-black' : 'border-neutral-300'
                        }`}>
                          {isChecked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </label>
                    );
                  })}
                </div>

                {/* Place Order CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-100">
                  <button
                    onClick={() => setStep(0)}
                    className="px-6 py-3.5 border border-neutral-300 hover:border-black font-jost text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                  >
                    Back to Address
                  </button>

                  <button
                    onClick={() => orderMutation.mutate()}
                    disabled={orderMutation.isPending}
                    className="flex-1 px-8 py-4 bg-black hover:bg-neutral-800 text-white font-jost text-xs sm:text-sm font-bold uppercase tracking-widest rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-60 flex items-center justify-center gap-2"
                  >
                    {orderMutation.isPending ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing Your Order…
                      </>
                    ) : (
                      <>
                        Place Order & Pay ₹{grandTotal.toLocaleString('en-IN')}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: ORDER CONFIRMATION */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white border border-neutral-200 rounded-2xl p-8 sm:p-12 text-center shadow-sm space-y-6"
              >
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-xs">
                  <CheckCircle className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                  <span className="font-jost text-xs font-bold uppercase tracking-[0.25em] text-gold">
                    Order Confirmed
                  </span>
                  <h2 className="font-jost text-2xl sm:text-4xl font-bold text-black tracking-tight">
                    Thank You for Your Order!
                  </h2>
                  <p className="font-karla text-sm sm:text-base text-neutral-600 max-w-md mx-auto">
                    Your exquisite handloom saree order has been placed successfully. A confirmation message and tracking link will be sent to your mobile & email.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 inline-block text-left max-w-md w-full">
                  <div className="flex justify-between items-center pb-2 border-b border-neutral-200 text-xs font-jost">
                    <span className="text-neutral-500 uppercase tracking-wider">Order Reference</span>
                    <span className="font-mono font-bold text-black">#{orderId?.slice(-8).toUpperCase() || 'TNTV-7821'}</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 text-xs font-jost">
                    <span className="text-neutral-500 uppercase tracking-wider">Estimated Delivery</span>
                    <span className="font-bold text-emerald-700">3 - 5 Business Days</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                  <Link
                    to="/account"
                    className="px-8 py-3.5 bg-black hover:bg-neutral-800 text-white font-jost text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md"
                  >
                    Track Order in Account
                  </Link>
                  <Link
                    to="/collections"
                    className="px-8 py-3.5 border border-neutral-300 hover:border-black font-jost text-xs font-bold uppercase tracking-widest rounded-xl transition-all"
                  >
                    Continue Shopping
                  </Link>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column: Luxury Order Summary & Product Showcase (5/12) */}
          {step < 2 && (
            <div className="lg:col-span-5 xl:col-span-4">
              <div className="bg-white border border-neutral-200/90 rounded-2xl p-5 sm:p-6 shadow-sm space-y-6 lg:sticky lg:top-28">
                {/* Header */}
                <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                  <h3 className="font-jost text-base sm:text-lg font-bold text-black tracking-tight flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-black" />
                    Order Summary
                  </h3>
                  <span className="text-xs font-jost font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 border border-neutral-200">
                    {items.reduce((s, i) => s + i.quantity, 0)} {items.reduce((s, i) => s + i.quantity, 0) === 1 ? 'Saree' : 'Sarees'}
                  </span>
                </div>

                {/* Product List */}
                <div className="space-y-3.5 max-h-72 overflow-y-auto pr-1">
                  {items.map((item) => {
                    const price = item.discountPrice || item.price;
                    const originalPrice = item.price || item.discountPrice;
                    return (
                      <div
                        key={item._id}
                        className="flex gap-3.5 p-2.5 rounded-xl border border-neutral-100 bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] transition-colors"
                      >
                        {/* Image Thumbnail */}
                        <div className="w-16 h-20 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200 shrink-0">
                          {item.images?.[0] ? (
                            <img
                              src={item.images[0].url}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-neutral-200 flex items-center justify-center text-[10px] text-neutral-400">
                              Saree
                            </div>
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                          <div>
                            <h4 className="font-jost text-xs sm:text-sm font-bold text-black line-clamp-2 leading-snug">
                              {item.name}
                            </h4>
                            <p className="font-karla text-[11px] text-neutral-500 mt-0.5">
                              Quantity: <span className="font-bold text-neutral-800">{item.quantity}</span>
                            </p>
                          </div>

                          <div className="flex items-baseline gap-2 pt-1">
                            <span className="font-jost text-sm font-bold text-black">
                              ₹{(price * item.quantity).toLocaleString('en-IN')}
                            </span>
                            {originalPrice > price && (
                              <span className="font-karla text-xs text-neutral-400 line-through">
                                ₹{(originalPrice * item.quantity).toLocaleString('en-IN')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Promo Code Box */}
                <div className="pt-2 border-t border-neutral-100">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Tag className="w-3.5 h-3.5 text-gold" />
                    <span className="font-jost text-xs font-bold uppercase tracking-wider text-black">
                      Apply Promo Code
                    </span>
                  </div>

                  {appliedCoupon ? (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-emerald-900 bg-emerald-200/60 px-2 py-0.5 rounded">
                            {appliedCoupon.code}
                          </span>
                          <span className="text-xs font-jost font-bold text-emerald-800">
                            – ₹{couponDiscount.toLocaleString('en-IN')} Saved
                          </span>
                        </div>
                        <p className="font-karla text-[11px] text-emerald-700 mt-0.5">
                          {appliedCoupon.label}
                        </p>
                      </div>
                      <button
                        onClick={handleRemoveCoupon}
                        className="text-xs font-jost font-bold uppercase text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. TANTVANI10"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 px-3.5 py-2.5 text-xs font-mono uppercase bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-black outline-none"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 bg-black hover:bg-neutral-800 text-white font-jost text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
                      >
                        Apply
                      </button>
                    </form>
                  )}

                  {/* Popular Coupon Suggestion Chips */}
                  {!appliedCoupon && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setCouponCode('TANTVANI10');
                          setAppliedCoupon({ code: 'TANTVANI10', value: 10, type: 'percentage', label: '10% Welcome Discount' });
                          toast.success('Coupon TANTVANI10 applied!');
                        }}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100"
                      >
                        🏷️ TANTVANI10 (10% OFF)
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCouponCode('ROYAL2000');
                          if (subtotal >= 20000) {
                            setAppliedCoupon({ code: 'ROYAL2000', value: 2000, type: 'flat', label: '₹2,000 Flat Discount' });
                            toast.success('Coupon ROYAL2000 applied!');
                          } else {
                            toast.error('ROYAL2000 requires orders above ₹20,000');
                          }
                        }}
                        className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-50 border border-amber-200 text-amber-900 hover:bg-amber-100"
                      >
                        👑 ROYAL2000 (₹2000 OFF)
                      </button>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="pt-2 border-t border-neutral-100 space-y-2.5">
                  <div className="flex justify-between text-xs font-karla text-neutral-600">
                    <span>Total MRP</span>
                    <span className="font-mono text-neutral-900">₹{originalSubtotal.toLocaleString('en-IN')}</span>
                  </div>

                  {productDiscount > 0 && (
                    <div className="flex justify-between text-xs font-karla text-emerald-700">
                      <span>Handloom Direct Discount</span>
                      <span className="font-mono font-medium">– ₹{productDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-xs font-karla text-emerald-700">
                      <span>Coupon Discount ({appliedCoupon?.code})</span>
                      <span className="font-mono font-medium">– ₹{couponDiscount.toLocaleString('en-IN')}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-xs font-karla text-neutral-600">
                    <span>Pan-India Insured Delivery</span>
                    <span className={`font-mono font-medium ${shipping === 0 ? 'text-emerald-700' : 'text-neutral-900'}`}>
                      {shipping === 0 ? 'FREE' : `₹${shipping}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-xs font-karla text-neutral-600">
                    <span>GST (5% Handloom Saree Rate)</span>
                    <span className="font-mono text-neutral-900">₹{tax.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="pt-3 border-t border-neutral-200 flex justify-between items-baseline">
                    <div>
                      <span className="font-jost text-xs font-bold uppercase tracking-wider text-black block">
                        Total Payable
                      </span>
                      <span className="text-[10px] font-karla text-neutral-400">
                        Inclusive of all Indian taxes
                      </span>
                    </div>
                    <span className="font-jost text-xl sm:text-2xl font-bold text-black">
                      ₹{grandTotal.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {totalSavings > 0 && (
                    <div className="mt-2 py-2 px-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center text-xs font-jost font-bold text-emerald-800">
                      ✨ You are saving ₹{totalSavings.toLocaleString('en-IN')} on this order!
                    </div>
                  )}
                </div>

                {/* Trust Badges */}
                <div className="pt-4 border-t border-neutral-100 grid grid-cols-2 gap-2 text-center text-[10px] font-jost uppercase tracking-wider text-neutral-600">
                  <div className="p-2 bg-[#FAF8F5] rounded-lg border border-neutral-200 flex flex-col items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span>100% Silk Mark Certified</span>
                  </div>
                  <div className="p-2 bg-[#FAF8F5] rounded-lg border border-neutral-200 flex flex-col items-center gap-1">
                    <Truck className="w-4 h-4 text-emerald-700" />
                    <span>Insured Pan-India Shipping</span>
                  </div>
                  <div className="p-2 bg-[#FAF8F5] rounded-lg border border-neutral-200 flex flex-col items-center gap-1">
                    <RotateCcw className="w-4 h-4 text-emerald-700" />
                    <span>15 Days Easy Returns</span>
                  </div>
                  <div className="p-2 bg-[#FAF8F5] rounded-lg border border-neutral-200 flex flex-col items-center gap-1">
                    <Sparkles className="w-4 h-4 text-gold" />
                    <span>256-Bit SSL Encrypted</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
