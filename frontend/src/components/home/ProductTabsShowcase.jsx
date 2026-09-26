import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ProductGrid from './ProductGrid';

const TABS = [
  { id: 'new', label: 'New Arrivals', query: 'newArrival=true' },
  { id: 'bestsellers', label: 'Bestsellers', query: 'bestseller=true' },
  { id: 'trending', label: 'Trending Weaves', query: 'featured=true' },
];

const FALLBACK_PRODUCTS = {
  new: [
    {
      _id: 'fb-new-1',
      name: 'Kanjivaram Crimson Gold Zari Brocade Saree',
      slug: 'kanjivaram-crimson-gold-zari-brocade-saree',
      price: 24500,
      discountPrice: 19800,
      images: [
        { url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop' },
        { url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop' }
      ],
      fabric: 'Pure Katan Silk',
      isNewArrival: true,
      rating: 4.9,
      numReviews: 24,
      stock: 5,
    },
    {
      _id: 'fb-new-2',
      name: 'Royal Banarasi Meenakari Silk Saree',
      slug: 'royal-banarasi-meenakari-silk-saree',
      price: 32000,
      discountPrice: 28500,
      images: [
        { url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=800&auto=format&fit=crop' },
        { url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop' }
      ],
      fabric: 'Banarasi Silk',
      isNewArrival: true,
      rating: 5.0,
      numReviews: 18,
      stock: 3,
    },
    {
      _id: 'fb-new-3',
      name: 'Chanderi Gold Threadwork Saree',
      slug: 'chanderi-gold-threadwork-saree',
      price: 14200,
      discountPrice: 11900,
      images: [
        { url: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=800&auto=format&fit=crop' },
        { url: 'https://images.unsplash.com/photo-1604014237800-1c9102c219da?q=80&w=800&auto=format&fit=crop' }
      ],
      fabric: 'Chanderi Silk Cotton',
      isNewArrival: true,
      rating: 4.8,
      numReviews: 31,
      stock: 8,
    },
    {
      _id: 'fb-new-4',
      name: 'Heritage Paithani Peacock Border Saree',
      slug: 'heritage-paithani-peacock-border-saree',
      price: 29900,
      discountPrice: 26000,
      images: [
        { url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=800&auto=format&fit=crop' },
        { url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop' }
      ],
      fabric: 'Paithani Silk',
      isNewArrival: true,
      rating: 4.9,
      numReviews: 12,
      stock: 4,
    },
  ],
  bestsellers: [
    {
      _id: 'fb-best-1',
      name: 'Varanasi Kadwa Real Silver Zari Weave',
      slug: 'varanasi-kadwa-real-silver-zari-weave',
      price: 38500,
      discountPrice: 34000,
      images: [
        { url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop' },
        { url: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=800&auto=format&fit=crop' }
      ],
      fabric: 'Pure Katan Silk',
      isBestseller: true,
      rating: 5.0,
      numReviews: 42,
      stock: 6,
    },
    {
      _id: 'fb-best-2',
      name: 'Kanchipuram Temple Motif Bridal Saree',
      slug: 'kanchipuram-temple-motif-bridal-saree',
      price: 45000,
      discountPrice: 39500,
      images: [
        { url: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?q=80&w=800&auto=format&fit=crop' },
        { url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop' }
      ],
      fabric: 'Mulberry Silk',
      isBestseller: true,
      rating: 4.9,
      numReviews: 55,
      stock: 2,
    },
    {
      _id: 'fb-best-3',
      name: 'Organza Hand-Painted Floral Silk Saree',
      slug: 'organza-hand-painted-floral-silk-saree',
      price: 18900,
      discountPrice: 15500,
      images: [
        { url: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop' },
        { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop' }
      ],
      fabric: 'Organza Silk',
      isBestseller: true,
      rating: 4.7,
      numReviews: 29,
      stock: 7,
    },
    {
      _id: 'fb-best-4',
      name: 'Maheshwari Tissue Gold Brocade Saree',
      slug: 'maheshwari-tissue-gold-brocade-saree',
      price: 21500,
      discountPrice: 17900,
      images: [
        { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop' },
        { url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop' }
      ],
      fabric: 'Tissue Silk',
      isBestseller: true,
      rating: 4.8,
      numReviews: 38,
      stock: 5,
    },
  ],
  trending: [
    {
      _id: 'fb-trend-1',
      name: 'Bengal Jamdani Handspun Muslin Saree',
      slug: 'bengal-jamdani-handspun-muslin-saree',
      price: 16800,
      discountPrice: 13900,
      images: [
        { url: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop' },
        { url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop' }
      ],
      fabric: 'Handspun Muslin',
      isNewArrival: true,
      rating: 4.9,
      numReviews: 19,
      stock: 4,
    },
    {
      _id: 'fb-trend-2',
      name: 'Tussar Ghicha Raw Silk Botanical Saree',
      slug: 'tussar-ghicha-raw-silk-botanical-saree',
      price: 22800,
      discountPrice: 19200,
      images: [
        { url: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop' },
        { url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop' }
      ],
      fabric: 'Wild Tussar Silk',
      isNewArrival: true,
      rating: 5.0,
      numReviews: 26,
      stock: 3,
    },
    {
      _id: 'fb-trend-3',
      name: 'Patan Patola Double Ikat Royal Saree',
      slug: 'patan-patola-double-ikat-royal-saree',
      price: 52000,
      discountPrice: 46500,
      images: [
        { url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop' },
        { url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop' }
      ],
      fabric: 'Pure Silk Ikat',
      isBestseller: true,
      rating: 5.0,
      numReviews: 15,
      stock: 1,
    },
    {
      _id: 'fb-trend-4',
      name: 'Chanderi Silver Tissue Sheer Weave',
      slug: 'chanderi-silver-tissue-sheer-weave',
      price: 17500,
      discountPrice: 14800,
      images: [
        { url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=800&auto=format&fit=crop' },
        { url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop' }
      ],
      fabric: 'Silver Tissue',
      isNewArrival: true,
      rating: 4.8,
      numReviews: 22,
      stock: 6,
    },
  ],
};

export default function ProductTabsShowcase({
  newArrivals = [],
  bestsellers = [],
  featured = [],
  newLoading = false,
  bestLoading = false,
  featLoading = false,
}) {
  const [activeTab, setActiveTab] = useState('new');

  const getTabProducts = () => {
    switch (activeTab) {
      case 'bestsellers': {
        const raw = bestsellers.length > 0 ? bestsellers : FALLBACK_PRODUCTS.bestsellers;
        return { products: raw.slice(0, 4), loading: bestLoading };
      }
      case 'trending': {
        const raw = featured.length > 0 ? featured : FALLBACK_PRODUCTS.trending;
        return { products: raw.slice(0, 4), loading: featLoading };
      }
      case 'new':
      default: {
        const raw = newArrivals.length > 0 ? newArrivals : FALLBACK_PRODUCTS.new;
        return { products: raw.slice(0, 4), loading: newLoading };
      }
    }
  };

  const { products, loading } = getTabProducts();
  const currentTab = TABS.find((t) => t.id === activeTab);

  return (
    <section className="py-14 sm:py-20 bg-gradient-to-b from-[#FDFAF5] via-[#FDFBF7] to-[#F8F5EE] border-t border-cream-darker/20">
      <div className="w-full max-w-[1850px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
        {/* Header Title */}
        <div className="text-center mb-8 sm:mb-12">
          <p className="eyebrow mb-2 sm:mb-3 text-gold">EXCLUSIVELY CURATED</p>
          <h2 className="heading-lg text-wine-dark mb-6">
            Explore <em>Showcase</em>
          </h2>

          {/* Bespoke Mobile Tab Switcher (Visible on < 640px) */}
          <div className="sm:hidden grid grid-cols-3 gap-1 p-1 bg-cream-darker/25 border border-cream-darker/50 rounded-lg max-w-md mx-auto mb-2">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              const shortLabel = tab.id === 'trending' ? 'Trending' : tab.label;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative py-2.5 px-1 text-center font-jost text-[10.5px] font-semibold tracking-[0.06em] uppercase transition-colors duration-200 z-10 ${isActive ? 'text-wine font-bold' : 'text-wine-dark/70'
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBgMobile"
                      className="absolute inset-0 bg-white rounded-md shadow-sm border border-gold/50 -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                    />
                  )}
                  {shortLabel}
                </button>
              );
            })}
          </div>

          {/* Luxury Desktop Capsule Tabs (Visible on >= 640px) */}
          <div className="hidden sm:inline-flex items-center gap-3 p-1.5 rounded-full bg-cream-darker/20 border border-cream-darker/40 shadow-inner mx-auto">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative px-6 py-2.5 rounded-full font-jost text-sm font-medium tracking-[0.12em] uppercase transition-all duration-300 z-10 ${isActive
                      ? 'text-cream-light font-semibold drop-shadow-xs'
                      : 'text-wine-dark/70 hover:text-wine-dark'
                    }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBgDesktop"
                      className="absolute inset-0 bg-wine-dark rounded-full -z-10 shadow-sm"
                      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                    />
                  )}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content (1 Row of 4 Products) */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          >
            <ProductGrid products={products} loading={loading} />
          </motion.div>
        </AnimatePresence>

        {/* View All Button */}
        <div className="text-center mt-10 sm:mt-12">
          <Link
            to={`/collections?${currentTab.query}`}
            className="btn-outline inline-flex items-center gap-2 text-xs px-8 py-3.5"
          >
            Explore All {currentTab.label} <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
