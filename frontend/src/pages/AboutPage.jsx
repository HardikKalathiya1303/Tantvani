import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const values = [
  { title: 'Heritage', desc: 'We celebrate India\'s rich weaving traditions, tracing roots back to the Mughal courts and temple looms of antiquity.' },
  { title: 'Craftsmanship', desc: 'Every Tantvani saree takes weeks to months to create — a labour of love by master weavers who have inherited their art across generations.' },
  { title: 'Authenticity', desc: 'We deal only in GI-tagged, verified handloom textiles. No power looms, no compromises, ever.' },
  { title: 'Community', desc: '30% of every purchase goes back to artisan communities, funding education, healthcare and equipment.' },
];

export default function AboutPage() {
  const heroRef = useRef(null);
  const inView = useInView(heroRef, { once: true });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative h-[70vh] bg-gradient-hero flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%"><defs><pattern id="ap" width="60" height="60" patternUnits="userSpaceOnUse"><ellipse cx="30" cy="15" rx="12" ry="14" fill="none" stroke="white" strokeWidth="0.5" /><circle cx="30" cy="45" r="6" fill="none" stroke="white" strokeWidth="0.5" /></pattern></defs><rect width="100%" height="100%" fill="url(#ap)" /></svg>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-wine-dark/40" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="relative z-10 text-center px-4"
        >
          <p className="font-jost text-xs tracking-[0.4em] uppercase text-secondary mb-4">Our Story</p>
          <h1 className="font-cormorant text-6xl md:text-8xl font-light text-cream-light leading-tight">Woven with<br /><em>Purpose</em></h1>
        </motion.div>
      </section>

      {/* Story */}
      <section ref={heroRef} className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7 }}
            >
              <p className="eyebrow mb-4">Founded in 2024</p>
              <h2 className="heading-md mb-6">A Love Letter to<br />Indian Textiles</h2>
              <div className="space-y-5 font-karla text-base text-wine-dark/70 leading-relaxed">
                <p>Tantvani was born from a deep reverence for India's extraordinary textile heritage. The name itself is Sanskrit — "Tantu" meaning thread, "Vani" meaning voice — the voice of a thousand threads.</p>
                <p>We work directly with master weavers in Varanasi, Kanchipuram, Chanderi, and across India's textile heartlands. Every piece in our collection is the result of weeks of painstaking craftsmanship on handlooms that have been passed down through generations.</p>
                <p>Our mission is simple: to bring the world's most beautiful handwoven sarees to you, while ensuring the artists who create them receive their fair due.</p>
              </div>
            </motion.div>

            {/* Decorative element */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square bg-gradient-hero flex items-center justify-center p-16">
                <div className="text-center text-cream-light">
                  <svg viewBox="0 0 200 200" className="w-full max-w-64 mx-auto">
                    <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.4" />
                    <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                    <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
                    {[...Array(12)].map((_, i) => {
                      const a = (i / 12) * Math.PI * 2;
                      return <line key={i} x1="100" y1="100" x2={100 + 90 * Math.cos(a)} y2={100 + 90 * Math.sin(a)} stroke="currentColor" strokeWidth="0.3" opacity="0.3" />;
                    })}
                    <circle cx="100" cy="100" r="15" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.8" />
                    <text x="100" y="105" textAnchor="middle" className="font-cormorant" style={{ fontSize: '12px', fill: 'currentColor', opacity: 0.9 }}>Tantvani</text>
                  </svg>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-px bg-cream-darker/40 mt-px">
                {[['500+', 'Weavers'], ['50+', 'GI Sarees'], ['10K+', 'Happy Customers']].map(([num, label]) => (
                  <div key={label} className="bg-cream-light p-6 text-center">
                    <p className="font-cormorant text-3xl text-wine">{num}</p>
                    <p className="font-jost text-[10px] tracking-[0.2em] uppercase text-wine-dark/50 mt-1">{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gradient-subtle" id="story">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <p className="eyebrow mb-3">What We Stand For</p>
            <h2 className="heading-md">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center p-8 bg-cream-light border border-cream-darker/40"
              >
                <div className="w-12 h-12 bg-wine/10 rounded-none flex items-center justify-center mx-auto mb-4">
                  <span className="font-cormorant text-2xl text-wine">{i + 1}</span>
                </div>
                <h3 className="font-cormorant text-2xl text-foreground mb-3">{v.title}</h3>
                <p className="font-karla text-sm text-wine-dark/50 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Artisans */}
      <section className="py-24" id="artisans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="eyebrow mb-3">The Hands Behind the Magic</p>
          <h2 className="heading-md mb-6">Our Master Weavers</h2>
          <p className="font-karla text-base text-wine-dark/50 max-w-2xl mx-auto mb-16 leading-relaxed">
            From the narrow alleys of Varanasi to the silk farms of Kanchipuram — meet the artisans whose skill, patience and pride are woven into every Tantvani saree.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[['Ramesh Kushwaha', 'Varanasi, UP', 'Banarasi Brocade, 30 years'], ['Kamala Devi', 'Kanchipuram, TN', 'Kanjivaram Silk, 25 years'], ['Mohanlal Prajapati', 'Chanderi, MP', 'Chanderi Silk-Cotton, 35 years']].map(([name, loc, spec]) => (
              <motion.div key={name} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="group">
                <div className="aspect-[3/4] bg-gradient-to-br from-wine/30 to-accent/30 mb-5 flex items-end p-6">
                  <div>
                    <p className="font-cormorant text-2xl text-cream-light">{name}</p>
                    <p className="font-jost text-[10px] tracking-wider uppercase text-cream-light/60">{spec}</p>
                  </div>
                </div>
                <p className="font-karla text-sm text-wine-dark/50">{loc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
