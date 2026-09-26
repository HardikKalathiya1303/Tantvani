import { useState, useEffect, useCallback, memo } from 'react';
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
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1600&auto=format&fit=crop',
    accent: '#C99B4E',
  },
  {
    id: 2,
    eyebrow: 'Bridal Collection',
    heading: 'Woven in\nGold &\nLegacy',
    sub: 'Banarasi brocades that carry the grandeur of Mughal artistry into every bridal trousseau.',
    cta: { label: 'Bridal Sarees', href: '/collections?occasion=wedding' },
    ctaSecond: { label: 'View All', href: '/collections' },
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?q=80&w=1600&auto=format&fit=crop',
    accent: '#D9B574',
  },
  {
    id: 3,
    eyebrow: 'Everyday Elegance',
    heading: 'Chanderi\nWhispers\nOf Cotton',
    sub: 'Light as breath, rich in character — Chanderi cottons for the woman who wears grace everyday.',
    cta: { label: 'Chanderi Collection', href: '/collections?search=chanderi' },
    ctaSecond: { label: 'New Arrivals', href: '/collections?newArrival=true' },
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?q=80&w=1600&auto=format&fit=crop',
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

const PaisleyOverlay = memo(function PaisleyOverlay() {
  return (
    <div className="absolute inset-0 opacity-[0.06] pointer-events-none overflow-hidden z-10">
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute text-cream-light"
          style={{
            width: `${60 + (i % 4) * 40}px`,
            top: `${(i * 13 + 5) % 95}%`,
            left: `${(i * 17 + 3) % 95}%`,
            transform: `rotate(${i * 31}deg)`,
          }}
          dangerouslySetInnerHTML={{ __html: paisleySvg }}
        />
      ))}
    </div>
  );
});

const variants = {
  enter: (dir) => ({ opacity: 0, scale: 1.05 }),
  center: { opacity: 1, scale: 1 },
  exit: (dir) => ({ opacity: 0, scale: 0.98 }),
};

export default function HeroSection() {
  const [[current, dir], setCurrent] = useState([0, 1]);
  const [paused, setPaused] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 40;

  const paginate = useCallback((newDir) => {
    setCurrent(([c]) => [(c + newDir + SLIDES.length) % SLIDES.length, newDir]);
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => paginate(1), INTERVAL);
    return () => clearInterval(t);
  }, [paginate, paused]);

  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > minSwipeDistance) {
      paginate(1); // Swipe left → Next slide
    } else if (distance < -minSwipeDistance) {
      paginate(-1); // Swipe right → Prev slide
    }
  };

  const slide = SLIDES[current];

  return (
    <section
      className="relative h-screen min-h-[640px] max-h-[960px] overflow-hidden bg-[#1C0A0C] select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Luxury Saree Background Image Slider */}
      <AnimatePresence initial={false} custom={dir} mode="sync">
        <motion.div
          key={slide.id + '-bg'}
          custom={dir}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 1.1, ease: [0.4, 0, 0.2, 1] }}
          className="absolute inset-0"
        >
          <img
            src={slide.image}
            alt={slide.heading.replace(/\n/g, ' ')}
            className="w-full h-full object-cover object-center"
          />
        </motion.div>
      </AnimatePresence>

      {/* Permanent Fixed Vignette Overlay - Never flashes or resets during slide transitions */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1C0A0C] via-[#1C0A0C]/75 via-45% to-transparent pointer-events-none z-10" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#1C0A0C]/80 via-transparent to-transparent hidden lg:block pointer-events-none z-10" />

      <PaisleyOverlay />

      {/* --- MOBILE / TABLET LAYOUT (< 1024px / lg) --- */}
      <div className="lg:hidden relative h-full flex flex-col justify-end z-20 pb-20 sm:pb-24 px-5 sm:px-10 max-w-xl mx-auto w-full">
        <AnimatePresence initial={false} custom={dir} mode="wait">
          <motion.div
            key={slide.id + '-mobile'}
            custom={dir}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
            className="w-full flex flex-col items-center text-center space-y-3 sm:space-y-4"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#1C0A0C]/80 border border-gold/40 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <p className="eyebrow text-gold text-[10px] sm:text-xs tracking-[0.24em] font-medium uppercase">
                {slide.eyebrow}
              </p>
            </div>

            <h1 className="font-cormorant text-3xl sm:text-5xl text-cream-light font-light leading-[1.15] italic drop-shadow-md">
              {slide.heading.replace(/\n/g, ' ')}
            </h1>

            <p className="text-cream-light/90 font-karla text-xs sm:text-sm leading-relaxed max-w-md drop-shadow-xs line-clamp-2">
              {slide.sub}
            </p>

            {/* 2 Equal-Width Side-by-Side Action Buttons */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full max-w-md pt-1">
              <Link
                to={slide.cta.href}
                className="bg-gold text-wine-dark hover:bg-gold-light text-center py-3 px-2 rounded-xs font-jost text-[11px] sm:text-xs font-semibold tracking-[0.16em] uppercase transition-all shadow-lg active:scale-98"
              >
                {slide.cta.label}
              </Link>
              <Link
                to={slide.ctaSecond.href}
                className="bg-[#1C0A0C]/80 text-gold border border-gold/60 hover:bg-gold/20 text-center py-3 px-2 rounded-xs font-jost text-[11px] sm:text-xs font-semibold tracking-[0.16em] uppercase transition-all active:scale-98 shadow-sm"
              >
                {slide.ctaSecond.label}
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Dedicated Slide Navigation Floating Controls (positioned safely above bottom fade) */}
        <div className="flex items-center justify-between w-full max-w-md mx-auto mt-6 pt-3 border-t border-white/15 text-cream-light">
          {/* Left: Indicator Dots */}
          <div className="flex items-center gap-2">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent([i, i > current ? 1 : -1])}
                className={`h-[3px] rounded-full transition-all duration-300 ${i === current ? 'w-7 bg-gold' : 'w-2 bg-white/40'}`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          {/* Right: Counter & Arrow Controls */}
          <div className="flex items-center gap-3 font-jost text-xs text-cream-light/90 font-medium">
            <button
              onClick={() => paginate(-1)}
              className="w-8 h-8 rounded-full bg-[#1C0A0C]/80 border border-white/20 hover:border-gold hover:text-gold flex items-center justify-center transition-colors active:scale-95"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="tracking-widest text-[11px]">0{current + 1} / 0{SLIDES.length}</span>
            <button
              onClick={() => paginate(1)}
              className="w-8 h-8 rounded-full bg-[#1C0A0C]/80 border border-white/20 hover:border-gold hover:text-gold flex items-center justify-center transition-colors active:scale-95"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* --- DESKTOP & LAPTOP LAYOUT (>= 1024px / lg) --- */}
      <div className="hidden lg:flex relative h-full items-center z-20">
        <div className="w-full max-w-screen-xl mx-auto px-8 lg:px-16 pt-20">
          <AnimatePresence initial={false} custom={dir} mode="wait">
            <motion.div
              key={slide.id + '-desktop'}
              custom={dir}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.75, ease: [0.4, 0, 0.2, 1] }}
              className="max-w-2xl text-left"
            >
              <p className="eyebrow mb-4 text-gold drop-shadow-md text-xs tracking-[0.28em]">
                {slide.eyebrow}
              </p>
              <h1 className="font-cormorant text-5xl lg:text-6xl xl:text-7xl text-cream-light mb-6 whitespace-pre-line drop-shadow-lg font-light leading-[1.08] italic">
                {slide.heading}
              </h1>
              <p className="text-cream-light/85 font-karla text-base lg:text-lg max-w-lg leading-relaxed mb-8 drop-shadow-sm">
                {slide.sub}
              </p>
              <div className="flex items-center gap-4">
                <Link to={slide.cta.href} className="btn-gold shadow-gold text-center py-3.5 px-9 text-xs font-semibold tracking-[0.2em]">
                  {slide.cta.label}
                </Link>
                <Link to={slide.ctaSecond.href} className="btn-outline text-cream-light border-cream-light/60 hover:border-cream-light hover:bg-white/10 text-center py-3.5 px-8 text-xs font-semibold tracking-[0.2em]">
                  {slide.ctaSecond.label}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Desktop Slide Control Arrows */}
        <button
          onClick={() => paginate(-1)}
          className="absolute left-6 lg:left-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 lg:w-13 lg:h-13 border border-cream-light/30 hover:border-cream-light text-cream-light/70 hover:text-cream-light flex items-center justify-center transition-all duration-200 bg-[#1C0A0C]/70 hover:bg-[#1C0A0C]"
          aria-label="Previous"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button
          onClick={() => paginate(1)}
          className="absolute right-6 lg:right-8 top-1/2 -translate-y-1/2 z-30 w-11 h-11 lg:w-13 lg:h-13 border border-cream-light/30 hover:border-cream-light text-cream-light/70 hover:text-cream-light flex items-center justify-center transition-all duration-200 bg-[#1C0A0C]/70 hover:bg-[#1C0A0C]"
          aria-label="Next"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Desktop Slide Indicator Dots */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-30">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent([i, i > current ? 1 : -1])}
              className="h-[4px] transition-all duration-400 rounded-full"
              style={{
                width: i === current ? '32px' : '12px',
                background: i === current ? slide.accent : 'rgba(253,250,245,0.4)',
              }}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Bottom Smooth Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#FDFAF5] to-transparent pointer-events-none z-20" />
    </section>
  );
}
