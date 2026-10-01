import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trash2,
  ShoppingBag,
  ArrowRight,
  Plus,
  Minus,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Tag,
  CheckCircle2,
  Lock,
  ChevronRight,
  Heart,
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const subtotal = items.reduce((sum, i) => sum + (i.discountPrice || i.price) * i.quantity, 0);
  const originalTotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discountSavings = originalTotal > subtotal ? originalTotal - subtotal : 0;

  // Coupon Logic
  const couponDiscount = appliedCoupon
    ? appliedCoupon.type === 'percent'
      ? Math.round(subtotal * (appliedCoupon.value / 100))
      : appliedCoupon.value
    : 0;

  const shipping = subtotal >= 2000 ? 0 : 99;
  const tax = Math.round((subtotal - couponDiscount) * 0.05);
  const total = Math.max(0, subtotal - couponDiscount + shipping + tax);

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    setIsApplyingCoupon(true);
    setTimeout(() => {
      setIsApplyingCoupon(false);
      if (code === 'TANTVANI10' || code === 'FIRST10') {
        setAppliedCoupon({ code, value: 10, type: 'percent' });
        toast.success(`Coupon "${code}" applied! 10% discount added.`);
        setCouponCode('');
      } else if (code === 'ROYAL2000' && subtotal >= 20000) {
        setAppliedCoupon({ code, value: 2000, type: 'flat' });
        toast.success(`Coupon "${code}" applied! ₹2,000 flat discount added.`);
        setCouponCode('');
      } else {
        toast.error('Invalid or expired coupon code');
      }
    }, 400);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    toast.success('Coupon removed');
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login?redirect=/checkout');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white pt-24 sm:pt-28 pb-20 flex items-center justify-center">
        <div className="text-center max-w-md px-4 space-y-6">
          <div className="w-24 h-24 rounded-full bg-neutral-100 border border-neutral-200 mx-auto flex items-center justify-center text-neutral-400 shadow-xs">
            <ShoppingBag className="w-10 h-10 text-neutral-500" />
          </div>
          <div className="space-y-2">
            <h1 className="font-jost text-2xl sm:text-3xl font-bold text-black tracking-tight">
              Your Shopping Bag is Empty
            </h1>
            <p className="font-karla text-sm sm:text-base text-neutral-500 max-w-sm mx-auto">
              Explore our handcrafted heritage weaves and add exquisite heirloom sarees to your bag.
            </p>
          </div>
          <div className="pt-2">
            <Link
              to="/collections"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-black hover:bg-neutral-800 text-white font-jost text-xs sm:text-sm font-bold uppercase tracking-widest rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              Explore Saree Collections <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const freeShippingThreshold = 2000;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const totalItemCount = items.reduce((a, b) => a + b.quantity, 0);

  return (
    <div className="min-h-screen bg-white pt-2 sm:pt-4 lg:pt-16 pb-20">
      <div className="max-w-screen-xl mx-auto px-3.5 sm:px-6 lg:px-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2.5 text-[11px] sm:text-xs text-neutral-500 font-jost uppercase tracking-wider">
          <Link to="/" className="hover:text-black transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-400" />
          <Link to="/collections" className="hover:text-black transition-colors">
            Collections
          </Link>
          <ChevronRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-neutral-400" />
          <span className="text-black font-bold">Shopping Bag</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-3 sm:pb-4 mb-4 sm:mb-6 border-b border-neutral-200 gap-2 sm:gap-3">
          <div>
            <span className="font-jost text-xs tracking-[0.25em] uppercase text-gold font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              Luxury Handloom Selection
            </span>
            <h1 className="font-jost text-2xl sm:text-3xl font-bold text-black tracking-tight mt-1">
              Your Shopping Bag{' '}
              <span className="text-neutral-400 font-normal text-lg sm:text-xl">
                ({totalItemCount} {totalItemCount === 1 ? 'Item' : 'Items'})
              </span>
            </h1>
          </div>
          <button
            onClick={clearCart}
            className="self-start sm:self-auto font-jost text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-red-600 transition-colors flex items-center gap-1.5 py-1 px-2.5 rounded-md hover:bg-red-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Clear All
          </button>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Bag Items (8 Cols) */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-4">
            {/* Free Shipping Progress Indicator */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm font-karla">
                <span className="flex items-center gap-2 font-medium text-neutral-800">
                  <Truck className="w-4 h-4 text-wine" />
                  {amountToFreeShipping === 0 ? (
                    <span className="text-emerald-700 font-bold">
                      🎉 Congratulations! You have unlocked FREE Express Delivery
                    </span>
                  ) : (
                    <span>
                      Add{' '}
                      <strong className="text-black font-bold">
                        ₹{amountToFreeShipping.toLocaleString('en-IN')}
                      </strong>{' '}
                      more to qualify for <strong className="text-black">FREE Shipping</strong>
                    </span>
                  )}
                </span>
                <span className="font-jost font-bold text-xs text-neutral-500">
                  {Math.round(freeShippingProgress)}%
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-neutral-200 overflow-hidden">
                <div
                  className="h-full bg-black rounded-full transition-all duration-500"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Product Item Cards List */}
            <div className="space-y-4">
              <AnimatePresence initial={false}>
                {items.map((item) => {
                  const itemPrice = item.discountPrice || item.price;
                  const itemOriginal = item.price;
                  const hasDiscount = item.discountPrice && item.discountPrice < item.price;

                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                      className="p-4 sm:p-5 rounded-2xl bg-white border border-neutral-200 shadow-xs hover:border-neutral-300 transition-all flex flex-col sm:flex-row gap-4 sm:gap-6"
                    >
                      {/* Product Thumbnail Image */}
                      <Link
                        to={`/product/${item.slug}`}
                        className="w-full sm:w-32 sm:h-44 aspect-portrait shrink-0 rounded-xl overflow-hidden bg-neutral-100 border border-neutral-200 relative group block"
                      >
                        <img
                          src={item.images?.[0]?.url || item.image}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {hasDiscount && (
                          <span className="absolute top-2 left-2 bg-red-600 text-white font-jost text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider">
                            Save ₹{(itemOriginal - itemPrice).toLocaleString('en-IN')}
                          </span>
                        )}
                      </Link>

                      {/* Product Details & Controls */}
                      <div className="flex-1 flex flex-col justify-between space-y-3 min-w-0">
                        {/* Top Info & Delete */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            {item.category && (
                              <p className="font-jost text-[11px] font-bold uppercase tracking-widest text-gold">
                                {item.category.name}
                              </p>
                            )}
                            <Link
                              to={`/product/${item.slug}`}
                              className="font-jost text-base sm:text-lg font-bold text-black hover:text-wine transition-colors line-clamp-2 leading-snug"
                            >
                              {item.name}
                            </Link>
                            <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs font-karla text-neutral-500">
                              {item.fabric && (
                                <span className="bg-neutral-100 px-2 py-0.5 rounded-md font-medium text-neutral-700">
                                  {item.fabric}
                                </span>
                              )}
                              <span className="text-emerald-700 font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Complimentary Fall & Pico Included
                              </span>
                            </div>
                          </div>

                          {/* Delete Item Button */}
                          <button
                            onClick={() => {
                              removeItem(item._id);
                              toast.success('Removed from bag');
                            }}
                            className="p-2 text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors shrink-0"
                            title="Remove saree"
                            aria-label="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Bottom Row: Quantity Stepper & Price Calculation */}
                        <div className="pt-2 border-t border-neutral-100 flex items-center justify-between gap-4">
                          {/* Stepper */}
                          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center hover:bg-neutral-200 transition-colors shadow-xs disabled:opacity-40"
                              disabled={item.quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <span className="w-10 text-center font-jost text-sm font-bold text-black">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="w-8 h-8 rounded-lg bg-white text-black flex items-center justify-center hover:bg-neutral-200 transition-colors shadow-xs"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <div className="flex items-baseline justify-end gap-2">
                              {hasDiscount && (
                                <span className="font-karla text-xs sm:text-sm text-neutral-400 line-through">
                                  ₹{(itemOriginal * item.quantity).toLocaleString('en-IN')}
                                </span>
                              )}
                              <span className="font-jost text-lg sm:text-xl font-bold text-black tracking-tight">
                                ₹{(itemPrice * item.quantity).toLocaleString('en-IN')}
                              </span>
                            </div>
                            <p className="font-karla text-[11px] text-neutral-400">
                              (₹{itemPrice.toLocaleString('en-IN')} / piece)
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Continue Shopping Link */}
            <div className="pt-4 flex justify-between items-center">
              <Link
                to="/collections"
                className="inline-flex items-center gap-2 font-jost text-xs sm:text-sm font-bold uppercase tracking-wider text-black hover:text-wine transition-colors"
              >
                ← Continue Browsing Sarees
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary & Checkout Card (4/5 Cols) */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="rounded-2xl bg-white border border-neutral-200 shadow-md p-6 sm:p-7 space-y-6 lg:sticky lg:top-28">
              <div className="border-b border-neutral-200 pb-4">
                <h2 className="font-jost text-lg sm:text-xl font-bold text-black tracking-wide">
                  Order Summary
                </h2>
                <p className="font-karla text-xs text-neutral-500 mt-0.5">
                  Prices inclusive of handcrafted packaging & verified inspection.
                </p>
              </div>

              {/* Coupon Code Section */}
              <div className="space-y-2">
                {appliedCoupon ? (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-emerald-600" />
                      <div>
                        <p className="font-jost text-xs font-bold text-emerald-900 tracking-wider uppercase">
                          {appliedCoupon.code}
                        </p>
                        <p className="font-karla text-[11px] text-emerald-700">
                          {appliedCoupon.type === 'percent'
                            ? `${appliedCoupon.value}% Discount Applied`
                            : `₹${appliedCoupon.value} Flat Off`}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-xs font-jost font-bold uppercase tracking-wider text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Coupon (e.g. TANTVANI10)"
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-300 focus:outline-none focus:border-black font-jost text-xs font-medium uppercase tracking-wider text-black placeholder:text-neutral-400 placeholder:normal-case"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!couponCode.trim() || isApplyingCoupon}
                      className="px-4 py-2.5 bg-black hover:bg-neutral-800 disabled:opacity-50 text-white font-jost text-xs font-bold uppercase tracking-wider rounded-xl transition-all shrink-0"
                    >
                      {isApplyingCoupon ? '...' : 'Apply'}
                    </button>
                  </form>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 font-karla text-sm text-neutral-600 border-t border-b border-neutral-200 py-4">
                <div className="flex justify-between items-center">
                  <span>Bag Subtotal</span>
                  <span className="font-jost font-semibold text-black">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>

                {discountSavings > 0 && (
                  <div className="flex justify-between items-center text-emerald-700">
                    <span>Special Handloom Discount</span>
                    <span className="font-jost font-semibold">
                      -₹{discountSavings.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                {appliedCoupon && (
                  <div className="flex justify-between items-center text-emerald-700">
                    <span>Coupon ({appliedCoupon.code})</span>
                    <span className="font-jost font-semibold">
                      -₹{couponDiscount.toLocaleString('en-IN')}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span>Estimated GST (5%)</span>
                  <span className="font-jost font-semibold text-black">
                    ₹{tax.toLocaleString('en-IN')}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span>Express Insured Delivery</span>
                  <span className="font-jost font-bold text-emerald-700">
                    {shipping === 0 ? 'FREE' : `₹${shipping}`}
                  </span>
                </div>
              </div>

              {/* Total Row */}
              <div className="flex justify-between items-baseline pt-1">
                <div>
                  <span className="font-jost text-xs uppercase tracking-widest text-neutral-500 font-bold block">
                    Total Amount
                  </span>
                  <span className="font-karla text-[11px] text-neutral-400">
                    (All taxes & shipping included)
                  </span>
                </div>
                <span className="font-jost text-3xl font-bold text-black tracking-tight">
                  ₹{total.toLocaleString('en-IN')}
                </span>
              </div>

              {/* Checkout Action Button */}
              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-black hover:bg-neutral-800 text-white font-jost text-xs sm:text-sm font-bold uppercase tracking-widest rounded-xl transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              {/* Trust Badges */}
              <div className="pt-2 grid grid-cols-3 gap-2 text-center border-t border-neutral-100">
                <div className="space-y-1">
                  <ShieldCheck className="w-5 h-5 text-gold-dark mx-auto" />
                  <p className="font-jost text-[10px] font-bold uppercase tracking-wider text-black">
                    100% Authentic
                  </p>
                  <p className="font-karla text-[9px] text-neutral-400">Handloom Silk Mark</p>
                </div>
                <div className="space-y-1">
                  <RotateCcw className="w-5 h-5 text-gold-dark mx-auto" />
                  <p className="font-jost text-[10px] font-bold uppercase tracking-wider text-black">
                    15-Day Return
                  </p>
                  <p className="font-karla text-[9px] text-neutral-400">Hassle-free pickup</p>
                </div>
                <div className="space-y-1">
                  <Lock className="w-5 h-5 text-gold-dark mx-auto" />
                  <p className="font-jost text-[10px] font-bold uppercase tracking-wider text-black">
                    Bank Secure
                  </p>
                  <p className="font-karla text-[9px] text-neutral-400">256-bit encrypted</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

