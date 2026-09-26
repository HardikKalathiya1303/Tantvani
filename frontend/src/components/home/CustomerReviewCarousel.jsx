import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: 'Priya Malhotra',
    location: 'Delhi',
    rating: 5,
    saree: 'Royal Kanjivaram Silk',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=800&auto=format&fit=crop',
    quote: 'The Kanjivaram saree was the absolute highlight of my wedding reception. The golden zari weave is pure royalty!',
  },
  {
    id: 2,
    name: 'Dr. Ananya Roy',
    location: 'Kolkata',
    rating: 5,
    saree: 'Kadwa Banarasi Silk',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
    quote: 'Impeccable craftsmanship! Wore it to a grand gala and received non-stop compliments all evening.',
  },
  {
    id: 3,
    name: 'Meera Iyer',
    location: 'Bengaluru',
    rating: 5,
    saree: 'Handcrafted Chanderi',
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=800&auto=format&fit=crop',
    quote: 'Lightweight yet looks so royal. Tantvani is now my first choice for authentic handloom sarees.',
  },
  {
    id: 4,
    name: 'Sneha Reddy',
    location: 'Hyderabad',
    rating: 5,
    saree: 'Tissue Organza Silk',
    image: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?q=80&w=800&auto=format&fit=crop',
    quote: 'The sheer drape and golden shine are out of this world. Fast delivery and royal luxury box packaging!',
  },
  {
    id: 5,
    name: 'Rhea Sen',
    location: 'Mumbai',
    rating: 5,
    saree: 'Handwoven Linen Silk',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=800&auto=format&fit=crop',
    quote: 'Breathtaking elegance! You can feel the authenticity of pure handloom silk in every thread.',
  },
];

export default function CustomerReviewCarousel() {
  const [active, setActive] = useState(2); // Center on 3rd item
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth < 640 : false);

  const prev = () => setActive((curr) => (curr === 0 ? REVIEWS.length - 1 : curr - 1));
  const next = () => setActive((curr) => (curr === REVIEWS.length - 1 ? 0 : curr + 1));

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener('resize', handleResize);
    const t = setInterval(next, 5000);
    return () => {
      window.removeEventListener('resize', handleResize);
      clearInterval(t);
    };
  }, []);

  return (
    <section className="py-12 sm:py-24 bg-gradient-to-b from-[#F8F5EE] via-[#FAFAFA] to-[#FFFFFF] relative overflow-hidden text-wine-dark">
      <div className="w-full max-w-[1850px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-14"
        >
          <p className="eyebrow mb-2 sm:mb-3 text-gold">CUSTOMER STORIES</p>
          <h2 className="heading-lg text-wine-dark mb-3">
            Real Drapes & <em>Loved Reviews</em>
          </h2>
          <p className="body-sm text-wine-dark/75 max-w-lg mx-auto">
            See how our patrons carry Tantvani heritage into their most cherished celebrations.
          </p>
        </motion.div>

        {/* 3D Coverflow Carousel Container */}
        <div className="relative flex items-center justify-center min-h-[420px] sm:min-h-[540px] px-1 sm:px-10">
          {/* Navigation Prev Button */}
          <button
            onClick={prev}
            className="absolute left-1 sm:left-6 lg:left-16 z-40 w-9 h-9 sm:w-13 sm:h-13 rounded-full bg-white hover:bg-wine text-wine-dark hover:text-cream-light border border-gold/40 flex items-center justify-center transition-all duration-300 shadow-md"
            aria-label="Previous customer story"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Cards Stack */}
          <div className="relative w-full max-w-5xl h-[390px] sm:h-[500px] flex items-center justify-center overflow-visible">
            {REVIEWS.map((item, idx) => {
              // Calculate offset from active index
              let offset = idx - active;
              // Wrap offset for circular navigation
              if (offset < -2) offset += REVIEWS.length;
              if (offset > 2) offset -= REVIEWS.length;

              const isCenter = offset === 0;
              const isVisible = Math.abs(offset) <= 2;

              if (!isVisible) return null;

              // 3D Coverflow Transform Styles
              const xPos = offset * (isMobile ? 120 : 220); // horizontal separation for mobile
              const scale = isCenter ? 1 : Math.abs(offset) === 1 ? 0.82 : 0.68;
              const zIndex = 30 - Math.abs(offset) * 10;
              const opacity = isCenter ? 1 : Math.abs(offset) === 1 ? (isMobile ? 0.4 : 0.75) : 0.15;
              const rotateY = offset * -12;

              return (
                <motion.div
                  key={item.id}
                  onClick={() => setActive(idx)}
                  initial={false}
                  animate={{
                    x: xPos,
                    scale: scale,
                    opacity: opacity,
                    rotateY: rotateY,
                    zIndex: zIndex,
                  }}
                  transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                  style={{ perspective: 1000 }}
                  className={`absolute w-[240px] sm:w-[320px] h-[360px] sm:h-[460px] rounded-lg overflow-hidden shadow-2xl cursor-pointer border ${
                    isCenter
                      ? 'border-gold ring-2 ring-gold/40 shadow-xl'
                      : 'border-cream-darker/40'
                  } bg-[#1C0A0C]`}
                >
                  {/* Customer Saree Portrait Image */}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-center"
                  />

                  {/* Dark Gradient Vignette Overlay for Text Legibility */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C0A0C] via-[#1C0A0C]/50 to-transparent" />

                  {/* Rating Stars at Top */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                    <span className="bg-wine-darker/80 backdrop-blur-md text-gold text-[10px] font-jost font-semibold uppercase tracking-[0.16em] px-3 py-1 rounded-xs border border-gold/30">
                      Verified Buyer
                    </span>
                    <div className="flex items-center gap-0.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-gold/30">
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-gold text-gold" />
                      ))}
                    </div>
                  </div>

                  {/* Bottom Customer Details & Quote */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6 z-10">
                    <Quote className="w-6 h-6 text-gold/60 mb-2" />
                    <p className="font-karla text-xs sm:text-sm text-cream-light/90 leading-relaxed italic mb-4 line-clamp-3">
                      "{item.quote}"
                    </p>

                    <div className="border-t border-cream-light/15 pt-3">
                      <p className="font-cormorant text-lg font-medium text-cream-light leading-none">
                        {item.name}
                      </p>
                      <p className="font-jost text-[10.5px] text-gold uppercase tracking-[0.18em] mt-1">
                        {item.location} • <span className="text-cream-light/60">{item.saree}</span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Navigation Next Button */}
          <button
            onClick={next}
            className="absolute right-2 sm:right-8 lg:right-16 z-40 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-white hover:bg-wine text-wine-dark hover:text-cream-light border border-gold/40 flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-md"
            aria-label="Next customer story"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>
    </section>
  );
}
