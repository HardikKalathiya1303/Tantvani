import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

export default function ShopByOccasion() {
  return (
    <section className="py-16 sm:py-24 bg-cream-light border-t border-cream-darker/20">
      <div className="w-full max-w-[1850px] mx-auto px-3 sm:px-6 lg:px-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10 sm:mb-14"
        >
          <p className="eyebrow mb-2 sm:mb-3 text-gold">CELEBRATE IN ELEGANCE</p>
          <h2 className="heading-lg text-wine-dark mb-3">
            Shop by <em>Occasion</em>
          </h2>
          <p className="body-sm text-wine-dark/70 max-w-lg mx-auto">
            Discover curated ensembles handwoven for your most cherished royal celebrations.
          </p>
        </motion.div>

        {/* Occasion Editorial Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-[40%_1fr] gap-2.5 sm:gap-3 lg:gap-4">
          {/* Left Column: Big Tall Bridal Feature Card (40% width on laptop) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="relative group overflow-hidden rounded-xs shadow-sm border border-cream-darker/20 bg-wine-darker/10 h-[560px] sm:h-[680px] lg:h-full lg:min-h-[960px] flex flex-col justify-between"
          >
            <Link to="/collections?occasion=wedding" className="block w-full h-full relative">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1200&auto=format&fit=crop"
                alt="The Bridal Trousseau"
                className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C0A0C]/90 via-[#2A0D10]/35 to-transparent group-hover:via-[#2A0D10]/45 transition-colors duration-500" />

              <div className="absolute top-4 left-4 sm:top-6 sm:left-6 right-4 sm:right-6 flex items-center justify-between z-10">
                <span className="font-jost text-[10px] sm:text-[11px] font-semibold tracking-[0.24em] uppercase text-gold bg-wine-darker/60 backdrop-blur-xs px-2.5 sm:px-3 py-1 border border-gold/30 rounded-xs">
                  ROYAL WEDDING
                </span>
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-cream-light/20 backdrop-blur-xs text-cream-light flex items-center justify-center border border-cream-light/30 group-hover:bg-gold group-hover:text-wine-dark group-hover:border-gold transition-all duration-300">
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>

              <div className="absolute bottom-5 left-5 right-5 sm:bottom-6 sm:left-6 sm:right-6 z-10">
                <h3 className="font-cormorant text-2xl sm:text-3xl lg:text-3xl xl:text-4xl text-cream-light font-light mb-1 sm:mb-2 group-hover:text-gold transition-colors duration-300">
                  The Bridal Trousseau
                </h3>
                <p className="font-karla text-xs sm:text-sm text-cream-light/85 max-w-md leading-relaxed line-clamp-2 sm:line-clamp-none">
                  Heavy Banarasi Brocades & Grand Kanjivaram Masterpieces crafted for royal trousseaus.
                </p>
                <div className="mt-2.5 sm:mt-4 inline-flex items-center gap-2 font-jost text-[10.5px] sm:text-[11px] tracking-[0.22em] uppercase text-gold font-semibold group-hover:underline">
                  Explore Bridal Collection →
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Right Column: Top 2 Cards + Bottom Wide Banner (60% width on laptop) */}
          <div className="flex flex-col gap-2.5 sm:gap-3 lg:gap-4 justify-between">
            {/* Top Row: 2 Cards Side-by-Side */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 lg:gap-4">
              {/* Card 2: Festive Poojas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative group overflow-hidden rounded-xs shadow-sm border border-cream-darker/20 bg-wine-darker/10 h-[420px] sm:h-[480px] lg:h-[472px]"
              >
                <Link to="/collections?search=festive" className="block w-full h-full relative">
                  <img
                    src="https://images.unsplash.com/photo-1508427953056-b00b8d78ebf5?q=80&w=800&auto=format&fit=crop"
                    alt="Festive Poojas & Galas"
                    className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C0A0C]/90 via-[#2A0D10]/35 to-transparent group-hover:via-[#2A0D10]/45 transition-colors duration-500" />

                  <div className="absolute top-4 left-4 right-4 sm:top-5 sm:left-5 sm:right-5 flex items-center justify-between z-10">
                    <span className="font-jost text-[9.5px] xl:text-[10px] font-semibold tracking-[0.2em] xl:tracking-[0.24em] uppercase text-gold bg-wine-darker/60 backdrop-blur-xs px-2.5 py-1 border border-gold/30 rounded-xs">
                      FESTIVE CELEBRATIONS
                    </span>
                    <div className="w-7.5 h-7.5 xl:w-8 xl:h-8 rounded-full bg-cream-light/20 backdrop-blur-xs text-cream-light flex items-center justify-center border border-cream-light/30 group-hover:bg-gold group-hover:text-wine-dark transition-all duration-300">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 z-10">
                    <h3 className="font-cormorant text-xl xl:text-2xl text-cream-light font-light mb-1 group-hover:text-gold transition-colors duration-300">
                      Festive Poojas & Galas
                    </h3>
                    <p className="font-karla text-xs xl:text-sm text-cream-light/85 line-clamp-2">
                      Vibrant Chanderi & Auspicious Silk Weaves
                    </p>
                    <div className="mt-2.5 inline-flex items-center gap-1.5 font-jost text-[10px] xl:text-[11px] tracking-[0.2em] uppercase text-gold font-semibold group-hover:underline">
                      Explore Collection →
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Card 3: Royal Receptions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative group overflow-hidden rounded-xs shadow-sm border border-cream-darker/20 bg-wine-darker/10 h-[420px] sm:h-[480px] lg:h-[472px]"
              >
                <Link to="/collections?search=reception" className="block w-full h-full relative">
                  <img
                    src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=800&auto=format&fit=crop"
                    alt="Royal Receptions"
                    className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-108"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1C0A0C]/90 via-[#2A0D10]/35 to-transparent group-hover:via-[#2A0D10]/45 transition-colors duration-500" />

                  <div className="absolute top-4 left-4 right-4 sm:top-5 sm:left-5 sm:right-5 flex items-center justify-between z-10">
                    <span className="font-jost text-[9.5px] xl:text-[10px] font-semibold tracking-[0.2em] xl:tracking-[0.24em] uppercase text-gold bg-wine-darker/60 backdrop-blur-xs px-2.5 py-1 border border-gold/30 rounded-xs">
                      COCKTAIL & EVENINGS
                    </span>
                    <div className="w-7.5 h-7.5 xl:w-8 xl:h-8 rounded-full bg-cream-light/20 backdrop-blur-xs text-cream-light flex items-center justify-center border border-cream-light/30 group-hover:bg-gold group-hover:text-wine-dark transition-all duration-300">
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 z-10">
                    <h3 className="font-cormorant text-xl xl:text-2xl text-cream-light font-light mb-1 group-hover:text-gold transition-colors duration-300">
                      Royal Receptions
                    </h3>
                    <p className="font-karla text-xs xl:text-sm text-cream-light/85 line-clamp-2">
                      Lustrous Tissue & Shimmering Organza Drapes
                    </p>
                    <div className="mt-2.5 inline-flex items-center gap-1.5 font-jost text-[10px] xl:text-[11px] tracking-[0.2em] uppercase text-gold font-semibold group-hover:underline">
                      Explore Collection →
                    </div>
                  </div>
                </Link>
              </motion.div>
            </div>

            {/* Bottom Row: 1 Wide Banner Card Spanning Entire Right Width */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative group overflow-hidden rounded-xs shadow-sm border border-cream-darker/20 bg-wine-darker/10 h-[380px] sm:h-[440px] lg:h-[472px]"
            >
              <Link to="/collections?search=linen" className="block w-full h-full relative">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1200&auto=format&fit=crop"
                  alt="Everyday Handloom & Linens"
                  className="w-full h-full object-cover object-center transition-transform duration-1000 ease-out group-hover:scale-108"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#1C0A0C]/90 via-[#2A0D10]/50 to-transparent group-hover:via-[#2A0D10]/60 transition-colors duration-500" />

                <div className="absolute top-4 left-4 sm:top-5 sm:left-5 z-10">
                  <span className="font-jost text-[10px] sm:text-[10.5px] font-semibold tracking-[0.24em] uppercase text-gold bg-wine-darker/60 backdrop-blur-xs px-3 py-1 border border-gold/30 rounded-xs">
                    GRACEFUL EVERYDAY
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 sm:bottom-5 sm:left-5 sm:right-5 z-10 max-w-lg">
                  <h3 className="font-cormorant text-2xl sm:text-2xl lg:text-2xl xl:text-3xl text-cream-light font-light mb-1 group-hover:text-gold transition-colors duration-300">
                    Everyday Handloom & Linens
                  </h3>
                  <p className="font-karla text-xs sm:text-sm text-cream-light/85 line-clamp-2">
                    Breathable Pure Cottons & Lightweight Handwoven Linen Sarees for Daily Elegance.
                  </p>
                  <div className="mt-2.5 inline-flex items-center gap-2 font-jost text-[10.5px] sm:text-[11px] tracking-[0.22em] uppercase text-gold font-semibold group-hover:underline">
                    Explore Everyday Linen →
                  </div>
                </div>

                <div className="absolute top-4 right-4 sm:top-5 sm:right-5 z-10 hidden sm:block">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-cream-light/20 backdrop-blur-xs text-cream-light flex items-center justify-center border border-cream-light/30 group-hover:bg-gold group-hover:text-wine-dark group-hover:border-gold transition-all duration-300">
                    <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
