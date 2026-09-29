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
  const discountPercent = hasDiscount ? Math.round((1 - product.discountPrice / product.price) * 100) : 0;

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
    <Link to={`/product/${product.slug}`} className="group block card-product h-full flex flex-col justify-between rounded-xs overflow-hidden shadow-xs hover:shadow-luxury transition-all duration-300">
      <div>
        {/* Card Image */}
        <div className="relative overflow-hidden aspect-[3/4] bg-wine-darker/10 rounded-t-xs">
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
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {product.isNewArrival && (
              <span className="bg-gold text-wine-dark text-[8.5px] font-jost font-semibold tracking-[0.12em] uppercase px-2 py-0.5 shadow-xs whitespace-nowrap">New</span>
            )}
            {product.isBestseller && (
              <span className="bg-wine text-cream-light text-[8.5px] font-jost font-semibold tracking-[0.12em] uppercase px-2 py-0.5 shadow-xs whitespace-nowrap">Bestseller</span>
            )}
            {hasDiscount && (
              <span className="bg-[#cc0000] text-white text-[8.5px] font-jost font-bold tracking-[0.12em] uppercase px-2 py-0.5 shadow-xs whitespace-nowrap">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-2 right-2 w-7 h-7 sm:w-8 sm:h-8 bg-cream-light/95 hover:bg-cream-light flex items-center justify-center transition-all duration-200 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 z-10 shadow-sm rounded-full"
            aria-label="Add to wishlist"
          >
            <Heart className={`w-3.5 h-3.5 transition-colors ${wishlisted ? 'fill-wine text-wine' : 'text-wine-dark/70'}`} />
          </button>

          {/* Quick Add Overlay */}
          <div className="absolute bottom-0 left-0 right-0 translate-y-0 sm:translate-y-full sm:group-hover:translate-y-0 transition-transform duration-300 ease-out z-10">
            <button
              onClick={handleAddToCart}
              disabled={adding || product.stock === 0}
              className="w-full py-2 bg-wine text-cream-light text-[10px] sm:text-[11px] font-jost font-semibold tracking-[0.16em] uppercase hover:bg-wine-light transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              {product.stock === 0 ? 'Out of Stock' : adding ? 'Added ✓' : 'Add to Bag'}
            </button>
          </div>
        </div>

        {/* Refined Info Section */}
        <div className="p-2.5 sm:p-3 flex flex-col justify-between">
          {/* Category / Fabric Eyebrow Title (Prevent line wrapping) */}
          <p className="font-jost text-[10px] sm:text-xs tracking-[0.14em] uppercase text-gold font-bold mb-1 truncate whitespace-nowrap">
            {product.category?.name || product.fabric || 'Pure Handloom'}
          </p>

          {/* Product Name (Balanced serif font size) */}
          <h3 className="font-cormorant text-sm sm:text-base lg:text-lg text-wine-dark group-hover:text-wine transition-colors leading-[1.25] font-medium line-clamp-2 min-h-[2.4em] flex items-center mb-1.5">
            {product.name}
          </h3>

          {/* Rating Stars if available */}
          {product.numReviews > 0 && (
            <div className="flex items-center gap-1 mb-1.5">
              <Star className="w-3 h-3 fill-gold text-gold" />
              <span className="text-[10.5px] font-karla text-wine-dark/65">
                {product.rating?.toFixed(1)} ({product.numReviews})
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Clean Bottom Price Section (Fixed no-wrap layout) */}
      <div className="px-2.5 pb-2.5 sm:px-3 sm:pb-3 pt-2 border-t border-cream-darker/30 mt-auto">
        <div className="flex items-center justify-between gap-1 flex-wrap sm:flex-nowrap">
          <div className="flex items-baseline gap-1.5 min-w-0">
            <span className="font-cormorant text-base sm:text-xl font-bold text-wine whitespace-nowrap">
              ₹{price?.toLocaleString('en-IN')}
            </span>
            {hasDiscount && (
              <span className="font-karla text-[11px] sm:text-xs text-wine-dark/40 line-through whitespace-nowrap">
                ₹{product.price?.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {hasDiscount && (
            <span className="text-[9px] sm:text-[10px] font-jost font-bold text-[#8C3342] bg-[#8C3342]/10 px-1.5 py-0.5 rounded-xs whitespace-nowrap shrink-0">
              {discountPercent}% OFF
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

export default function ProductGrid({
  products = [],
  loading = false,
  isError = false,
  onRetry,
  emptyMessage = 'No sarees found',
  gridCols = 4,
}) {
  const gridClasses = {
    2: 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 gap-2.5 sm:gap-3.5 lg:gap-4',
    3: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2.5 sm:gap-3.5 lg:gap-4',
    4: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3.5 lg:gap-4',
  };

  const activeGridClass = gridClasses[gridCols] || gridClasses[4];

  if (loading) {
    return (
      <div className={`grid ${activeGridClass}`}>
        {[...Array(8)].map((_, i) => (
          <ShimmerCard key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="py-20 text-center">
        <div className="w-16 h-16 mx-auto mb-6 border border-[#8C3342]/20 rounded-full flex items-center justify-center bg-[#8C3342]/5">
          <ShoppingBag className="w-6 h-6 text-[#8C3342]" />
        </div>
        <p className="font-cormorant text-2xl text-[#2B1810] mb-2">Unable to load collection</p>
        <p className="font-karla text-sm text-[#2B1810]/60 max-w-md mx-auto mb-6">Backend server response delayed. Click below to reconnect.</p>
        {onRetry && (
          <button onClick={onRetry} className="btn-primary inline-flex px-6 py-2.5 text-xs">
            Reload Sarees
          </button>
        )}
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
    <div className={`grid ${activeGridClass}`}>
      {products.map(p => (
        <div key={p._id} className="transition-opacity duration-300">
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}

export { ProductCard, ShimmerCard };
