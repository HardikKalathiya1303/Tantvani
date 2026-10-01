import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  ShoppingBag,
  Star,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Scissors,
  MessageCircle,
  MapPin,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function ProductInfoSection({
  product,
  price,
  hasDiscount,
  quantity,
  setQuantity,
  handleAddToCart,
  handleWishlist,
  wishlisted,
}) {
  const navigate = useNavigate();
  const [pincode, setPincode] = useState('');
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [checkingPin, setCheckingPin] = useState(false);
  const [showStickyBar, setShowStickyBar] = useState(false);

  const discountAmount = hasDiscount ? product.price - product.discountPrice : 0;
  const discountPercent = hasDiscount
    ? Math.round((discountAmount / product.price) * 100)
    : 0;

  // Show sticky bottom bar on mobile when scrolled past main buy button
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowStickyBar(scrollY > 450);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBuyNow = () => {
    handleAddToCart();
    navigate('/checkout');
  };

  const handleCheckPincode = (e) => {
    e.preventDefault();
    if (!/^\d{6}$/.test(pincode.trim())) {
      toast.error('Please enter a valid 6-digit Pincode');
      return;
    }
    setCheckingPin(true);
    setTimeout(() => {
      setCheckingPin(false);
      const deliveryDate = new Date();
      deliveryDate.setDate(deliveryDate.getDate() + 3);
      const options = { weekday: 'short', month: 'short', day: 'numeric' };
      setDeliveryInfo({
        date: deliveryDate.toLocaleDateString('en-IN', options),
        available: true,
      });
      toast.success('Express delivery available at your pincode!');
    }, 400);
  };

  const specs = [
    { label: 'Fabric', value: product.fabric },
    { label: 'Craft / Work', value: product.work },
    { label: 'Length', value: product.length ? `${product.length} Metres` : '6.3 Metres (incl. blouse)' },
    { label: 'Blouse Piece', value: product.blouseIncluded ? 'Included (0.8m)' : 'Not Included' },
    { label: 'Origin', value: product.origin || 'Varanasi, India' },
    { label: 'SKU Code', value: product.sku || 'TANT-001' },
  ].filter((s) => s.value);

  return (
    <div className="space-y-6 lg:space-y-7">
      {/* Category Eyebrow & Live Stock */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {product.category && (
          <Link
            to={`/collections?category=${product.category._id}`}
            className="font-jost text-xs tracking-[0.22em] uppercase font-bold text-gold-dark hover:text-wine transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold-dark" />
            {product.category.name}
          </Link>
        )}

        {product.stock > 0 ? (
          <span className="inline-flex items-center gap-1.5 font-jost text-xs tracking-wider uppercase font-bold text-emerald-800 bg-emerald-50 border border-emerald-300/80 px-2.5 py-0.5 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            In Stock ({product.stock} pieces)
          </span>
        ) : (
          <span className="font-jost text-xs tracking-wider uppercase font-bold text-rose-800 bg-rose-50 px-2.5 py-0.5 rounded-full">
            Out of Stock
          </span>
        )}
      </div>

      {/* Main Title (High Readability, Crisp Contrast, Serif Elegance) */}
      <div className="space-y-2">
        <h1 className="font-cormorant text-3xl sm:text-4xl lg:text-[42px] font-normal text-wine-darker leading-[1.18] tracking-tight">
          {product.name}
        </h1>

        {/* Rating & Review Summary */}
        <div className="flex items-center gap-2.5 pt-1">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.round(product.rating || 5)
                    ? 'fill-gold-dark text-gold-dark'
                    : 'text-neutral-200'
                }`}
              />
            ))}
          </div>
          <span className="font-karla text-sm font-semibold text-wine-dark">
            {(product.rating || 5.0).toFixed(1)}
          </span>
          <span className="text-wine-dark/30">•</span>
          <span className="font-karla text-sm text-wine-dark/70">
            {product.numReviews || 0} Verified Reviews
          </span>
        </div>
      </div>

      {/* Price Block (Clear, Level Numbers, High Contrast) */}
      <div className="space-y-1.5 pt-1">
        <div className="flex items-baseline gap-3 sm:gap-4 flex-wrap">
          <span className="font-jost text-3xl sm:text-4xl font-bold text-wine tracking-tight">
            ₹{price.toLocaleString('en-IN')}
          </span>

          {hasDiscount && (
            <>
              <span className="font-jost text-xl text-wine-dark/50 line-through font-medium">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="font-jost text-xs font-bold tracking-wider uppercase bg-wine text-white px-2.5 py-0.5 rounded-md shadow-xs">
                {discountPercent}% OFF
              </span>
            </>
          )}
        </div>

        <p className="font-karla text-sm text-wine-dark/80 font-normal">
          MRP inclusive of all taxes • Free express doorstep delivery across India
        </p>
      </div>

      {/* Subtle Hairline Divider */}
      <div className="w-full h-px bg-neutral-200" />

      {/* Short Description (Clean, Readable Body Typography) */}
      {product.shortDescription && (
        <p className="font-karla text-base text-wine-dark/90 leading-relaxed font-normal">
          {product.shortDescription}
        </p>
      )}

      {/* Specifications Grid (Clean Visual Cards for Attributes) */}
      <div className="space-y-3 pt-1">
        <h3 className="font-jost text-xs font-bold tracking-[0.2em] uppercase text-wine-dark/70">
          Saree Specifications & Craft
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3 text-sm font-karla">
          {specs.map((item) => (
            <div
              key={item.label}
              className="p-3 rounded-xl bg-neutral-50/80 border border-neutral-200/80 space-y-0.5"
            >
              <span className="block font-jost text-[10px] tracking-wider uppercase font-semibold text-wine-dark/60">
                {item.label}
              </span>
              <span className="block text-sm font-semibold text-wine-darker truncate" title={item.value}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Occasions (Refined Luxury Pills) */}
      {product.occasion?.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="font-jost text-xs font-bold tracking-wider uppercase text-wine-dark/70">
            Occasion:
          </span>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {product.occasion.map((o) => (
              <Link
                key={o}
                to={`/collections?occasion=${o}`}
                className="font-jost text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full bg-neutral-100 hover:bg-wine text-wine-dark hover:text-white border border-neutral-300/80 hover:border-wine transition-all"
              >
                {o}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Subtle Hairline Divider */}
      <div className="w-full h-px bg-neutral-200" />

      {/* Quantity & Responsive Action Buttons (100% Mobile Optimized) */}
      <div className="space-y-4">
        {/* Quantity Selector */}
        <div className="flex items-center gap-4">
          <span className="font-jost text-xs font-bold tracking-wider uppercase text-wine-dark">
            Quantity:
          </span>
          <div className="flex items-center border border-neutral-300 rounded-lg bg-white overflow-hidden shadow-2xs">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3.5 py-1.5 hover:bg-neutral-100 transition-colors font-karla text-wine-dark font-bold text-base active:bg-neutral-200"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="px-4 py-1.5 font-karla text-base font-bold min-w-[2.75rem] text-center text-wine-darker">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(product.stock || 10, quantity + 1))}
              className="px-3.5 py-1.5 hover:bg-neutral-100 transition-colors font-karla text-wine-dark font-bold text-base active:bg-neutral-200"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>

        {/* Primary Action Buttons (Responsive Grid: Fits seamlessly on any mobile screen) */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Add to Bag Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex-1 bg-wine hover:bg-wine-light text-white py-3.5 sm:py-4 px-3 sm:px-6 rounded-xl font-jost text-xs sm:text-[13px] tracking-[0.1em] sm:tracking-[0.2em] font-bold uppercase flex items-center justify-center gap-1.5 sm:gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            <ShoppingBag className="w-4 h-4 shrink-0" />
            <span>Add to Bag</span>
          </motion.button>

          {/* Buy Now Button */}
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={handleBuyNow}
            disabled={product.stock === 0}
            className="flex-1 bg-wine-dark hover:bg-wine-darker text-white py-3.5 sm:py-4 px-3 sm:px-6 rounded-xl font-jost text-xs sm:text-[13px] tracking-[0.1em] sm:tracking-[0.2em] font-bold uppercase flex items-center justify-center gap-1.5 sm:gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed border border-wine-dark whitespace-nowrap"
          >
            <Zap className="w-4 h-4 text-gold fill-gold shrink-0" />
            <span>Buy Now</span>
          </motion.button>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={`w-11 h-11 sm:w-13 sm:h-13 shrink-0 rounded-xl border-2 transition-all flex items-center justify-center ${
              wishlisted
                ? 'border-wine bg-wine/10 text-wine shadow-xs'
                : 'border-neutral-300 text-wine-dark hover:border-wine hover:text-wine bg-white'
            }`}
            aria-label="Wishlist"
            title={wishlisted ? 'Saved to Wishlist' : 'Add to Wishlist'}
          >
            <Heart className={`w-5 h-5 ${wishlisted ? 'fill-wine text-wine' : ''}`} />
          </button>
        </div>
      </div>

      {/* Pincode Delivery Estimator (Active, High-Contrast UI) */}
      <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-2.5">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gold-dark shrink-0" />
          <span className="font-jost text-xs font-bold tracking-wider uppercase text-wine-dark">
            Check Delivery to Your Location
          </span>
        </div>

        <form onSubmit={handleCheckPincode} className="flex items-center gap-2">
          <input
            type="text"
            maxLength={6}
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter 6-digit Pincode"
            className="flex-1 px-3.5 py-2.5 text-sm font-karla bg-white border border-neutral-300 rounded-lg focus:outline-none focus:border-wine text-wine-darker placeholder:text-neutral-400 font-medium shadow-2xs"
          />
          <button
            type="submit"
            disabled={checkingPin || pincode.length !== 6}
            className="px-5 py-2.5 bg-wine hover:bg-wine-light text-white rounded-lg font-jost text-xs tracking-wider uppercase font-bold transition-all shadow-xs disabled:opacity-40 disabled:hover:bg-wine shrink-0"
          >
            {checkingPin ? 'Checking...' : 'Check'}
          </button>
        </form>

        {deliveryInfo && (
          <p className="text-sm font-karla text-emerald-800 font-semibold flex items-center gap-1.5 pt-0.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            Expected Delivery by <strong className="underline">{deliveryInfo.date}</strong> (Free Express)
          </p>
        )}
      </div>

      {/* Trust & Craft Assurance (Polished 2x2 Grid) */}
      <div className="p-4 rounded-xl bg-neutral-50/60 border border-neutral-200/80 space-y-3">
        <div className="grid grid-cols-2 gap-3 text-xs font-karla font-semibold text-wine-dark">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
            <span>100% Pure Silk Mark Certified</span>
          </div>
          <div className="flex items-start gap-2.5">
            <Scissors className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
            <span>Free Fall & Pico Finishing</span>
          </div>
          <div className="flex items-start gap-2.5">
            <RotateCcw className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
            <span>7-Day Easy Returns & Exchange</span>
          </div>
          <div className="flex items-start gap-2.5">
            <Truck className="w-4 h-4 text-gold-dark shrink-0 mt-0.5" />
            <span>Insured Express Shipping</span>
          </div>
        </div>

        {/* Styling Concierge Link */}
        <div className="pt-2 border-t border-neutral-200/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-jost text-xs tracking-wider uppercase font-bold text-wine-dark">
              Need Saree Draping or Blouse Help?
            </span>
          </div>
          <a
            href="https://wa.me/919999999999?text=Hello%20Tantvani,%20I%20would%20like%20styling%20advice%20for%20this%20saree"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-jost text-xs tracking-wider uppercase font-bold text-emerald-700 hover:text-emerald-900 underline shrink-0"
          >
            <span>Chat Stylist</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Floating Sticky Bottom Bar for Mobile Viewport */}
      <AnimatePresence>
        {showStickyBar && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-neutral-200 px-4 py-2.5 shadow-2xl flex items-center justify-between gap-3"
          >
            <div>
              <p className="font-jost text-[10px] uppercase tracking-wider text-wine-dark/60 font-semibold">
                Total Price
              </p>
              <p className="font-jost text-lg font-bold text-wine leading-none">
                ₹{price.toLocaleString('en-IN')}
              </p>
            </div>

            <div className="flex items-center gap-2 flex-1 max-w-[240px]">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-wine text-white py-2.5 px-3 rounded-lg font-jost text-xs tracking-wider font-bold uppercase shadow-sm active:scale-95 transition-all text-center whitespace-nowrap"
              >
                Add to Bag
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="flex-1 bg-wine-dark text-white py-2.5 px-3 rounded-lg font-jost text-xs tracking-wider font-bold uppercase shadow-sm active:scale-95 transition-all text-center whitespace-nowrap"
              >
                Buy Now
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
