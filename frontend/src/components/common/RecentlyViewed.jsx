import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, ShoppingBag, Eye, Sparkles } from 'lucide-react';
import { getRecentlyViewed } from '../../utils/recentlyViewed';
import { trackSelectItem } from '../../utils/analytics';
import { useCartStore } from '../../store/useCartStore';
import toast from 'react-hot-toast';

export default function RecentlyViewed({ currentProductId = null, title = 'Recently Viewed Sarees' }) {
  const [items, setItems] = useState([]);
  const scrollRef = useRef(null);
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    const list = getRecentlyViewed();
    // Exclude current product if viewing on product detail page
    const filtered = currentProductId ? list.filter((p) => p._id !== currentProductId) : list;
    setItems(filtered);
  }, [currentProductId]);

  if (!items || items.length === 0) return null;

  const scroll = (direction) => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  const handleQuickAdd = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
    toast.success(`${product.name} added to your bag`, {
      style: { fontFamily: 'Jost', fontSize: '12px', letterSpacing: '0.05em' },
    });
  };

  return (
    <section className="pt-8 sm:pt-12 pb-10 sm:pb-14 border-t border-neutral-200/80 bg-[#FDFBF7]">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-6 sm:mb-8">
          <div>
            <span className="font-jost text-[10px] tracking-[0.25em] uppercase text-gold font-bold flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3 h-3 text-gold" />
              Pick Up Where You Left Off
            </span>
            <h2 className="font-cormorant text-2xl sm:text-3xl lg:text-4xl font-light text-wine-dark tracking-tight">
              {title}
            </h2>
          </div>

          {/* Slider Arrow Controls */}
          {items.length > 3 && (
            <div className="hidden sm:flex items-center gap-2">
              <button
                onClick={() => scroll('left')}
                className="w-9 h-9 rounded-full border border-neutral-300 hover:border-wine hover:text-wine bg-white flex items-center justify-center transition-all shadow-2xs"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll('right')}
                className="w-9 h-9 rounded-full border border-neutral-300 hover:border-wine hover:text-wine bg-white flex items-center justify-center transition-all shadow-2xs"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Carousel Container */}
        <div
          ref={scrollRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 custom-thin-scrollbar scroll-smooth"
        >
          {items.map((p) => {
            const price = p.discountPrice || p.price;
            const hasDiscount = p.discountPrice && p.discountPrice < p.price;
            const discountPct = hasDiscount ? Math.round((1 - p.discountPrice / p.price) * 100) : 0;
            const imgUrl = p.images?.[0]?.url || p.image || '/placeholder-saree.jpg';

            return (
              <div
                key={p._id}
                className="flex-shrink-0 w-44 sm:w-56 lg:w-64 group bg-white rounded-xl border border-neutral-200/80 hover:border-gold/50 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <Link
                  to={`/product/${p.slug}`}
                  onClick={() => trackSelectItem(p, 'Recently Viewed Carousel')}
                  className="block relative"
                >
                  {/* Image */}
                  <div className="relative aspect-[3/4] bg-neutral-100 overflow-hidden">
                    <img
                      src={imgUrl}
                      alt={p.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Discount Badge */}
                    {hasDiscount && (
                      <span className="absolute top-2 left-2 bg-[#cc0000] text-white font-jost text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs shadow-xs">
                        -{discountPct}%
                      </span>
                    )}

                    {/* Quick Add Overlay on Hover */}
                    <button
                      onClick={(e) => handleQuickAdd(e, p)}
                      className="absolute bottom-2 right-2 p-2 rounded-full bg-white text-wine shadow-md hover:bg-wine hover:text-white transition-all transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100"
                      title="Quick Add to Bag"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Info */}
                  <div className="p-3 sm:p-3.5 space-y-1">
                    <p className="font-jost text-[10px] font-bold uppercase tracking-widest text-gold truncate">
                      {p.fabric || p.category || 'Handcrafted Saree'}
                    </p>
                    <h3 className="font-cormorant text-base sm:text-lg font-medium text-wine-dark line-clamp-1 group-hover:text-wine transition-colors">
                      {p.name}
                    </h3>
                    <div className="flex items-baseline gap-2 pt-0.5">
                      <span className="font-jost text-sm sm:text-base font-bold text-black">
                        ₹{price?.toLocaleString('en-IN')}
                      </span>
                      {hasDiscount && (
                        <span className="font-karla text-xs text-neutral-400 line-through">
                          ₹{p.price?.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
