import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import ProductGrid from '../components/home/ProductGrid';
import FilterSidebar from '../components/collections/FilterSidebar';
import MobileFilterDrawer from '../components/collections/MobileFilterDrawer';
import api from '../utils/api';

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Top Rated', value: 'rating' },
  { label: 'Most Popular', value: 'popular' },
];

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
            <button
              onClick={() => setDesktopFiltersOpen(o => !o)}
              className="hidden lg:flex items-center gap-2 font-jost text-[10px] tracking-[0.2em] uppercase text-wine-dark/60 hover:text-wine transition-colors"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {desktopFiltersOpen ? 'Hide Filters' : 'Filters'}
            </button>
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

      <MobileFilterDrawer
        mobileFiltersOpen={mobileFiltersOpen}
        setMobileFiltersOpen={setMobileFiltersOpen}
        params={params}
        updateFilter={updateFilter}
        catsData={catsData}
        clearAll={clearAll}
      />
    </div>
  );
}
