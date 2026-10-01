import { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  Search, X, Bookmark, BookmarkCheck, Eye, Sparkles,
  Heart, ArrowLeft, SlidersHorizontal, Flame
} from 'lucide-react';
import { useAuthStore } from '../../../store/useAuthStore';
import api from '../../../utils/api';
import toast from 'react-hot-toast';

// Curated realistic engagement counts for Instagram-style explore grid
const DUMMY_VIEWS = [
  '4.4M', '163K', '78.7M', '3.2M', '24.6K', '1.2M', '509K', '890K',
  '2.1M', '950K', '6.8M', '412K', '15.4M', '730K', '5.5M', '1.8M',
  '340K', '9.2M', '88K', '3.7M', '12.1M', '620K', '2.9M', '4.1M',
  '5.8M', '1.5M', '840K', '3.9M', '19.2M', '450K', '2.7M', '9.8M'
];

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export default function InstagramSearchModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [shuffleKey, setShuffleKey] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { user, token } = useAuthStore();

  const activeSearch = searchQuery.trim();

  // Reshuffle products when opened (No auto-focus to prevent automatic keyboard popup)
  useEffect(() => {
    if (isOpen) {
      setShuffleKey(Date.now());
    }
  }, [isOpen]);

  // Lock body scroll when search is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Fetch all matching products from database
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['explore-products', activeSearch],
    queryFn: () =>
      api
        .get('/products', {
          params: {
            search: activeSearch || undefined,
            limit: 60,
          },
        })
        .then((r) => r.data),
    enabled: isOpen,
    staleTime: 10 * 1000,
  });

  const rawProducts = productsData?.products || [];

  // When no search active, randomize the products order every time opened / refreshed like Instagram
  const products = useMemo(() => {
    if (!rawProducts.length) return [];
    if (activeSearch) {
      return rawProducts;
    }
    return shuffleArray(rawProducts);
  }, [rawProducts, activeSearch, shuffleKey]);

  // Generate randomized view counts per product per session
  const productViews = useMemo(() => {
    const map = {};
    const shuffledViews = shuffleArray(DUMMY_VIEWS);
    products.forEach((p, idx) => {
      map[p._id] = shuffledViews[idx % shuffledViews.length] || '1.2M';
    });
    return map;
  }, [products]);

  // Toggle Wishlist mutation (acts as "Save" button)
  const handleToggleWishlist = async (productId, e) => {
    e.stopPropagation();
    if (!token) {
      toast('Please login to save this saree', { icon: '✨' });
      navigate('/login?redirect=/collections');
      onClose();
      return;
    }
    try {
      await api.put(`/auth/wishlist/${productId}`);
      // Refresh user state
      useAuthStore.getState().fetchMe();
      toast.success('Saved to your collection!');
    } catch {
      toast.error('Could not update saved sarees');
    }
  };

  const handleProductClick = (product) => {
    onClose();
    navigate(`/products/${product._id}`);
  };

  const handleGoToSavedWishlist = () => {
    onClose();
    navigate('/wishlist');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#FDFAF5] flex flex-col pb-16"
      >
        {/* Top Instagram-Style Header in Luxury Light Theme */}
        <div className="bg-[#FDFAF5]/98 backdrop-blur-md border-b border-[#DDD0BC]/80 px-3 sm:px-6 pt-3 pb-3 shrink-0 shadow-xs">
          <div className="max-w-screen-md mx-auto flex items-center gap-2.5">
            {/* Back Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 -ml-1 text-[#411B1E]/80 hover:text-[#6B2732] rounded-full transition-colors"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            {/* Light Theme Pill Search Bar */}
            <div className="flex-1 relative flex items-center bg-white border border-[#DDD0BC] rounded-full px-3.5 py-2 shadow-xs focus-within:border-[#C99B4E] focus-within:ring-2 focus-within:ring-[#C99B4E]/20 transition-all">
              <Search className="w-4 h-4 text-[#6B2732]/70 shrink-0 mr-2.5" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search sarees, colors, fabrics, occasions…"
                className="flex-1 bg-transparent text-[#411B1E] text-xs sm:text-sm font-karla placeholder:text-[#411B1E]/40 outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-0.5 text-neutral-400 hover:text-[#411B1E] transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Right-Side Bookmark / Save Icon (Navigates to Wishlist) */}
            <button
              type="button"
              onClick={handleGoToSavedWishlist}
              className="relative p-2 text-[#411B1E]/80 hover:text-[#6B2732] rounded-full transition-colors group flex items-center justify-center"
              title="Saved Sarees"
            >
              <Bookmark className="w-5 h-5 group-hover:scale-110 transition-transform" />
              {user?.wishlist?.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-[#C99B4E] rounded-full ring-2 ring-[#FDFAF5]" />
              )}
            </button>
          </div>
        </div>

        {/* Explore Reels & Photo Grid Content */}
        <div className="flex-1 overflow-y-auto px-1 sm:px-4 py-2 sm:py-4 max-w-screen-lg mx-auto w-full">
          {isLoading ? (
            /* Instagram Grid Shimmer Skeleton */
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-1.5">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] bg-[#EDE3D4]/60 rounded-sm animate-pulse"
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            /* Empty State */
            <div className="text-center py-24 px-4 space-y-3">
              <div className="w-14 h-14 rounded-full bg-white border border-[#DDD0BC] mx-auto flex items-center justify-center text-[#6B2732]/60 shadow-xs">
                <Search className="w-6 h-6" />
              </div>
              <p className="font-jost text-base font-bold text-[#411B1E] tracking-wide">
                No Sarees Found for "{activeSearch}"
              </p>
              <p className="font-karla text-xs text-[#411B1E]/60 max-w-xs mx-auto">
                Try searching for colors like "Red", "Pink", "Gold" or fabrics like "Silk", "Banarasi".
              </p>
            </div>
          ) : (
            /* Instagram Explore 3-Column Grid */
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1 sm:gap-1.5 pb-20">
              {products.map((p, idx) => {
                const isSaved = user?.wishlist?.some(
                  (id) => id === p._id || id?._id === p._id
                );
                const viewCount = productViews[p._id] || DUMMY_VIEWS[idx % DUMMY_VIEWS.length];
                const imgUrl = p.images?.[0]?.url || '';

                return (
                  <motion.div
                    key={p._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2, delay: Math.min(0.2, idx * 0.02) }}
                    onClick={() => handleProductClick(p)}
                    className="group relative aspect-[3/4] overflow-hidden bg-[#EDE3D4]/50 rounded-sm cursor-pointer select-none shadow-xs"
                  >
                    {/* Saree Image */}
                    {imgUrl ? (
                      <img
                        src={imgUrl}
                        alt={p.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-[#EDE3D4]/60 flex items-center justify-center text-[10px] text-[#411B1E]/60 font-cormorant">
                        Tantvani
                      </div>
                    )}

                    {/* Gradient overlay on bottom for clear text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-85 group-hover:opacity-100 transition-opacity" />

                    {/* Top-Right Save / Bookmark Button */}
                    <button
                      type="button"
                      onClick={(e) => handleToggleWishlist(p._id, e)}
                      className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-white/90 backdrop-blur-md shadow-sm flex items-center justify-center text-[#411B1E] hover:text-[#6B2732] hover:bg-white transition-all opacity-0 group-hover:opacity-100 sm:opacity-100"
                      title={isSaved ? 'Saved' : 'Save Saree'}
                    >
                      {isSaved ? (
                        <BookmarkCheck className="w-4 h-4 text-[#6B2732]" />
                      ) : (
                        <Bookmark className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {/* Bottom Info: Dummy Instagram Engagement View Count */}
                    <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between text-white drop-shadow-md">
                      <div className="flex items-center gap-1 bg-black/40 backdrop-blur-xs px-1.5 py-0.5 rounded text-[10px] font-jost font-semibold">
                        <Eye className="w-3 h-3 text-white/90" />
                        <span>{viewCount}</span>
                      </div>

                      <span className="text-[10px] font-jost font-bold text-[#FFF2D7] drop-shadow-sm">
                        ₹{(p.discountPrice || p.price).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
