import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../../utils/api';

const FALLBACK = [
  { name: 'Banarasi Sarees', slug: 'banarasi', image: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?q=80&w=800&auto=format&fit=crop' },
  { name: 'Kanjivaram Silk', slug: 'kanjivaram', image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop' },
  { name: 'Chanderi & Maheshwari', slug: 'chanderi', image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop' },
  { name: 'Organza & Tussar', slug: 'organza', image: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=800&auto=format&fit=crop' },
  { name: 'Cotton & Linen', slug: 'cotton', image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop' },
  { name: 'Heritage Bridal', slug: 'wedding', image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop' },
  { name: 'Bandhani & Patola', slug: 'bandhani', image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop' },
  { name: 'Tissue & Georgette', slug: 'tissue', image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop' },
  { name: 'Paithani Masterpiece', slug: 'paithani', image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop' },
  { name: 'Jamdani Weaves', slug: 'jamdani', image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop' },
  { name: 'Sambalpuri Handloom', slug: 'sambalpuri', image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=800&auto=format&fit=crop' },
];

export default function FeaturedCategories() {
  const scrollRef = useRef(null);

  const { data } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const cats = data?.categories?.filter(c => c.isActive) || [];
  // Ensure we show all backend categories plus additional trending items if backend has fewer items
  const items = cats.length >= 8 ? cats : [...cats, ...FALLBACK.slice(cats.length)];

  return (
    <section className="pt-8 sm:pt-12 pb-10 sm:pb-14 bg-cream w-full overflow-hidden relative">
      <div className="w-full">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4 }}
          className="text-center mb-3 sm:mb-4 px-4"
        >
          <p className="eyebrow mb-1 text-gold">SHOP BY CATEGORY</p>
          <h2 className="heading-lg text-wine-dark mb-1">
            Explore Our <em>Categories</em>
          </h2>
          <div className="divider-ornate max-w-xs mx-auto">
            <span className="eyebrow text-gold px-2">✦</span>
          </div>
        </motion.div>

        {/* Horizontal Scroll Row */}
        <div
          ref={scrollRef}
          className="flex items-start gap-5 sm:gap-8 lg:gap-10 overflow-x-auto custom-thin-scrollbar scroll-smooth px-4 sm:px-8 pt-2 pb-4 w-full"
        >
          {items.map((cat, i) => {
            const fallbackItem = FALLBACK[i % FALLBACK.length];
            const imgSrc = cat.image || fallbackItem.image;
            const href = cat._id
              ? `/collections?category=${cat._id}`
              : `/collections?search=${cat.slug || fallbackItem.slug}`;
            const catName = cat.name || fallbackItem.name;

            return (
              <div
                key={cat._id || cat.slug || i}
                className="flex-shrink-0 flex flex-col items-center text-center group cursor-pointer"
              >
                <Link to={href} className="flex flex-col items-center group">
                  {/* Circle Image Wrapper with Theme Color Border */}
                  <div className="p-1 sm:p-1.5 rounded-full border-2 border-gold/70 group-hover:border-wine transition-all duration-300 shadow-md group-hover:shadow-xl group-hover:scale-105 bg-white mb-2">
                    <div className="w-28 h-28 sm:w-36 sm:h-36 lg:w-40 lg:h-40 rounded-full overflow-hidden relative bg-wine-darker/10">
                      <img
                        src={imgSrc}
                        alt={catName}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = fallbackItem.image;
                        }}
                      />
                      <div className="absolute inset-0 bg-wine-darker/0 group-hover:bg-wine-darker/20 transition-colors duration-300" />
                    </div>
                  </div>

                  {/* Category Title */}
                  <p className="font-cormorant text-base sm:text-lg lg:text-xl font-medium text-wine-dark text-center tracking-wide group-hover:text-wine transition-colors whitespace-nowrap px-1">
                    {catName}
                  </p>
                </Link>
              </div>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-6 sm:mt-8">
          <Link to="/collections" className="btn-outline px-8 py-3 text-xs">
            View All Categories
          </Link>
        </div>
      </div>
    </section>
  );
}
