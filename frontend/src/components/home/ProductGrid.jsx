import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

function ProductCard({ product }) {
  const [imgIdx, setImgIdx] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);
  const addItem = useCartStore(s => s.addItem);
  const { user } = useAuthStore();

  const mainImg = product.images?.[imgIdx]?.url;
  const hoverImg = product.images?.[1]?.url;
  const price = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setAdding(true);
    addItem(product, 1);
    toast.success('Added to bag', { icon: '✓', style: { fontFamily: 'Jost', fontSize: '12px', letterSpacing: '0.05em' } });
    setTimeout(() => setAdding(false), 600);
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please sign in to save'); return; }
    try {
      await api.put(`/auth/wishlist/${product._id}`);
      setWishlisted(w => !w);
      toast.success(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist', {
        style: { fontFamily: 'Jost', fontSize: '12px', letterSpacing: '0.05em' }
      });
    } catch {
      toast.error('Could not update wishlist');
    }
  };

  return (
    <Link to={`/product/${product.slug}`} className="group block card-product">
      {/* Image */}
      <div className="relative overflow-hidden aspect-portrait bg-cream-dark">
        {mainImg ? (
          <>
            <img
              src={mainImg}
              alt={product.name}
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${hoverImg ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`}
              loading="lazy"
            />
            {hoverImg && (
              <img
                src={hoverImg}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
                loading="lazy"
              />
            )}
          </>
        ) : (
          <div className="absolute inset-0 bg-gradient-wine flex items-center justify-center">
            <svg className="w-16 h-16 text-cream-light/20" viewBox="0 0 100 100" fill="none">
              <path d="M50 8 C75 8,90 28,90 55 C90 78,75 92,50 92 C25 92,10 78,10 55 C10 28,25 8,50 8 Z" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNewArrival && (
            <span className="bg-gold text-wine-dark text-[9px] font-jost font-semibold tracking-[0.12em] uppercase px-2.5 py-1">New</span>
          )}
          {product.isBestseller && (
            <span className="bg-wine text-cream-light text-[9px] font-jost font-semibold tracking-[0.12em] uppercase px-2.5 py-1">Bestseller</span>
          )}
          {hasDiscount && (
            <span className="bg-wine-dark text-cream-light text-[9px] font-jost font-semibold tracking-[0.12em] uppercase px-2.5 py-1">
              -{Math.round((1 - product.discountPrice / product.price) * 100)}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 w-8 h-8 bg-cream-light/90 hover:bg-cream-light flex items-center justify-center transition-all duration-200 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0"
          aria-label="Add to wishlist"
        >
          <Heart className={`w-3.5 h-3.5 transition-colors ${wishlisted ? 'fill-wine text-wine' : 'text-wine-dark/70'}`} />
        </button>

        {/* Quick add */}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]">
          <button
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
            className="w-full py-3 bg-wine text-cream-light text-[10px] font-jost font-semibold tracking-[0.18em] uppercase hover:bg-wine-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-3 h-3" />
            {product.stock === 0 ? 'Out of Stock' : adding ? 'Added ✓' : 'Add to Bag'}
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 sm:p-4">
        <p className="font-jost text-[9px] tracking-[0.2em] uppercase text-gold mb-1.5 truncate">
          {product.category?.name || product.fabric}
        </p>
        <h3 className="font-cormorant text-base sm:text-lg text-wine-dark group-hover:text-wine transition-colors line-clamp-2 leading-snug mb-2">
          {product.name}
        </h3>
        {product.numReviews > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3 h-3 fill-gold text-gold" />
            <span className="text-[11px] font-karla text-wine-dark/60">
              {product.rating?.toFixed(1)} ({product.numReviews})
            </span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <span className="font-cormorant text-lg sm:text-xl font-medium text-wine">
            ₹{price?.toLocaleString('en-IN')}
          </span>
          {hasDiscount && (
            <span className="font-karla text-sm text-wine-dark/40 line-through">
              ₹{product.price?.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

function ShimmerCard() {
  return (
    <div className="card-product">
      <div className="aspect-portrait shimmer" />
      <div className="p-4 space-y-2">
        <div className="shimmer h-2.5 w-16 rounded" />
        <div className="shimmer h-5 w-4/5 rounded" />
        <div className="shimmer h-5 w-1/3 rounded" />
      </div>
    </div>
  );
}

export default function ProductGrid({ products = [], loading = false, emptyMessage = 'No sarees found' }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {[...Array(8)].map((_, i) => <ShimmerCard key={i} />)}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="py-20 text-center">
        <div className="w-16 h-16 mx-auto mb-6 border border-cream-darker rounded-full flex items-center justify-center">
          <ShoppingBag className="w-6 h-6 text-wine-dark/30" />
        </div>
        <p className="font-cormorant text-2xl text-wine-dark/50 mb-3">{emptyMessage}</p>
        <p className="body-sm text-wine-dark/40">Try adjusting your filters or browse all collections.</p>
        <Link to="/collections" className="btn-outline mt-6 inline-flex">Browse All</Link>
      </div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
    >
      <AnimatePresence mode="popLayout">
        {products.map(p => (
          <motion.div
            key={p._id}
            layout
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.45 } },
            }}
            exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.25 } }}
          >
            <ProductCard product={p} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

export { ProductCard, ShimmerCard };
