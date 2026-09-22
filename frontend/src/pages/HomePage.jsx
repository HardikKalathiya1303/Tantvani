import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, Award, RefreshCw, Truck, Shield } from 'lucide-react';
import HeroSection from '../components/home/HeroSection';
import FeaturedCategories from '../components/home/FeaturedCategories';
import ProductGrid from '../components/home/ProductGrid';
import api from '../utils/api';

function SectionTitle({ eyebrow, title, sub, center = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6 }}
      className={`mb-12 sm:mb-16 ${center ? 'text-center' : ''}`}
    >
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h2 className="heading-lg text-wine-dark">{title}</h2>
      {sub && <p className="body-sm mt-4 max-w-lg mx-auto">{sub}</p>}
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
    <main>
      <HeroSection />

      {/* Heritage marquee */}
      <div className="bg-wine py-4 overflow-hidden">
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

      {/* Featured Products */}
      {(featured.length > 0 || featLoading) && (
        <section className="py-20 sm:py-28 bg-gradient-subtle">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">
            <SectionTitle eyebrow="Curator's Pick" title={<>Featured <em>Sarees</em></>} />
            <ProductGrid products={featured.slice(0, 8)} loading={featLoading} />
            {featured.length > 0 && (
              <div className="text-center mt-10">
                <Link to="/collections?featured=true" className="btn-ghost inline-flex items-center gap-2">
                  View All Featured <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      {(newArrivals.length > 0 || newLoading) && (
        <section className="py-20 sm:py-28 bg-cream">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">
            <SectionTitle eyebrow="Just In" title={<>New <em>Arrivals</em></>} />
            <ProductGrid products={newArrivals.slice(0, 8)} loading={newLoading} />
            {newArrivals.length > 0 && (
              <div className="text-center mt-10">
                <Link to="/collections?newArrival=true" className="btn-outline inline-flex items-center gap-2">
                  All New Arrivals <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Heritage Banner */}
      <section className="relative py-28 sm:py-40 overflow-hidden bg-gradient-hero">
        <div className="absolute inset-0 opacity-5">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute border border-cream-light/20 rounded-full"
              style={{ width: `${120 + i * 80}px`, height: `${120 + i * 80}px`, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
            />
          ))}
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="eyebrow mb-6">Our Philosophy</p>
            <h2 className="heading-lg text-cream-light mb-8" style={{ fontStyle: 'italic' }}>
              Every Thread Tells<br />a Thousand-Year Story
            </h2>
            <p className="text-cream-light/65 font-karla text-base sm:text-lg leading-relaxed max-w-xl mx-auto mb-10">
              At Tantvani, we partner directly with master weavers across Varanasi, Kanchipuram, and Maheshwar — preserving ancient traditions while bringing their art to modern wardrobes.
            </p>
            <Link to="/about" className="btn-gold">
              Discover Our Heritage
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Bestsellers */}
      {(bestsellers.length > 0 || bestLoading) && (
        <section className="py-20 sm:py-28 bg-cream-light">
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">
            <SectionTitle eyebrow="Most Loved" title={<><em>Bestsellers</em></>} />
            <ProductGrid products={bestsellers.slice(0, 8)} loading={bestLoading} />
            {bestsellers.length > 0 && (
              <div className="text-center mt-10">
                <Link to="/collections?bestseller=true" className="btn-outline">View All Bestsellers</Link>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Trust badges */}
      <section className="py-16 sm:py-20 border-t border-cream-darker/40 bg-cream">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10">
            {[
              { icon: Truck, title: 'Free Shipping', sub: 'On orders above ₹2,000' },
              { icon: RefreshCw, title: '15-Day Returns', sub: 'Hassle-free returns' },
              { icon: Award, title: '100% Authentic', sub: 'Certified handloom weaves' },
              { icon: Shield, title: 'Secure Payment', sub: 'Encrypted & safe checkout' },
            ].map(({ icon: Icon, title, sub }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-center text-center"
              >
                <div className="w-12 h-12 border border-gold/40 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-gold" />
                </div>
                <p className="font-cormorant text-lg text-wine-dark mb-1">{title}</p>
                <p className="body-sm text-xs text-wine-dark/50">{sub}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 sm:py-28 bg-gradient-dark">
        <div className="max-w-lg mx-auto text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.65 }}
          >
            <p className="eyebrow mb-4">Join Our Circle</p>
            <h2 className="heading-md text-cream-light mb-5">
              Stories of <em>Silk & Heritage</em>
            </h2>
            <p className="text-cream-light/50 font-karla text-sm leading-relaxed mb-8">
              Get early access to new arrivals, weaver stories, and exclusive offers.
            </p>
            <form
              onSubmit={e => { e.preventDefault(); }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 input-field bg-cream-light/5 border-cream-light/20 text-cream-light placeholder:text-cream-light/30 focus:border-gold"
              />
              <button type="submit" className="btn-gold whitespace-nowrap">
                Subscribe
              </button>
            </form>
            <p className="text-cream-light/25 font-karla text-[11px] mt-4">No spam. Unsubscribe anytime.</p>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
