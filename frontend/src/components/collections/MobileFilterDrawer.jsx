import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import FilterSidebar from './FilterSidebar';

export default function MobileFilterDrawer({ mobileFiltersOpen, setMobileFiltersOpen, params, updateFilter, catsData, clearAll }) {
  return (
    <AnimatePresence>
      {mobileFiltersOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-wine-darker/50"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <motion.div
            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 32, stiffness: 320 }}
            className="fixed top-0 left-0 bottom-0 z-[55] w-[85vw] max-w-xs bg-cream-light flex flex-col shadow-luxury overflow-hidden"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-cream-darker/40">
              <span className="font-jost text-[10px] tracking-[0.28em] uppercase text-wine-dark">Filters</span>
              <button onClick={() => setMobileFiltersOpen(false)} className="p-2 text-wine-dark/50">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <FilterSidebar params={params} updateFilter={updateFilter} catsData={catsData} />
            </div>
            <div className="p-5 border-t border-cream-darker/40 flex gap-3">
              <button onClick={() => { clearAll(); setMobileFiltersOpen(false); }} className="btn-outline flex-1 py-3">
                Clear All
              </button>
              <button onClick={() => setMobileFiltersOpen(false)} className="btn-primary flex-1 py-3">
                Apply
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
