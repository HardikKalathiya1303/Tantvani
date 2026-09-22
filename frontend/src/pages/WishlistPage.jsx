import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, X } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const qc = useQueryClient();
  const addItem = useCartStore(s => s.addItem);

  const { data, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: () => api.get('/auth/me').then(r => r.data),
  });

  const removeMutation = useMutation({
    mutationFn: (productId) => api.put(`/auth/wishlist/${productId}`),
    onSuccess: () => {
      qc.invalidateQueries(['me']);
      toast.success('Removed from wishlist');
    },
    onError: () => toast.error('Could not update wishlist'),
  });

  const wishlist = data?.user?.wishlist || [];

  return (
    <div className="pb-24 min-h-screen bg-cream">
      <div className="bg-cream-dark/50 py-12 sm:py-16 border-b border-cream-darker/30">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">
          <p className="eyebrow mb-3">Your</p>
          <h1 className="font-cormorant text-3xl sm:text-4xl font-light text-wine-dark">
            Wishlist <span className="text-wine-dark/30">({wishlist.length})</span>
          </h1>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 pt-10">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card-product">
                <div className="aspect-portrait shimmer" />
                <div className="p-4 space-y-2">
                  <div className="shimmer h-4 w-3/4 rounded" />
                  <div className="shimmer h-5 w-1/3 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : wishlist.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 border border-cream-darker mx-auto mb-6 flex items-center justify-center">
              <Heart className="w-8 h-8 text-wine-dark/20" />
            </div>
            <p className="font-cormorant text-2xl sm:text-3xl text-wine-dark/40 mb-3">Your wishlist is empty</p>
            <p className="body-sm text-wine-dark/35 mb-8">Save sarees you love by clicking the heart icon.</p>
            <Link to="/collections" className="btn-primary">Explore Collections</Link>
          </div>
        ) : (
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
            initial="hidden"
            animate="visible"
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }}
          >
            <AnimatePresence mode="popLayout">
              {wishlist.map(p => (
                <motion.div
                  key={p._id}
                  layout
                  variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.45 } } }}
                  exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.2 } }}
                  className="group card-product relative"
                >
                  {/* Remove button */}
                  <button
                    onClick={() => removeMutation.mutate(p._id)}
                    className="absolute top-3 right-3 z-10 w-8 h-8 bg-cream-light/90 hover:bg-cream-light flex items-center justify-center text-wine-dark/50 hover:text-wine transition-all"
                    aria-label="Remove from wishlist"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>

                  <Link to={`/product/${p.slug}`} className="block">
                    <div className="relative overflow-hidden aspect-portrait bg-cream-dark">
                      {p.images?.[0] ? (
                        <img
                          src={p.images[0].url} alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-wine" />
                      )}
                      {/* Quick add */}
                      <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                        <button
                          onClick={e => { e.preventDefault(); addItem(p, 1); toast.success('Added to bag'); }}
                          className="w-full py-3 bg-wine text-cream-light text-[10px] font-jost font-semibold tracking-[0.18em] uppercase hover:bg-wine-light transition-colors flex items-center justify-center gap-2"
                        >
                          <ShoppingBag className="w-3 h-3" /> Add to Bag
                        </button>
                      </div>
                    </div>
                    <div className="p-3 sm:p-4">
                      {p.category?.name && (
                        <p className="font-jost text-[9px] tracking-[0.2em] uppercase text-gold mb-1.5">{p.category.name}</p>
                      )}
                      <h3 className="font-cormorant text-base sm:text-lg text-wine-dark group-hover:text-wine transition-colors line-clamp-2 leading-snug mb-2">
                        {p.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className="font-cormorant text-lg sm:text-xl font-medium text-wine">
                          ₹{(p.discountPrice || p.price)?.toLocaleString('en-IN')}
                        </span>
                        {p.discountPrice && p.discountPrice < p.price && (
                          <span className="font-karla text-sm text-wine-dark/35 line-through">
                            ₹{p.price?.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
