import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { MdTimer, MdVerified, MdAutoAwesome, MdWorkspacePremium, MdStar } from 'react-icons/md';

export default function WeaversLegacySection() {
  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-[#1C0A0C] via-[#150709] to-[#1C0A0C] text-cream-light relative overflow-hidden select-none border-t border-gold/30">
      {/* Decorative Gold Radial Glows */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -right-32 w-[400px] h-[400px] bg-wine/30 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-[1850px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gold/15 border border-gold/40 shadow-xs mb-4">
            <MdAutoAwesome className="w-4 h-4 text-gold" />
            <span className="eyebrow text-gold text-[10.5px] sm:text-xs tracking-[0.26em] uppercase font-semibold">
              INDIAN HERITAGE & ARTISANRY
            </span>
          </div>

          <h2 className="font-cormorant text-3xl sm:text-5xl lg:text-6xl text-cream-light font-light italic leading-tight mb-4">
            Craft & <em>Weaver's Legacy</em>
          </h2>

          <p className="font-karla text-sm sm:text-base text-cream-light/85 leading-relaxed max-w-2xl mx-auto font-light">
            Behind every Tantvani saree lies centuries of royal Indian weaving traditions, master pit looms, and 
            uncompromising dedication to pure authentic silk.
          </p>
        </motion.div>

        {/* --- 2 HIGH-IMPACT HERO HIGHLIGHT CARDS (300+ Hours & 100% Authentic) --- */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-10 sm:mb-12">
          {/* HIGHLIGHT CARD 1: 300+ HOURS */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-gradient-to-br from-[#2D0F13] via-[#220B0E] to-[#1A0709] border-2 border-gold/50 hover:border-gold p-6 sm:p-10 rounded-xl shadow-2xl transition-all duration-300 hover:shadow-gold/10 group overflow-hidden"
          >
            {/* Background Accent Glow & Watermark */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
            <span className="absolute -bottom-6 -right-6 font-cormorant text-9xl font-bold text-gold/[0.04] select-none pointer-events-none">
              300+
            </span>

            <div className="flex items-center justify-between mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20 text-gold border border-gold/40 text-[10.5px] font-jost font-bold uppercase tracking-widest">
                <MdTimer className="w-4 h-4 text-gold" /> Master Craftsmanship
              </span>
              <span className="text-gold/60 font-jost text-xs tracking-widest uppercase">01 / 02</span>
            </div>

            <div className="flex items-baseline gap-3 mb-2">
              <span className="font-cormorant text-5xl sm:text-7xl font-bold text-gold tracking-tight drop-shadow-md">
                300+
              </span>
              <span className="font-cormorant text-2xl sm:text-3xl text-cream-light font-light italic">
                Hours of Handloom Weaving
              </span>
            </div>

            <h3 className="font-cormorant text-2xl sm:text-3xl text-cream-light font-normal mb-3 group-hover:text-gold transition-colors">
              Pit Loom Precision & Artistry
            </h3>

            <p className="font-karla text-xs sm:text-sm text-cream-light/85 leading-relaxed font-light mb-6">
              Every warp and weft is line-woven by 3rd-generation master weavers over 300+ painstaking hours. 
              No modern machines can replicate the tactile soul and texture of authentic Indian handlooms.
            </p>

            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-jost text-gold/90">
              <span className="flex items-center gap-1.5">
                <MdStar className="w-4 h-4 text-gold" /> 70+ Master Artisan Families
              </span>
              <span className="text-cream-light/60">Traditional Pit Looms</span>
            </div>
          </motion.div>

          {/* HIGHLIGHT CARD 2: 100% AUTHENTIC */}
          <motion.div
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative bg-gradient-to-br from-[#2D0F13] via-[#220B0E] to-[#1A0709] border-2 border-gold/50 hover:border-gold p-6 sm:p-10 rounded-xl shadow-2xl transition-all duration-300 hover:shadow-gold/10 group overflow-hidden"
          >
            {/* Background Accent Glow & Watermark */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gold/5 rounded-full blur-2xl pointer-events-none" />
            <span className="absolute -bottom-6 -right-6 font-cormorant text-9xl font-bold text-gold/[0.04] select-none pointer-events-none">
              100%
            </span>

            <div className="flex items-center justify-between mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/20 text-gold border border-gold/40 text-[10.5px] font-jost font-bold uppercase tracking-widest">
                <MdVerified className="w-4 h-4 text-gold" /> Purity Guaranteed
              </span>
              <span className="text-gold/60 font-jost text-xs tracking-widest uppercase">02 / 02</span>
            </div>

            <div className="flex items-baseline gap-3 mb-2">
              <span className="font-cormorant text-5xl sm:text-7xl font-bold text-gold tracking-tight drop-shadow-md">
                100%
              </span>
              <span className="font-cormorant text-2xl sm:text-3xl text-cream-light font-light italic">
                Authentic Pure Silk
              </span>
            </div>

            <h3 className="font-cormorant text-2xl sm:text-3xl text-cream-light font-normal mb-3 group-hover:text-gold transition-colors">
              Silk Mark Certified & Real Zari Inlay
            </h3>

            <p className="font-karla text-xs sm:text-sm text-cream-light/85 leading-relaxed font-light mb-6">
              Woven strictly from Silk Mark certified Mulberry, Katan, and Tussar silk threads. Adorned with 
              24k electroplated gold & silver zari threadwork with zero synthetic blends.
            </p>

            <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-jost text-gold/90">
              <span className="flex items-center gap-1.5">
                <MdVerified className="w-4 h-4 text-gold" /> Govt. Silk Mark Certified
              </span>
              <span className="text-cream-light/60">Pure Gold & Silver Zari</span>
            </div>
          </motion.div>
        </div>

        {/* --- SUPPORTING CRAFT PILLARS & ARTISAN BANNER --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          {/* Left: 2 Secondary Pillar Cards */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#240C0E]/90 border border-gold/30 p-5 rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-gold/15 border border-gold/40 flex items-center justify-center mb-3 text-gold">
                <MdAutoAwesome className="w-5 h-5" />
              </div>
              <span className="font-jost text-[10px] text-gold font-bold uppercase tracking-widest">KADWA WEAVE</span>
              <h4 className="font-cormorant text-xl text-cream-light font-medium mt-1 mb-1.5">Real Zari Meenakari</h4>
              <p className="font-karla text-xs text-cream-light/75 font-light leading-relaxed">
                Hand-inlaid zari motifs that appear individually sculpted without loose floating threads behind.
              </p>
            </div>

            <div className="bg-[#240C0E]/90 border border-gold/30 p-5 rounded-lg">
              <div className="w-10 h-10 rounded-lg bg-gold/15 border border-gold/40 flex items-center justify-center mb-3 text-gold">
                <MdWorkspacePremium className="w-5 h-5" />
              </div>
              <span className="font-jost text-[10px] text-gold font-bold uppercase tracking-widest">ROYAL TROUSSEAU</span>
              <h4 className="font-cormorant text-xl text-cream-light font-medium mt-1 mb-1.5">Heirloom Quality</h4>
              <p className="font-karla text-xs text-cream-light/75 font-light leading-relaxed">
                Irreplaceable master creations designed to retain their luster and value over generations.
              </p>
            </div>
          </div>

          {/* Right: Master Weaver Photography Banner */}
          <div className="lg:col-span-6 relative rounded-xl overflow-hidden border border-gold/40 shadow-2xl group">
            <img
              src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1200&auto=format&fit=crop"
              alt="Artisan Master Weaver at Pit Loom"
              className="w-full h-[240px] sm:h-[280px] object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C0A0C] via-[#1C0A0C]/50 to-transparent flex flex-col justify-end p-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gold/20 border border-gold/60 backdrop-blur-md flex items-center justify-center text-gold shadow-lg">
                  <MdAutoAwesome className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-cormorant text-xl text-cream-light font-semibold leading-tight">
                    Authentic Handloom Heritage
                  </p>
                  <p className="font-jost text-xs text-gold uppercase tracking-widest mt-0.5">
                    Woven in India • Preserving Royalty
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Quote & Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 sm:mt-16 text-center border-t border-white/10 pt-10"
        >
          <p className="font-cormorant text-xl sm:text-2xl text-cream-light/90 italic mb-6">
            "A Tantvani saree is not just a garment — it is an irreplaceable piece of Indian heritage."
          </p>
          <Link
            to="/about"
            className="btn-gold inline-flex items-center gap-2 py-3.5 px-9 text-xs font-semibold tracking-[0.2em] uppercase shadow-xl"
          >
            Discover Weaver Stories <MdAutoAwesome className="w-4 h-4 ml-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
