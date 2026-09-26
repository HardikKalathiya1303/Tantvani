import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function HeritageBanner() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['12%', '-12%']);

  return (
    <section ref={ref} className="relative overflow-hidden py-0 h-[80vh] min-h-[520px] max-h-[800px] flex items-center bg-[#1C0A0C]">
      {/* Parallax background image */}
      <motion.div style={{ y }} className="absolute inset-0 -top-[15%] -bottom-[15%]">
        <img
          src="https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?q=80&w=1800&auto=format&fit=crop"
          alt="Luxury Heritage Handloom Saree"
          className="w-full h-full object-cover object-center"
        />
        {/* Dark luxury vignette overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1C0A0C]/90 via-[#2A0D10]/80 to-[#1C0A0C]/90" />
        <div className="absolute inset-0 bg-black/40" />
      </motion.div>

      {/* Decorative border */}
      <div className="absolute inset-6 border border-cream-light/15 pointer-events-none z-10" />
      <div className="absolute inset-10 border border-gold/20 pointer-events-none z-10" />

      {/* Decorative motif */}
      <div className="absolute inset-0 flex items-center justify-center opacity-10 z-10 pointer-events-none">
        <svg viewBox="0 0 400 400" width="550" className="text-cream-light">
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
          initial={{ opacity: 0, y: 35 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        >
          <p className="eyebrow text-gold mb-6 flex items-center justify-center gap-4 drop-shadow-md">
            <span className="w-16 h-px bg-gold/50" />
            Our Heritage
            <span className="w-16 h-px bg-gold/50" />
          </p>
          <h2 className="heading-xl text-cream-light mb-8 max-w-4xl mx-auto drop-shadow-lg" style={{ fontStyle: 'italic' }}>
            Three Centuries of<br />
            Weaving Excellence
          </h2>
          <p className="font-karla text-lg sm:text-xl text-cream-light/80 max-w-2xl mx-auto mb-10 leading-relaxed drop-shadow-sm">
            From the royal court weavers of Varanasi & Kanchipuram to your celebrations — Tantvani carries forward the unbroken legacy of India's finest handloom master craftsmen.
          </p>
          <Link to="/about">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-gold shadow-gold"
            >
              Discover Our Story
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
