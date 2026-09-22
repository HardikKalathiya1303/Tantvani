import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const features = [
  { icon: '🧵', title: 'Authentic Handloom', desc: 'Every piece woven by master artisans using centuries-old techniques on handlooms.' },
  { icon: '🌿', title: 'Natural Fibers', desc: 'Pure silk, cotton and natural dyes. No synthetic blends, ever.' },
  { icon: '🏛️', title: 'GI Tagged Origins', desc: 'Geographically certified sarees directly sourced from their authentic regions.' },
  { icon: '📦', title: 'Heritage Packaging', desc: 'Sustainably gift-wrapped in hand-block printed fabric pouches.' },
  { icon: '↩️', title: '15-Day Returns', desc: 'Shop with confidence. Easy returns and exchanges, no questions asked.' },
  { icon: '🤝', title: 'Artisan Support', desc: '30% of profits go directly to the weaver communities who create our sarees.' },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function WhyChooseUs() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} className="py-24 bg-wine-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="font-jost text-xs tracking-[0.3em] uppercase text-secondary mb-4">Our Promise</p>
          <h2 className="font-cormorant text-4xl md:text-5xl font-light text-cream-light">The Tantvani Commitment</h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-2 md:grid-cols-3 gap-8 lg:gap-12"
        >
          {features.map((f) => (
            <motion.div key={f.title} variants={itemVariants} className="text-center group">
              <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">{f.icon}</div>
              <h3 className="font-cormorant text-xl text-cream-light mb-2">{f.title}</h3>
              <p className="font-karla text-sm text-cream-light/50 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
