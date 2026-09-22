import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const testimonials = [
  { id: 1, name: 'Priya Sharma', location: 'Mumbai', rating: 5, text: 'The Banarasi silk from Tantvani was beyond beautiful. Every thread tells a story. I wore it for my daughter\'s wedding and received so many compliments. The quality is unmatched.' },
  { id: 2, name: 'Meera Krishnan', location: 'Chennai', rating: 5, text: 'I have been collecting Kanjivaram sarees for 20 years, and Tantvani\'s pieces are among the finest I\'ve ever owned. The craftsmanship is extraordinary and the service was impeccable.' },
  { id: 3, name: 'Anjali Gupta', location: 'Delhi', rating: 5, text: 'Ordered the Chanderi silk for Diwali and it arrived beautifully packaged like a gift. The fabric drapes like a dream. This is what luxury shopping should feel like.' },
  { id: 4, name: 'Sunita Patel', location: 'Ahmedabad', rating: 5, text: 'Tantvani is where heritage meets modern elegance. My Patola from here is a family heirloom now. The attention to detail in every piece is simply breathtaking.' },
];

export default function TestimonialsSection() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((current + 1) % testimonials.length);
  const prev = () => setCurrent((current - 1 + testimonials.length) % testimonials.length);

  const t = testimonials[current];

  return (
    <section className="py-24 bg-gradient-subtle">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="eyebrow mb-4">What They Say</p>
        <h2 className="heading-md mb-16">Voices of Our Community</h2>

        {/* Large decorative quote */}
        <div className="relative">
          <span className="absolute -top-8 left-1/2 -translate-x-1/2 font-cormorant text-[10rem] leading-none text-secondary/10 select-none">"</span>

          <AnimatePresence mode="wait">
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="relative z-10"
            >
              <div className="flex justify-center mb-6">
                {[...Array(t.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-secondary text-secondary" />
                ))}
              </div>

              <p className="font-cormorant text-2xl md:text-3xl font-light text-foreground leading-relaxed mb-8 italic">
                "{t.text}"
              </p>

              <div className="font-jost text-xs tracking-[0.25em] uppercase">
                <span className="text-foreground font-medium">{t.name}</span>
                <span className="text-muted-fg mx-2">·</span>
                <span className="text-muted-fg">{t.location}</span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-12">
          <button onClick={prev} className="w-10 h-10 border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors duration-200">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-0.5 transition-all duration-300 ${i === current ? 'w-8 bg-primary' : 'w-4 bg-border'}`}
              />
            ))}
          </div>
          <button onClick={next} className="w-10 h-10 border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors duration-200">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
