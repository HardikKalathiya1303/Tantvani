import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import api from '../../utils/api';

const FALLBACK = [
  { name: 'Silk Sarees', slug: 'silk' },
  { name: 'Banarasi', slug: 'banarasi' },
  { name: 'Kanjivaram', slug: 'kanjivaram' },
  { name: 'Chanderi', slug: 'chanderi' },
  { name: 'Cotton', slug: 'cotton' },
  { name: 'Linen', slug: 'linen' },
];

const PLACEHOLDER_COLORS = [
  ['#6B2732', '#411B1E'],
  ['#5C2028', '#7A4A38'],
  ['#411B1E', '#6B2732'],
  ['#7A4A38', '#5C2028'],
  ['#2A0D10', '#6B2732'],
  ['#6B3040', '#411B1E'],
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

export default function FeaturedCategories() {
  const { data } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const cats = data?.categories?.filter(c => c.isActive) || [];
  const items = cats.length > 0 ? cats.slice(0, 6) : FALLBACK;

  return (
    <section className="py-20 sm:py-28 bg-cream">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 sm:mb-20"
        >
          <p className="eyebrow mb-4">Our Collections</p>
          <h2 className="heading-lg text-wine-dark mb-5">
            Explore by <em>Tradition</em>
          </h2>
          <div className="divider-ornate max-w-xs mx-auto">
            <span className="eyebrow text-gold px-4">✦</span>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5"
        >
          {items.map((cat, i) => {
            const href = cat._id
              ? `/collections?category=${cat._id}`
              : `/collections?search=${cat.slug}`;
            const [bg1, bg2] = PLACEHOLDER_COLORS[i % PLACEHOLDER_COLORS.length];
            return (
              <motion.div key={cat._id || cat.slug} variants={itemVariants}>
                <Link to={href} className="group block">
                  <div className="relative overflow-hidden aspect-[3/4] mb-4">
                    {cat.image ? (
                      <img
                        src={cat.image}
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex flex-col items-center justify-center"
                        style={{ background: `linear-gradient(145deg, ${bg1}, ${bg2})` }}
                      >
                        {/* Paisley SVG */}
                        <svg className="w-10 h-10 sm:w-14 sm:h-14 text-cream-light/20" viewBox="0 0 100 100" fill="none">
                          <path d="M50 5 C72 5,88 25,88 50 C88 75,72 95,50 95 C28 95,12 75,12 50 C12 25,28 5,50 5 Z" stroke="currentColor" strokeWidth="1" />
                          <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="0.8" />
                          <path d="M35 38 Q50 25,65 38" stroke="currentColor" strokeWidth="0.8" />
                          <path d="M32 62 Q50 75,68 62" stroke="currentColor" strokeWidth="0.8" />
                        </svg>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-wine-darker/0 group-hover:bg-wine-darker/20 transition-colors duration-400" />
                    <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="block w-full text-center btn-primary text-[10px] py-2 px-3">
                        Explore
                      </span>
                    </div>
                  </div>
                  <p className="font-cormorant text-lg sm:text-xl font-medium text-wine-dark text-center tracking-wide group-hover:text-wine transition-colors">
                    {cat.name}
                  </p>
                  {cat.description && (
                    <p className="body-sm text-center mt-1 text-xs text-wine-dark/50 line-clamp-2 hidden sm:block">
                      {cat.description}
                    </p>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="text-center mt-12 sm:mt-16">
          <Link to="/collections" className="btn-outline">
            View All Collections
          </Link>
        </div>
      </div>
    </section>
  );
}
