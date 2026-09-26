import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Award, RefreshCw, Truck, Shield } from 'lucide-react';
import HeroSection from '../components/home/HeroSection';
import HeroFeatureBar from '../components/home/HeroFeatureBar';
import FeaturedCategories from '../components/home/FeaturedCategories';
import ProductGrid from '../components/home/ProductGrid';
import ProductTabsShowcase from '../components/home/ProductTabsShowcase';
import ShopByOccasion from '../components/home/ShopByOccasion';
import WeaversLegacySection from '../components/home/WeaversLegacySection';
import CustomerReviewCarousel from '../components/home/CustomerReviewCarousel';
import api from '../utils/api';

function SectionTitle({ eyebrow, title, sub, center = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5 }}
      className={`mb-10 sm:mb-14 ${center ? 'text-center' : ''}`}
    >
      <p className="eyebrow mb-2 sm:mb-3 text-gold">{eyebrow}</p>
      <h2 className="heading-lg text-wine-dark">{title}</h2>
      {sub && <p className="body-sm mt-3 max-w-lg mx-auto text-wine-dark/70">{sub}</p>}
    </motion.div>
  );
}

export default function HomePage() {
  const { data: featuredData, isLoading: featLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => api.get('/products/featured').then(r => r.data),
    staleTime: 3 * 60 * 1000,
  });

  const { data: newData, isLoading: newLoading } = useQuery({
    queryKey: ['products', 'new-arrivals'],
    queryFn: () => api.get('/products/new-arrivals').then(r => r.data),
    staleTime: 3 * 60 * 1000,
  });

  const { data: bestData, isLoading: bestLoading } = useQuery({
    queryKey: ['products', 'bestsellers'],
    queryFn: () => api.get('/products/bestsellers').then(r => r.data),
    staleTime: 3 * 60 * 1000,
  });

  const featured = featuredData?.products || [];
  const newArrivals = newData?.products || [];
  const bestsellers = bestData?.products || [];

  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <HeroFeatureBar />

      {/* Heritage marquee */}
      <div className="bg-wine py-3.5 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {[...Array(3)].map((_, i) => (
            <span key={i} className="inline-flex items-center gap-8 mx-8">
              {['Handwoven Masterpieces', 'Heritage Weaving', 'Pure Silk Sarees', 'Authentic Handloom', 'Bridal Trousseau', 'Free Shipping ₹2000+'].map(t => (
                <span key={t} className="text-cream-light/80 font-jost text-[10px] tracking-[0.3em] uppercase">
                  {t} <span className="text-gold mx-4">◆</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* Categories */}
      <FeaturedCategories />

      {/* Featured Products / Curator's Pick (4 Statement Sarees) */}
      {(featured.length > 0 || featLoading) && (
        <section className="pt-14 sm:pt-20 pb-12 sm:pb-16 bg-gradient-subtle border-t border-cream-darker/20">
          <div className="w-full max-w-[1850px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16">
            <SectionTitle eyebrow="Curator's Pick" title={<>Featured <em>Sarees</em></>} sub="Handpicked luxury statement weaves crafted for extraordinary moments." />
            <ProductGrid products={featured.slice(0, 4)} loading={featLoading} />
            {featured.length > 0 && (
              <div className="text-center mt-8 sm:mt-10">
                <Link to="/collections?featured=true" className="btn-ghost inline-flex items-center gap-2">
                  View All Featured <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Shop By Occasion (Royal Visual Cards) */}
      <ShopByOccasion />

      {/* Craft & Weaver's Legacy (300+ Hours Handloom & Authentic Silk Showcase) */}
      <WeaversLegacySection />

      {/* Interactive Product Tabs Showcase (New Arrivals / Bestsellers / Trending - 1 Row) */}
      <ProductTabsShowcase
        newArrivals={newArrivals}
        bestsellers={bestsellers}
        featured={featured}
        newLoading={newLoading}
        bestLoading={bestLoading}
        featLoading={featLoading}
      />

      {/* 3D Coverflow Customer Stories & Reviews */}
      <CustomerReviewCarousel />
    </main>
  );
}
