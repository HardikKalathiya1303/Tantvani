import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../utils/api';
import { toast } from 'react-hot-toast';

const ProductCard = memo(function ProductCard({ product }) {
  const [imgIdx] = useState(0);
  const [imgError, setImgError] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);
  const addItem = useCartStore(s => s.addItem);
  const user = useAuthStore(s => s.user);

  const fallbackImage = 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop';
  const mainImg = imgError ? fallbackImage : (product.images?.[imgIdx]?.url || fallbackImage);
  const hoverImg = !imgError && product.images?.[1]?.url;
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
    <Link to={`/product/${product.slug}`} className="group block card-product h-full flex flex-col justify-between">
      <div>
        {/* Image */}
        <div className="relative overflow-hidden aspect-[3/4] bg-wine-darker/10">
          <img
            src={mainImg}
            alt={product.name}
            onError={() => setImgError(true)}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-all duration-500 will-change-transform ${hoverImg ? 'group-hover:opacity-0' : 'group-hover:scale-105'}`}
            loading="lazy"
            decoding="async"
          />
          {hoverImg && (
            <img
              src={hoverImg}
              alt={product.name}
              className="absolute inset-0 w-full h-full object-cover object-center opacity-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 will-change-transform"
              loading="lazy"
              decoding="async"
            />
          )}

          {/* Badges */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 z-10">
            {product.isNewArrival && (
              <span className="bg-gold text-wine-dark text-[9px] sm:text-[10px] font-jost font-semibold tracking-[0.14em] uppercase px-2 sm:px-3 py-1 sm:py-1.5 shadow-xs">New</span>
            )}
            {product.isBestseller && (
              <span className="bg-wine text-cream-light text-[9px] sm:text-[10px] font-jost font-semibold tracking-[0.14em] uppercase px-2 sm:px-3 py-1 sm:py-1.5 shadow-xs">Bestseller</span>
            )}
            {hasDiscount && (
              <span className="bg-wine-dark text-cream-light text-[9px] sm:text-[10px] font-jost font-semibold tracking-[0.14em] uppercase px-2 sm:px-3 py-1.5 shadow-xs">
                -{Math.round((1 - product.discountPrice / product.price) * 100)}%
              </span>
            )}
          </div>

          {/* Wishlist button */}
          <button
            onClick={handleWishlist}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 w-8 h-8 sm:w-9 sm:h-9 bg-cream-light/95 hover:bg-cream-light flex items-center justify-center transition-all duration-200 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 translate-y-0 sm:translate-y-1 sm:group-hover:translate-y-0 z-10 shadow-sm rounded-full"
            aria-label="Add to wishlist"
          >
            <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${wishlisted ? 'fill-wine text-wine' : 'text-wine-dark/70'}`} />
          </button>

          {/* Quick add */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-0 sm:translate-y-full sm:group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              className="w-full py-2.5 sm:py-3.5 bg-wine text-cream-light text-[10px] sm:text-[11px] font-jost font-semibold tracking-[0.18em] uppercase hover:bg-wine-light transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              {product.stock === 0 ? 'Out of Stock' : adding ? 'Added ✓' : 'Add to Bag'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-3 sm:p-5">
          <p className="font-jost text-[9.5px] sm:text-[10.5px] tracking-[0.2em] uppercase text-gold mb-1 truncate">
            {product.category?.name || product.fabric}
          </p>
          <h3 className="font-cormorant text-base sm:text-xl md:text-2xl text-wine-dark group-hover:text-wine transition-colors line-clamp-2 leading-tight mb-1.5 font-normal">
            {product.name}
          </h3>
          {product.numReviews > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-gold text-gold" />
              <span className="text-[11px] sm:text-xs font-karla text-wine-dark/65">
                {product.rating?.toFixed(1)} ({product.numReviews})
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="px-3 pb-3 sm:px-5 sm:pb-5">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="font-cormorant text-lg sm:text-2xl font-semibold text-wine">
            ₹{price?.toLocaleString('en-IN')}
          </span>
          {hasDiscount && (
            <span className="font-karla text-xs sm:text-sm text-wine-dark/40 line-through">
              ₹{product.price?.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
});

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
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map(p => (
        <div key={p._id} className="transition-opacity duration-300">
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}

export { ProductCard, ShimmerCard };
