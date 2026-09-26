import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FABRICS = ['Silk', 'Banarasi', 'Kanjivaram', 'Chanderi', 'Cotton', 'Linen', 'Georgette', 'Tussar'];
const OCCASIONS = ['Wedding', 'Festive', 'Casual', 'Office', 'Party', 'Daily Wear'];

export function AccordionFilter({ title, children, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-cream-darker/40 pb-4 mb-4">
      <button onClick={() => setOpen(o => !o)} className="flex items-center justify-between w-full mb-3">
        <span className="font-jost text-[10px] tracking-[0.25em] uppercase text-wine-dark/80">{title}</span>
        {open ? <ChevronUp className="w-3.5 h-3.5 text-wine-dark/40" /> : <ChevronDown className="w-3.5 h-3.5 text-wine-dark/40" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function FilterSidebar({ params, updateFilter, catsData }) {
  const { category, fabric, occasion, minPrice, maxPrice } = params;
  return (
    <div className="space-y-0">
      {catsData?.categories?.length > 0 && (
        <AccordionFilter title="Category" defaultOpen>
          <ul className="space-y-2">
            {catsData.categories.filter(c => c.isActive).map(c => (
              <li key={c._id}>
                <button
                  onClick={() => updateFilter('category', category === c._id ? '' : c._id)}
                  className={`font-karla text-sm transition-colors ${category === c._id ? 'text-wine font-medium' : 'text-wine-dark/55 hover:text-wine-dark'}`}
                >
                  {category === c._id && '✓ '}{c.name}
                </button>
              </li>
            ))}
          </ul>
        </AccordionFilter>
      )}

      <AccordionFilter title="Fabric" defaultOpen>
        <div className="space-y-2">
          {FABRICS.map(f => (
            <button
              key={f}
              onClick={() => updateFilter('fabric', fabric === f.toLowerCase() ? '' : f.toLowerCase())}
              className={`block font-karla text-sm transition-colors ${fabric === f.toLowerCase() ? 'text-wine font-medium' : 'text-wine-dark/55 hover:text-wine-dark'}`}
            >
              {fabric === f.toLowerCase() && '✓ '}{f}
            </button>
          ))}
        </div>
      </AccordionFilter>

      <AccordionFilter title="Occasion">
        <div className="space-y-2">
          {OCCASIONS.map(o => (
            <button
              key={o}
              onClick={() => updateFilter('occasion', occasion === o.toLowerCase() ? '' : o.toLowerCase())}
              className={`block font-karla text-sm transition-colors ${occasion === o.toLowerCase() ? 'text-wine font-medium' : 'text-wine-dark/55 hover:text-wine-dark'}`}
            >
              {occasion === o.toLowerCase() && '✓ '}{o}
            </button>
          ))}
        </div>
      </AccordionFilter>

      <AccordionFilter title="Price Range (₹)">
        <div className="flex items-center gap-2">
          <input
            type="number" placeholder="Min" value={minPrice}
            onChange={e => updateFilter('minPrice', e.target.value)}
            className="input-field text-sm px-3 py-2 w-full"
          />
          <span className="text-wine-dark/30 shrink-0">—</span>
          <input
            type="number" placeholder="Max" value={maxPrice}
            onChange={e => updateFilter('maxPrice', e.target.value)}
            className="input-field text-sm px-3 py-2 w-full"
          />
        </div>
      </AccordionFilter>
    </div>
  );
}
