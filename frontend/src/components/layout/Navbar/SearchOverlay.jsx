import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';

export default function SearchOverlay({ searchOpen, setSearchOpen, searchQ, setSearchQ, handleSearch, searchRef, navigate }) {
  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex flex-col items-center justify-start pt-24 sm:pt-36 bg-[#2A0D10]/95 backdrop-blur-md px-4"
          onClick={() => setSearchOpen(false)}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ delay: 0.05 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-2xl"
          >
            <form onSubmit={handleSearch} className="flex items-center border-b-2 border-[#FDFAF5]/30 pb-5">
              <Search className="w-5 h-5 sm:w-6 sm:h-6 text-[#FDFAF5]/50 shrink-0 mr-4" />
              <input
                ref={searchRef}
                type="text"
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                placeholder="Search sarees, fabrics, occasions…"
                className="flex-1 bg-transparent text-[#FDFAF5] text-xl sm:text-3xl font-cormorant font-light placeholder:text-[#FDFAF5]/30 outline-none"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="ml-4 text-[#FDFAF5]/50 hover:text-[#FDFAF5] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
            <div className="mt-5 flex flex-wrap gap-3">
              {['Banarasi', 'Kanjivaram', 'Wedding', 'Silk', 'Chanderi'].map(s => (
                <button
                  key={s}
                  onClick={() => {
                    setSearchQ(s);
                    navigate(`/collections?search=${s}`);
                    setSearchOpen(false);
                  }}
                  className="font-jost text-[10px] tracking-[0.18em] uppercase text-[#FDFAF5]/50 hover:text-[#FDFAF5] transition-colors border border-[#FDFAF5]/15 hover:border-[#FDFAF5]/40 px-4 py-2"
                >
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
