import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  ShoppingBag,
  Trash2,
  Sparkles,
  ChevronRight,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const qc = useQueryClient();
  const addItem = useCartStore((s) => s.addItem);

  const { data, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.get('/auth/me').then((r) => r.data),
  });

  const removeMutation = useMutation({
    mutationFn: (productId) => api.put(`/auth/wishlist/${productId}`),
    onSuccess: () => {
      qc.invalidateQueries(['me']);
    },
    onError: () => toast.error('Could not update wishlist'),
  });

  const wishlist = data?.user?.wishlist || [];

  const handleMoveAllToBag = async () => {
    if (wishlist.length === 0) return;
    try {
      wishlist.forEach((p) => {
        addItem(p, 1);
      });
      await api.delete('/auth/wishlist/clear');
      qc.setQueryData(['me'], (old) =>
        old ? { ...old, user: { ...old.user, wishlist: [] } } : old
      );
      qc.invalidateQueries(['me']);
      toast.success(`Moved ${wishlist.length} ${wishlist.length === 1 ? 'saree' : 'sarees'} to your bag!`);
    } catch (err) {
      toast.error('Failed to clear wishlist');
    }
  };

  const handleMoveSingleToBag = (p) => {
    addItem(p, 1);
    removeMutation.mutate(p._id);
    toast.success(`${p.name} moved to your bag`);
  };

  return (
    <div className="min-h-screen bg-white pt-3 sm:pt-5 pb-20">
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
          <span className="text-black font-bold">My Wishlist</span>
        </nav>

        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-3 sm:pb-4 mb-4 sm:mb-6 border-b border-neutral-200 gap-2 sm:gap-3">
          <div>
            <span className="font-jost text-[10px] sm:text-xs tracking-[0.22em] uppercase text-gold font-bold flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gold" />
              Saved Heirloom Weaves
            </span>
            <h1 className="font-jost text-xl sm:text-3xl font-bold text-black tracking-tight mt-0.5 sm:mt-1">
              Your Wishlist{' '}
              <span className="text-neutral-400 font-normal text-base sm:text-xl">
                ({wishlist.length} {wishlist.length === 1 ? 'Saree' : 'Sarees'})
              </span>
            </h1>
          </div>

          {wishlist.length > 0 && (
            <div className="flex items-center gap-3">
              <button
                onClick={handleMoveAllToBag}
                className="px-4 py-2.5 bg-black hover:bg-neutral-800 text-white font-jost text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-xs hover:shadow-md flex items-center gap-2"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                Move All to Bag
              </button>
            </div>
          )}
        </div>

        {/* Content Body */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-neutral-200 p-3 space-y-3 bg-white">
                <div className="aspect-portrait shimmer rounded-xl" />
                <div className="space-y-2">
                  <div className="shimmer h-4 w-3/4 rounded" />
                  <div className="shimmer h-5 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          /* Premium Empty State */
          <div className="py-16 sm:py-24 text-center max-w-md mx-auto space-y-5">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-neutral-100 border border-neutral-200 mx-auto flex items-center justify-center text-neutral-400 shadow-xs">
              <Heart className="w-9 h-9 sm:w-10 sm:h-10 text-neutral-400" />
            </div>
            <div className="space-y-1.5">
              <h2 className="font-jost text-xl sm:text-2xl font-bold text-black tracking-tight">
                Your Wishlist is Empty
              </h2>
              <p className="font-karla text-sm text-neutral-500 max-w-sm mx-auto">
                Keep track of the sarees you love! Click the heart icon on any handloom weave to save it here.
              </p>
            </div>
            <div className="pt-2">
              <Link
                to="/collections"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-black hover:bg-neutral-800 text-white font-jost text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                Explore Saree Collections <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          /* Luxury Wishlist Product Grid */
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.05 } } }}
          >
            <AnimatePresence mode="popLayout">
              {wishlist.map((p) => {
                const price = p.discountPrice || p.price;
                const hasDiscount = p.discountPrice && p.discountPrice < p.price;
                const savings = hasDiscount ? p.price - p.discountPrice : 0;

                return (
                  <motion.div
                    key={p._id}
                    layout
                    variants={{
                      hidden: { opacity: 0, y: 16 },
                      visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                    }}
                    exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.2 } }}
                    className="group rounded-2xl bg-white border border-neutral-200 overflow-hidden shadow-xs hover:border-neutral-300 hover:shadow-lg transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Product Image Box */}
                      <div className="relative aspect-portrait bg-neutral-100 overflow-hidden">
                        <Link to={`/product/${p.slug}`} className="block w-full h-full">
                          <img
                            src={p.images?.[0]?.url || p.image}
                            alt={p.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                        </Link>

                        {/* Top Badges */}
                        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                          {hasDiscount && (
                            <span className="bg-red-600 text-white font-jost text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-xs">
                              Save ₹{savings.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>

                        {/* Remove from Wishlist Button */}
                        <button
                          onClick={() => removeMutation.mutate(p._id)}
                          className="absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-neutral-400 hover:text-red-600 flex items-center justify-center transition-all shadow-sm"
                          title="Remove from wishlist"
                          aria-label="Remove from wishlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Product Info */}
                      <div className="p-3.5 sm:p-4 space-y-1.5">
                        <p className="font-jost text-[10px] font-bold uppercase tracking-wider text-gold truncate">
                          {p.fabric || p.category?.name || 'Handloom Heritage'}
                        </p>

                        <Link to={`/product/${p.slug}`}>
                          <h3 className="font-jost text-sm sm:text-base font-bold text-black group-hover:text-wine transition-colors line-clamp-2 leading-snug">
                            {p.name}
                          </h3>
                        </Link>

                        {/* Price */}
                        <div className="flex items-baseline gap-2 pt-1">
                          <span className="font-jost text-base sm:text-lg font-bold text-black">
                            ₹{price?.toLocaleString('en-IN')}
                          </span>
                          {hasDiscount && (
                            <span className="font-karla text-xs text-neutral-400 line-through">
                              ₹{p.price?.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action: Move to Bag */}
                    <div className="p-3 sm:p-4 pt-0">
                      <button
                        onClick={() => handleMoveSingleToBag(p)}
                        className="w-full py-2.5 sm:py-3 bg-black hover:bg-neutral-800 text-white rounded-xl font-jost text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-xs hover:shadow-md group/btn"
                      >
                        <ShoppingBag className="w-3.5 h-3.5 transition-transform group-hover/btn:scale-110" />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

