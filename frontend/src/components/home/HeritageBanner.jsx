import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function HeritageBanner() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['10%', '-10%']);

  return (
    <section ref={ref} className="relative overflow-hidden py-0 h-[80vh] min-h-[500px] flex items-center">
      {/* Parallax background */}
      <motion.div style={{ y }} className="absolute inset-0 bg-gradient-hero" />

      {/* Decorative border */}
      <div className="absolute inset-4 border border-cream-light/10 pointer-events-none z-10" />
      <div className="absolute inset-8 border border-cream-light/5 pointer-events-none z-10" />

      {/* Decorative motif */}
      <div className="absolute inset-0 flex items-center justify-center opacity-5 z-10 pointer-events-none">
        <svg viewBox="0 0 400 400" width="500" className="text-cream-light">
          <circle cx="200" cy="200" r="180" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="200" cy="200" r="100" fill="none" stroke="currentColor" strokeWidth="0.5" />
          {[...Array(16)].map((_, i) => {
            const angle = (i / 16) * Math.PI * 2;
            return <line key={i} x1="200" y1="200" x2={200 + 180 * Math.cos(angle)} y2={200 + 180 * Math.sin(angle)} stroke="currentColor" strokeWidth="0.3" />;
          })}
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          <p className="font-jost text-xs tracking-[0.35em] uppercase text-secondary mb-6 flex items-center justify-center gap-4">
            <span className="w-16 h-px bg-secondary/40" />
            Our Heritage
            <span className="w-16 h-px bg-secondary/40" />
          </p>
          <h2 className="font-cormorant text-5xl sm:text-6xl lg:text-8xl font-light text-cream-light leading-tight mb-8 max-w-4xl mx-auto">
            Three Centuries of<br />
            <em className="italic">Weaving Excellence</em>
          </h2>
          <p className="font-karla text-base text-cream-light/50 max-w-xl mx-auto mb-10 leading-relaxed">
            From the royal courts of Varanasi to your celebration — Tantvani carries forward the unbroken legacy of India's master weavers.
          </p>
          <Link to="/about">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="border border-cream-light/40 text-cream-light px-10 py-4 font-jost text-xs tracking-[0.25em] uppercase hover:bg-cream-light/10 transition-colors duration-300"
            >
              Discover Our Story
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
