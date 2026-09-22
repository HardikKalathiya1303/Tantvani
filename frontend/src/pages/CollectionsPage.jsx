import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from 'lucide-react';
import ProductGrid from '../components/home/ProductGrid';
import api from '../utils/api';

const FABRICS = ['Silk', 'Banarasi', 'Kanjivaram', 'Chanderi', 'Cotton', 'Linen', 'Georgette', 'Tussar'];
const OCCASIONS = ['Wedding', 'Festive', 'Casual', 'Office', 'Party', 'Daily Wear'];
const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Most Popular', value: 'popular' },
];

function AccordionFilter({ title, children, defaultOpen = false }) {
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

function FilterSidebar({ params, updateFilter, catsData }) {
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

export default function CollectionsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [desktopFiltersOpen, setDesktopFiltersOpen] = useState(true);
  const [page, setPage] = useState(1);

  const params = Object.fromEntries(searchParams.entries());
  const { category = '', search = '', fabric = '', occasion = '', featured = '', newArrival = '', bestseller = '', sort = 'newest', minPrice = '', maxPrice = '' } = params;

  const { data, isLoading } = useQuery({
    queryKey: ['products', { ...params, page }],
    queryFn: () => api.get('/products', { params: { ...params, page, limit: 12 } }).then(r => r.data),
    keepPreviousData: true,
  });

  const { data: catsData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const updateFilter = (key, val) => {
    const p = new URLSearchParams(searchParams);
    val ? p.set(key, val) : p.delete(key);
    p.delete('page');
    setSearchParams(p);
    setPage(1);
  };

  const clearAll = () => { setSearchParams({}); setPage(1); };

  const activeFilters = [
    category && { key: 'category', label: catsData?.categories?.find(c => c._id === category)?.name || 'Category' },
    fabric && { key: 'fabric', label: fabric },
    occasion && { key: 'occasion', label: occasion },
    featured === 'true' && { key: 'featured', label: 'Featured' },
    newArrival === 'true' && { key: 'newArrival', label: 'New Arrivals' },
    bestseller === 'true' && { key: 'bestseller', label: 'Bestsellers' },
    search && { key: 'search', label: `"${search}"` },
    minPrice && { key: 'minPrice', label: `Min ₹${minPrice}` },
    maxPrice && { key: 'maxPrice', label: `Max ₹${maxPrice}` },
  ].filter(Boolean);

  const pageTitle = search ? `Results for "${search}"` : featured === 'true' ? 'Featured Collection' : newArrival === 'true' ? 'New Arrivals' : bestseller === 'true' ? 'Bestsellers' : 'All Collections';

  return (
    <div className="pb-24 min-h-screen bg-cream">
      {/* Page header */}
      <div className="bg-cream-dark/60 py-12 sm:py-16 text-center border-b border-cream-darker/30">
        <p className="eyebrow mb-3">Tantvani</p>
        <h1 className="heading-md text-wine-dark">{pageTitle}</h1>
        {data && !isLoading && (
          <p className="font-karla text-sm text-wine-dark/50 mt-3">{data.total} sarees available</p>
        )}
      </div>

      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10 pt-8">
        {/* Active filters */}
        {activeFilters.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="font-jost text-[10px] tracking-[0.22em] uppercase text-wine-dark/50">Filters:</span>
            {activeFilters.map(f => (
              <button
                key={f.key}
                onClick={() => updateFilter(f.key, '')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-wine text-cream-light text-[10px] font-jost tracking-[0.12em] uppercase hover:bg-wine-light transition-colors"
              >
                {f.label} <X className="w-2.5 h-2.5" />
              </button>
            ))}
            <button onClick={clearAll} className="text-[10px] font-jost tracking-[0.15em] uppercase text-wine-dark/40 hover:text-wine underline">
              Clear all
            </button>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex items-center justify-between pb-5 mb-6 border-b border-cream-darker/40">
          <div className="flex items-center gap-3">
            {/* Desktop toggle */}
            <button
              onClick={() => setDesktopFiltersOpen(o => !o)}
              className="hidden lg:flex items-center gap-2 font-jost text-[10px] tracking-[0.2em] uppercase text-wine-dark/60 hover:text-wine transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {desktopFiltersOpen ? 'Hide Filters' : 'Filters'}
            </button>
            {/* Mobile trigger */}
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden flex items-center gap-2 font-jost text-[10px] tracking-[0.2em] uppercase text-wine-dark/60"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              Filters {activeFilters.length > 0 && `(${activeFilters.length})`}
            </button>
          </div>
          <select
            value={sort}
            onChange={e => updateFilter('sort', e.target.value)}
            className="input-field w-auto text-[11px] font-jost tracking-[0.08em] py-2 px-3 cursor-pointer"
          >
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        <div className="flex gap-8 lg:gap-10">
          {/* Desktop sidebar */}
          <AnimatePresence initial={false}>
            {desktopFiltersOpen && (
              <motion.aside
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 220, opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="hidden lg:block shrink-0 overflow-hidden"
              >
                <FilterSidebar params={params} updateFilter={updateFilter} catsData={catsData} />
              </motion.aside>
            )}
          </AnimatePresence>

          {/* Products */}
          <div className="flex-1 min-w-0">
            <ProductGrid products={data?.products || []} loading={isLoading} emptyMessage="No sarees found" />
            {/* Pagination */}
            {data?.pages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {[...Array(data.pages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => { setPage(i + 1); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className={`w-9 h-9 font-jost text-sm border transition-all duration-200 ${page === i + 1 ? 'bg-wine border-wine text-cream-light' : 'border-cream-darker hover:border-wine text-wine-dark/60 hover:text-wine'}`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
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
    </div>
  );
}
