import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, Star, ChevronRight, ZoomIn, Truck, RotateCcw, Shield, X } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [showZoom, setShowZoom] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  const addItem = useCartStore(s => s.addItem);
  const { user } = useAuthStore();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.get(`/products/${slug}`).then(r => r.data),
  });

  const reviewMutation = useMutation({
    mutationFn: () => api.post(`/products/${data.product._id}/reviews`, reviewForm),
    onSuccess: () => {
      toast.success('Review submitted!');
      qc.invalidateQueries(['product', slug]);
      setReviewForm({ rating: 5, comment: '' });
    },
    onError: err => toast.error(err.response?.data?.message || 'Error submitting review'),
  });

  const handleWishlist = async () => {
    if (!user) { toast.error('Please sign in first'); return; }
    try {
      await api.put(`/auth/wishlist/${data.product._id}`);
      setWishlisted(w => !w);
      toast.success(wishlisted ? 'Removed from wishlist' : 'Saved to wishlist');
    } catch { toast.error('Could not update wishlist'); }
  };

  if (isLoading) return (
    <div className="pb-24 bg-cream min-h-screen">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="space-y-4">
            <div className="aspect-portrait shimmer" />
            <div className="grid grid-cols-4 gap-3">{[...Array(4)].map((_, i) => <div key={i} className="aspect-square shimmer" />)}</div>
          </div>
          <div className="space-y-4 pt-4">{[...Array(7)].map((_, i) => <div key={i} className="h-6 shimmer rounded" style={{ width: `${[50, 85, 40, 95, 60, 70, 45][i]}%` }} />)}</div>
        </div>
      </div>
    </div>
  );

  if (!data?.product) return (
    <div className="pb-24 min-h-screen flex items-center justify-center bg-cream">
      <div className="text-center px-4">
        <p className="font-cormorant text-4xl text-wine-dark mb-4">Product not found</p>
        <Link to="/collections" className="btn-primary">Back to Collections</Link>
      </div>
    </div>
  );

  const p = data.product;
  const price = p.discountPrice || p.price;
  const hasDiscount = p.discountPrice && p.discountPrice < p.price;

  const handleAddToCart = () => {
    addItem(p, quantity);
    toast.success(`${p.name} added to bag`);
  };

  return (
    <div className="pb-24 min-h-screen bg-cream">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 pt-6 sm:pt-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 mb-8 sm:mb-10 flex-wrap">
          <Link to="/" className="font-jost text-[10px] tracking-[0.15em] uppercase text-wine-dark/40 hover:text-wine transition-colors">Home</Link>
          <ChevronRight className="w-3 h-3 text-wine-dark/25 shrink-0" />
          <Link to="/collections" className="font-jost text-[10px] tracking-[0.15em] uppercase text-wine-dark/40 hover:text-wine transition-colors">Collections</Link>
          <ChevronRight className="w-3 h-3 text-wine-dark/25 shrink-0" />
          {p.category && (
            <>
              <Link to={`/collections?category=${p.category._id}`} className="font-jost text-[10px] tracking-[0.15em] uppercase text-wine-dark/40 hover:text-wine transition-colors">{p.category.name}</Link>
              <ChevronRight className="w-3 h-3 text-wine-dark/25 shrink-0" />
            </>
          )}
          <span className="font-jost text-[10px] tracking-[0.15em] uppercase text-wine-dark truncate max-w-[160px] sm:max-w-none">{p.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Images */}
          <div className="space-y-4">
            <div
              className="relative aspect-portrait overflow-hidden bg-cream-dark cursor-zoom-in group"
              onClick={() => setShowZoom(true)}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImage}
                  src={p.images?.[activeImage]?.url}
                  alt={p.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="bg-cream-light/90 p-2 shadow-elegant">
                  <ZoomIn className="w-4 h-4 text-wine-dark/50" />
                </div>
              </div>
              {p.isNewArrival && (
                <span className="absolute top-4 left-4 bg-gold text-wine-dark font-jost text-[9px] tracking-[0.2em] uppercase px-3 py-1.5">New</span>
              )}
              {hasDiscount && (
                <span className="absolute top-4 left-4 mt-8 bg-wine text-cream-light font-jost text-[9px] tracking-[0.2em] uppercase px-3 py-1.5" style={{ top: p.isNewArrival ? '56px' : '16px' }}>
                  -{Math.round((1 - p.discountPrice / p.price) * 100)}%
                </span>
              )}
            </div>
            {p.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-2 sm:gap-3">
                {p.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`aspect-square overflow-hidden border-2 transition-all duration-200 ${activeImage === i ? 'border-wine' : 'border-transparent hover:border-cream-darker'}`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-5 sm:space-y-6">
            {p.category && (
              <p className="font-jost text-[10px] tracking-[0.25em] uppercase text-gold">{p.category.name}</p>
            )}
            <h1 className="font-cormorant text-3xl sm:text-4xl lg:text-5xl font-light text-wine-dark leading-tight">{p.name}</h1>

            {/* Rating */}
            {p.numReviews > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.round(p.rating) ? 'fill-gold text-gold' : 'text-cream-darker'}`} />
                  ))}
                </div>
                <span className="font-karla text-sm text-wine-dark/50">({p.numReviews} reviews)</span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="font-cormorant text-3xl sm:text-4xl text-wine">₹{price.toLocaleString('en-IN')}</span>
              {hasDiscount && (
                <>
                  <span className="font-karla text-lg text-wine-dark/35 line-through">₹{p.price.toLocaleString('en-IN')}</span>
                  <span className="font-jost text-[10px] tracking-[0.12em] uppercase bg-wine/10 text-wine px-2 py-1">
                    {Math.round((1 - p.discountPrice / p.price) * 100)}% off
                  </span>
                </>
              )}
            </div>

            <div className="w-16 h-px bg-gold/50" />

            {/* Short description */}
            {p.shortDescription && (
              <p className="font-karla text-sm text-wine-dark/65 leading-relaxed">{p.shortDescription}</p>
            )}

            {/* Product details grid */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                ['Fabric', p.fabric],
                ['Work', p.work],
                ['Length', p.length ? `${p.length} metres` : null],
                ['Blouse', p.blouseIncluded ? 'Included' : 'Not Included'],
                ['Origin', p.origin],
                ['SKU', p.sku],
              ].filter(([, v]) => v).map(([k, v]) => (
                <div key={k}>
                  <span className="font-jost text-[9px] tracking-[0.2em] uppercase text-wine-dark/45">{k}</span>
                  <p className="font-karla text-wine-dark mt-0.5">{v}</p>
                </div>
              ))}
            </div>

            {/* Occasion tags */}
            {p.occasion?.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {p.occasion.map(o => (
                  <Link
                    key={o}
                    to={`/collections?occasion=${o}`}
                    className="font-jost text-[9px] tracking-[0.18em] uppercase px-3 py-1.5 border border-cream-darker/60 text-wine-dark/55 hover:border-wine hover:text-wine transition-colors"
                  >
                    {o}
                  </Link>
                ))}
              </div>
            )}

            {/* Quantity + Add to bag */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-cream-darker/60">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 hover:bg-cream-dark transition-colors font-karla text-wine-dark/60"
                  aria-label="Decrease"
                >−</button>
                <span className="px-5 py-3 font-karla text-sm border-x border-cream-darker/60 min-w-[3rem] text-center text-wine-dark">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(p.stock, quantity + 1))}
                  className="px-4 py-3 hover:bg-cream-dark transition-colors font-karla text-wine-dark/60"
                  aria-label="Increase"
                >+</button>
              </div>
              <span className="font-karla text-xs text-wine-dark/45">
                {p.stock > 0 ? `${p.stock} in stock` : <span className="text-red-500">Out of stock</span>}
              </span>
            </div>

            <div className="flex gap-3 sm:gap-4">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleAddToCart}
                disabled={p.stock === 0}
                className="flex-1 bg-wine text-cream-light py-4 font-jost text-[11px] tracking-[0.22em] uppercase flex items-center justify-center gap-2 hover:bg-wine-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Bag
              </motion.button>
              <button
                onClick={handleWishlist}
                className={`w-14 h-14 border flex items-center justify-center hover:border-wine hover:text-wine transition-all ${wishlisted ? 'border-wine bg-wine/5 text-wine' : 'border-cream-darker/60 text-wine-dark/40'}`}
                aria-label="Add to wishlist"
              >
                <Heart className={`w-5 h-5 transition-all ${wishlisted ? 'fill-wine' : ''}`} />
              </button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-cream-darker/40">
              {[
                [Truck, 'Free Shipping', '₹2000+'],
                [RotateCcw, 'Easy Returns', '15 days'],
                [Shield, 'Authentic', 'Guaranteed'],
              ].map(([Icon, label, sub]) => (
                <div key={label} className="text-center p-2 sm:p-3">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5 mx-auto mb-1.5 text-gold" />
                  <p className="font-jost text-[9px] sm:text-[10px] tracking-[0.15em] uppercase text-wine-dark">{label}</p>
                  <p className="font-karla text-[10px] text-wine-dark/40">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs: Description / Care / Reviews */}
        <div className="mt-16 sm:mt-20 border-t border-cream-darker/40 pt-10 sm:pt-12">
          <div className="flex gap-6 sm:gap-8 border-b border-cream-darker/40 mb-8 sm:mb-10 overflow-x-auto scrollbar-hide">
            {[
              ['description', 'Description'],
              ['care', 'Care Instructions'],
              ['reviews', `Reviews (${p.numReviews})`],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`pb-4 font-jost text-[10px] tracking-[0.22em] uppercase transition-colors border-b-2 -mb-px whitespace-nowrap shrink-0 ${activeTab === id ? 'border-wine text-wine-dark' : 'border-transparent text-wine-dark/45 hover:text-wine-dark'}`}
              >
                {label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'description' && (
              <motion.div
                key="desc"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="max-w-3xl"
              >
                <p className="font-karla text-base text-wine-dark/75 leading-relaxed whitespace-pre-line">{p.description}</p>
              </motion.div>
            )}

            {activeTab === 'care' && (
              <motion.div
                key="care"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="max-w-3xl"
              >
                <p className="font-karla text-base text-wine-dark/75 leading-relaxed">
                  {p.care || 'Dry clean only. Store in a cool, dry place away from direct sunlight. Fold along the original fold lines. Do not wring or twist. Handle embellishments and zari work with care.'}
                </p>
              </motion.div>
            )}

            {activeTab === 'reviews' && (
              <motion.div
                key="reviews"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="max-w-3xl space-y-8"
              >
                {p.reviews?.length === 0 && (
                  <p className="font-cormorant text-xl text-wine-dark/40">No reviews yet. Be the first to review!</p>
                )}
                {p.reviews?.map(r => (
                  <div key={r._id} className="border-b border-cream-darker/40 pb-8">
                    <div className="flex items-center gap-1.5 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-gold text-gold' : 'text-cream-darker'}`} />
                      ))}
                    </div>
                    <p className="font-karla text-sm text-wine-dark/75 mb-3 leading-relaxed">"{r.comment}"</p>
                    <p className="font-jost text-[9px] tracking-[0.2em] uppercase text-wine-dark/40">— {r.name}</p>
                  </div>
                ))}

                {user && (
                  <div className="pt-4">
                    <h4 className="font-cormorant text-2xl text-wine-dark mb-6">Write a Review</h4>
                    <div className="space-y-4">
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(n => (
                          <button key={n} onClick={() => setReviewForm(f => ({ ...f, rating: n }))}>
                            <Star className={`w-6 h-6 ${n <= reviewForm.rating ? 'fill-gold text-gold' : 'text-cream-darker hover:text-gold'} transition-colors`} />
                          </button>
                        ))}
                      </div>
                      <textarea
                        value={reviewForm.comment}
                        onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                        placeholder="Share your experience with this saree…"
                        rows={4}
                        className="input-field resize-none"
                      />
                      <button
                        onClick={() => reviewMutation.mutate()}
                        disabled={!reviewForm.comment || reviewMutation.isPending}
                        className="btn-primary disabled:opacity-60"
                      >
                        {reviewMutation.isPending ? 'Submitting…' : 'Submit Review'}
                      </button>
                    </div>
                  </div>
                )}
                {!user && (
                  <p className="font-karla text-sm text-wine-dark/50">
                    <Link to="/login" className="text-wine hover:underline">Sign in</Link> to write a review.
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Image zoom modal */}
      <AnimatePresence>
        {showZoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowZoom(false)}
            className="fixed inset-0 z-[100] bg-wine-darker/95 flex items-center justify-center p-4"
          >
            <button className="absolute top-4 right-4 text-cream-light/60 hover:text-cream-light">
              <X className="w-6 h-6" />
            </button>
            <img
              src={p.images?.[activeImage]?.url}
              alt={p.name}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              onClick={e => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
