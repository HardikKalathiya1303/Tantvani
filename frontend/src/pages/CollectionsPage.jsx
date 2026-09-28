import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, ChevronDown, Check, Heart, Grid2X2, ChevronLeft, ChevronRight } from 'lucide-react';
import ProductGrid from '../components/home/ProductGrid';
import FilterSidebar from '../components/collections/FilterSidebar';
import api from '../utils/api';

// Custom 4-Column Grid Icon (4x4 / 4 vertical columns)
function Grid4Icon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M7.5 3v18" />
      <path d="M12 3v18" />
      <path d="M16.5 3v18" />
      <path d="M3 12h18" />
    </svg>
  );
}

// Custom 3-Column Grid Icon (3x3 / 3 vertical columns)
function Grid3Icon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 3v18" />
      <path d="M15 3v18" />
      <path d="M3 12h18" />
    </svg>
  );
}

const SORT_OPTIONS = [
  { label: 'Relevance', value: 'relevance' },
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Most Popular', value: 'popular' },
];

export default function CollectionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [gridCols, setGridCols] = useState(4);
  const [showDesktopSidebar, setShowDesktopSidebar] = useState(true);
  const [sortOpen, setSortOpen] = useState(false);

  const params = Object.fromEntries(searchParams.entries());

  const { data, isLoading } = useQuery({
    queryKey: ['products', { ...params, page }],
    queryFn: () => api.get('/products', { params: { ...params, page, limit: 12 } }).then(r => r.data),
    keepPreviousData: true,
  });

  const updateFilter = (key, val) => {
    const p = new URLSearchParams(searchParams);
    val ? p.set(key, val) : p.delete(key);
    p.delete('page');
    setSearchParams(p);
    setPage(1);
  };

  const clearAll = () => {
    setSearchParams({});
    setPage(1);
  };

  const currentSortObj = SORT_OPTIONS.find(s => s.value === (params.sort || 'relevance'));

  const activeFiltersCount = Object.keys(params).filter(k => k !== 'sort' && k !== 'page' && params[k]).length;

  return (
    <div className="pb-24 min-h-screen bg-[#FDFBF7] relative text-[#2B1810]">
      {/* Fixed Vertical Wishlist Tab on the right edge */}
      <Link
        to="/wishlist"
        className="fixed right-0 top-1/2 -translate-y-1/2 z-40 bg-[#8C3342] hover:bg-[#6B2732] text-white py-3 px-2 rounded-l-md shadow-2xl flex flex-col items-center gap-2 group transition-all duration-300"
        title="View Wishlist"
      >
        <Heart className="w-4 h-4 fill-white animate-pulse" />
        <span
          className="text-[10px] font-jost font-bold uppercase tracking-widest text-white whitespace-nowrap"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
        >
          My Wishlist
        </span>
      </Link>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-12 pt-8 sm:pt-12">
        {/* Editorial Hero Banner Header */}
        <div className="pt-4 pb-8 sm:pb-12 border-b border-[#E8DFC8]/60">
          <p className="eyebrow text-[#8C3342] text-xs font-semibold tracking-[0.25em] uppercase mb-4">
            THE MONSOON EDIT · 2025
          </p>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <h1 className="font-cormorant text-4xl sm:text-6xl md:text-7xl font-normal leading-[1.1] text-[#2B1810]">
                Woven for <br />
                <em className="italic text-[#8C3342] font-serif font-normal">your moments.</em>
              </h1>
              <p className="font-karla text-sm sm:text-base text-[#2B1810]/65 max-w-xl mt-4 leading-relaxed">
                A considered collection of handloom sarees, made slowly in India and chosen for the way they make you feel.
              </p>
            </div>

            {/* Badges on Right Side of Header */}
            <div className="flex items-center gap-6 text-xs font-karla text-[#2B1810]/70 shrink-0 pb-1">
              <div className="flex items-center gap-1.5 font-medium">
                <span className="text-[#8C3342]">✦</span> Handloom verified
              </div>
              <div className="flex items-center gap-1.5 font-medium">
                <span>🚚</span> Thoughtful delivery
              </div>
            </div>
          </div>
        </div>

        {/* Toolbar Row */}
        <div className="py-5 flex items-center justify-between gap-4 border-b border-[#E8DFC8]/40 mb-8">
          {/* Left: Filter Toggle Button + Piece Count right next to it */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setShowDesktopSidebar(s => !s)}
              className={`flex items-center gap-2.5 px-4 py-2 rounded-full border text-xs sm:text-sm font-jost tracking-wider font-semibold transition-all duration-300 cursor-pointer shadow-xs ${
                showDesktopSidebar
                  ? 'bg-[#8C3342] text-white border-[#8C3342] hover:bg-[#6B2732]'
                  : 'bg-white text-[#2B1810] border-[#E8DFC8] hover:border-[#8C3342] hover:text-[#8C3342]'
              }`}
              title={showDesktopSidebar ? 'Collapse Filters' : 'Expand Filters'}
            >
              <SlidersHorizontal className={`w-4 h-4 transition-transform duration-300 ${showDesktopSidebar ? 'rotate-180' : ''}`} />
              <span>{showDesktopSidebar ? 'Hide Filter' : 'Show Filter'}</span>
              {showDesktopSidebar ? (
                <ChevronLeft className="w-3.5 h-3.5 opacity-80" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5 opacity-80" />
              )}
              {activeFiltersCount > 0 && (
                <span className={`w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center ml-0.5 ${
                  showDesktopSidebar ? 'bg-white text-[#8C3342]' : 'bg-[#8C3342] text-white'
                }`}>
                  {activeFiltersCount}
                </span>
              )}
            </button>

            {/* Piece Count on the Right of Filter Button */}
            <div className="font-karla text-xs sm:text-sm text-[#2B1810]/70 pl-2 sm:pl-3 border-l border-[#E8DFC8]">
              <span className="font-semibold text-[#2B1810]">{data?.total || data?.products?.length || 0}</span> pieces
            </div>
          </div>

          {/* Right Controls: Sort Dropdown & Grid Switchers */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Sort Dropdown */}
            <div className="relative">
              <button
                onClick={() => setSortOpen(s => !s)}
                className="flex items-center gap-1.5 font-jost text-xs sm:text-sm tracking-wider font-medium text-[#2B1810] hover:text-[#8C3342] transition-colors cursor-pointer"
              >
                <span className="text-[#2B1810]/50 font-normal">Sort by</span>
                <span className="font-semibold text-[#8C3342]">{currentSortObj?.label}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${sortOpen ? 'rotate-180' : ''}`} />
              </button>

              {sortOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white border border-[#E8DFC8] rounded-xl shadow-xl py-2 z-50 animate-in fade-in duration-150">
                  <div className="px-3 py-1.5 border-b border-gray-100 text-[10px] font-jost uppercase tracking-widest text-gray-400 font-bold">
                    Sort By
                  </div>
                  {SORT_OPTIONS.map(s => {
                    const isSel = (params.sort || 'relevance') === s.value;
                    return (
                      <button
                        key={s.value}
                        onClick={() => { updateFilter('sort', s.value); setSortOpen(false); }}
                        className={`w-full px-4 py-2 text-left text-xs font-karla flex items-center justify-between hover:bg-cream/60 ${isSel ? 'font-bold text-[#8C3342] bg-cream/30' : 'text-gray-600'}`}
                      >
                        <span>{s.label}</span>
                        {isSel && <Check className="w-3.5 h-3.5 text-[#8C3342]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Grid Layout Switcher */}
            <div className="hidden sm:flex items-center gap-1 border-l border-[#E8DFC8] pl-4">
              {/* 4-Column Grid Icon (4x4) */}
              <button
                onClick={() => setGridCols(4)}
                title="4 Columns Grid"
                className={`p-1.5 rounded transition-colors ${
                  gridCols === 4 ? 'text-[#8C3342]' : 'text-gray-400 hover:text-[#2B1810]'
                }`}
              >
                <Grid4Icon className="w-4 h-4" />
              </button>

              {/* 3-Column Grid Icon (3x3) */}
              <button
                onClick={() => setGridCols(3)}
                title="3 Columns Grid"
                className={`p-1.5 rounded transition-colors ${
                  gridCols === 3 ? 'text-[#8C3342]' : 'text-gray-400 hover:text-[#2B1810]'
                }`}
              >
                <Grid3Icon className="w-4 h-4" />
              </button>

              {/* 2-Column Grid Icon (Perfect as-is) */}
              <button
                onClick={() => setGridCols(2)}
                title="2 Columns Grid"
                className={`p-1.5 rounded transition-colors ${
                  gridCols === 2 ? 'text-[#8C3342]' : 'text-gray-400 hover:text-[#2B1810]'
                }`}
              >
                <Grid2X2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content Area: Left Filter Sidebar + Right Product Grid */}
        <div className="flex gap-8 lg:gap-12 items-start">
          {/* Collapsible Left Sidebar */}
          <AnimatePresence initial={false}>
            {showDesktopSidebar && (
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 224, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="hidden lg:block shrink-0 overflow-hidden sticky top-24"
              >
                <div className="w-56">
                  <FilterSidebar params={params} updateFilter={updateFilter} clearAll={clearAll} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Right Product Grid */}
          <div className="flex-1 min-w-0">
            <ProductGrid
              products={data?.products || []}
              loading={isLoading}
              emptyMessage="No sarees match your selected criteria"
              gridCols={gridCols}
              isPLP={true}
            />

            {/* Pagination */}
            {data?.pages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-14">
                {[...Array(data.pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setPage(i + 1);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`w-10 h-10 rounded-full font-jost text-xs font-semibold transition-all duration-200 ${
                      page === i + 1
                        ? 'bg-[#8C3342] text-white shadow-md'
                        : 'border border-[#E8DFC8] hover:border-[#8C3342] text-[#2B1810]/60 hover:text-[#8C3342] bg-white'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
