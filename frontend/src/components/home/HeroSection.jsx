import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    eyebrow: 'New Arrival 2025',
    heading: 'The Art of\nHandwoven\nSilk',
    sub: 'Kanjivaram masterpieces crafted by generations of weavers in the heart of Tamil Nadu.',
    cta: { label: 'Explore Kanjivaram', href: '/collections?search=kanjivaram' },
    ctaSecond: { label: 'Our Heritage', href: '/about' },
    bg: 'from-[#2A0D10] via-[#6B2732] to-[#411B1E]',
    accent: '#C99B4E',
  },
  {
    id: 2,
    eyebrow: 'Bridal Collection',
    heading: 'Woven in\nGold &\nLegacy',
    sub: 'Banarasi brocades that carry the grandeur of Mughal artistry into every bridal trousseau.',
    cta: { label: 'Bridal Sarees', href: '/collections?occasion=wedding' },
    ctaSecond: { label: 'View All', href: '/collections' },
    bg: 'from-[#1C0A0C] via-[#411B1E] to-[#6B2732]',
    accent: '#D9B574',
  },
  {
    id: 3,
    eyebrow: 'Everyday Elegance',
    heading: 'Chanderi\nWhispers\nOf Cotton',
    sub: 'Light as breath, rich in character — Chanderi cottons for the woman who wears grace everyday.',
    cta: { label: 'Chanderi Collection', href: '/collections?search=chanderi' },
    ctaSecond: { label: 'New Arrivals', href: '/collections?newArrival=true' },
    bg: 'from-[#411B1E] via-[#5C2028] to-[#7A4A38]',
    accent: '#C99B4E',
  },
];

const INTERVAL = 6000;

const paisleySvg = `
<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" fill="none">
  <path d="M100 10 C130 10,160 40,160 80 C160 120,130 150,100 170 C70 150,40 120,40 80 C40 40,70 10,100 10 Z" stroke="currentColor" stroke-width="0.5" opacity="0.3"/>
  <path d="M100 30 C122 30,145 52,145 80 C145 108,122 130,100 145 C78 130,55 108,55 80 C55 52,78 30,100 30 Z" stroke="currentColor" stroke-width="0.4" opacity="0.2"/>
  <circle cx="100" cy="80" r="8" stroke="currentColor" stroke-width="0.5" opacity="0.3"/>
  <path d="M85 65 Q100 45,115 65" stroke="currentColor" stroke-width="0.5" opacity="0.25"/>
  <path d="M75 95 Q100 115,125 95" stroke="currentColor" stroke-width="0.5" opacity="0.25"/>
</svg>
`;

const variants = {
  enter: (dir) => ({ x: dir > 0 ? '4%' : '-4%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir < 0 ? '4%' : '-4%', opacity: 0 }),
};

export default function HeroSection() {
  const [[current, dir], setCurrent] = useState([0, 1]);
  const [paused, setPaused] = useState(false);

  const paginate = useCallback((newDir) => {
    setCurrent(([c]) => [(c + newDir + SLIDES.length) % SLIDES.length, newDir]);
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => paginate(1), INTERVAL);
    return () => clearInterval(t);
  }, [paginate, paused]);

  const slide = SLIDES[current];

  return (
    <section
      className="relative h-screen min-h-[600px] max-h-[1000px] overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Gradient background */}
      <AnimatePresence initial={false} custom={dir} mode="sync">
        <motion.div
          key={slide.id + '-bg'}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.85, ease: [0.4, 0, 0.2, 1] }}
          className={`absolute inset-0 bg-gradient-to-br ${slide.bg}`}
        />
      </AnimatePresence>

      {/* Paisley pattern overlay */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute text-cream-light"
            style={{
              width: `${60 + (i % 4) * 40}px`,
              top: `${(i * 13 + 5) % 95}%`,
              left: `${(i * 17 + 3) % 95}%`,
              transform: `rotate(${i * 31}deg)`,
              dangerouslySetInnerHTML: undefined,
            }}
            dangerouslySetInnerHTML={{ __html: paisleySvg }}
          />
        ))}
      </div>

      {/* Diagonal gold accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `linear-gradient(125deg, transparent 60%, ${slide.accent}18 100%)`,
          transition: 'background 0.8s ease',
        }}
      />

      {/* Content */}
      <div className="relative h-full flex items-center z-10">
        <div className="w-full max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-20 pt-28 sm:pt-24">
          <AnimatePresence initial={false} custom={dir} mode="wait">
            <motion.div
              key={slide.id}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
              className="max-w-2xl"
            >
              <motion.p
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.15 }}
                className="eyebrow mb-5 sm:mb-7"
                style={{ color: slide.accent }}
              >
                {slide.eyebrow}
              </motion.p>

              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.22 }}
                className="heading-xl text-cream-light mb-5 sm:mb-8 whitespace-pre-line"
                style={{ fontStyle: 'italic' }}
              >
                {slide.heading}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="text-cream-light/65 font-karla text-base sm:text-lg max-w-md leading-relaxed mb-8 sm:mb-12"
              >
                {slide.sub}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.45 }}
                className="flex flex-wrap gap-4"
              >
                <Link to={slide.cta.href} className="btn-gold">
                  {slide.cta.label}
                </Link>
                <Link
                  to={slide.ctaSecond.href}
                  className="btn-ghost text-cream-light border-cream-light/40 hover:border-cream-light"
                >
                  {slide.ctaSecond.label}
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-10 sm:bottom-14 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent([i, i > current ? 1 : -1])}
            className="h-[3px] transition-all duration-400 rounded-full"
            style={{
              width: i === current ? '28px' : '10px',
              background: i === current ? slide.accent : 'rgba(253,250,245,0.3)',
            }}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Prev / Next arrows */}
      <button
        onClick={() => paginate(-1)}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 border border-cream-light/20 hover:border-cream-light/50 text-cream-light/60 hover:text-cream-light flex items-center justify-center transition-all duration-200 hover:bg-cream-light/5"
        aria-label="Previous"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>
      <button
        onClick={() => paginate(1)}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 border border-cream-light/20 hover:border-cream-light/50 text-cream-light/60 hover:text-cream-light flex items-center justify-center transition-all duration-200 hover:bg-cream-light/5"
        aria-label="Next"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </button>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none z-10" />
    </section>
  );
}
