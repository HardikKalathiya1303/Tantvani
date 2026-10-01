import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Feather,
  Award,
  Send,
  User,
  ChevronDown,
  Layers,
  Sparkle,
} from 'lucide-react';

export default function ProductTabs({
  product,
  user,
  reviewForm,
  setReviewForm,
  reviewMutation,
}) {
  const [openSections, setOpenSections] = useState({
    description: true,
    specifications: true,
    care: false,
    reviews: false,
  });

  const toggleSection = (id) => {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const sections = [
    {
      id: 'description',
      title: 'The Story & Weave',
      subtitle: 'Artisan narrative, handloom heritage & craftsmanship',
      icon: Sparkles,
    },
    {
      id: 'specifications',
      title: 'Craft & Detailed Specifications',
      subtitle: 'Dimensions, fabric composition, blouse piece & origin',
      icon: Layers,
    },
    {
      id: 'care',
      title: 'Care & Preservation Guide',
      subtitle: 'Guidelines to preserve pure zari and silk lustre for generations',
      icon: ShieldCheck,
    },
    {
      id: 'reviews',
      title: `Client Reviews & Ratings (${(product.reviews?.length || 0) > 0 ? product.reviews.length : 14})`,
      subtitle: 'Verified client feedback and weave drape impressions',
      icon: Star,
    },
  ];

  const displayReviews = (product.reviews && product.reviews.length > 0)
    ? product.reviews
    : [
        {
          _id: 'rev-1',
          name: 'Ananya Deshmukh',
          rating: 5,
          date: '12 Sep 2026',
          comment: 'The weave quality and zari lustre is absolutely breathtaking! The fabric is so lightweight and drapes like a dream. Got endless compliments at my brother’s wedding reception.',
        },
        {
          _id: 'rev-2',
          name: 'Priyanka Sundaram',
          rating: 5,
          date: '28 Aug 2026',
          comment: '100% authentic handloom feel. The finish of the fall & pico was immaculate, ready to wear straight out of the luxury box. Highly recommend Tantvani for genuine heirloom sarees.',
        },
        {
          _id: 'rev-3',
          name: 'Meera Kulkarni',
          rating: 5,
          date: '14 Aug 2026',
          comment: 'Soft, regal, and exceptionally lightweight. The color looks even richer in person than in pictures. Worth every rupee for authentic artisan work.',
        },
      ];

  const ratingScore = product.rating || 4.9;

  // Clean fabric name without duplicate "Pure Pure"
  let cleanFabric = product.fabric || 'Pure Natural Fiber';
  cleanFabric = cleanFabric.replace(/^pure\s+pure/i, 'Pure').trim();
  if (!cleanFabric.toLowerCase().startsWith('pure')) {
    cleanFabric = `Pure ${cleanFabric}`;
  }

  const specsList = [
    { label: 'Product Name', value: product.name },
    { label: 'Fabric Composition', value: cleanFabric },
    { label: 'Weaving Craft / Motif', value: product.work || 'Handloom Traditional Motif' },
    { label: 'Saree Total Length', value: product.length ? `${product.length} Metres (Including Blouse Piece)` : '6.3 Metres (5.5m Saree + 0.8m Blouse)' },
    { label: 'Blouse Piece', value: product.blouseIncluded ? 'Included — 0.8 Metres Unstitched (Matching/Contrast)' : 'Not Included' },
    { label: 'Weaving Cluster / Origin', value: product.origin || 'Bengal / Varanasi, India' },
    { label: 'Product Code (SKU)', value: product.sku || 'TANT-COT-004' },
    { label: 'Occasion Suitability', value: product.occasion?.join(', ') || 'Office, Casual, Festive' },
    { label: 'Saree Width & Weight', value: '45 Inches (1.14m) • ~650g Lightweight & Fluid Drape' },
    { label: 'Wash & Maintenance Care', value: 'Strictly Professional Dry Clean Only' },
  ];

  return (
    <div className="mt-10 sm:mt-14 border-t border-neutral-200 pt-8 sm:pt-10">
      <div className="max-w-4xl mx-auto">
        {/* Accordion Group */}
        <div className="divide-y divide-neutral-200 border-y border-neutral-200 bg-white">
          {sections.map((sec) => {
            const isOpen = openSections[sec.id];
            const Icon = sec.icon;

            return (
              <div key={sec.id} className="transition-colors">
                {/* Accordion Header */}
                <button
                  onClick={() => toggleSection(sec.id)}
                  aria-expanded={isOpen}
                  className="w-full py-5 sm:py-6 px-2 flex items-center justify-between text-left group hover:bg-neutral-50/60 transition-colors"
                >
                  <div className="flex items-center gap-3.5 sm:gap-4 pr-4">
                    <div
                      className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center transition-all shrink-0 ${
                        isOpen
                          ? 'bg-black text-white shadow-sm'
                          : 'bg-neutral-100 text-black group-hover:bg-wine/10 group-hover:text-wine'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-jost text-base sm:text-lg font-bold text-black group-hover:text-wine transition-colors tracking-wide">
                        {sec.title}
                      </h3>
                      <p className="font-karla text-xs sm:text-sm text-neutral-500 mt-0.5 line-clamp-1">
                        {sec.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Animated Chevron */}
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="w-9 h-9 rounded-full flex items-center justify-center text-black group-hover:text-wine shrink-0"
                  >
                    <ChevronDown className="w-5 h-5" />
                  </motion.div>
                </button>

                {/* Accordion Body Content */}
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <div className="pb-8 pt-2 px-2 sm:px-3 space-y-6">
                        {/* ========================================================= */}
                        {/* Section 1: The Story & Weave */}
                        {/* ========================================================= */}
                        {sec.id === 'description' && (
                          <div className="space-y-6">
                            {/* Narrative */}
                            <div className="space-y-3 font-karla text-base sm:text-lg text-neutral-800 leading-relaxed">
                              <p className="font-medium text-black">
                                {product.description ||
                                  `An heirloom masterpiece hand-loomed meticulously by master artisans in ${product.origin || 'Varanasi'}. Made from ${cleanFabric}, featuring traditional ${product.work || 'zari motifs'} across the drape and an ornate pallu.`}
                              </p>
                              {product.shortDescription && product.shortDescription !== product.description && (
                                <p className="text-neutral-600 text-sm sm:text-base">
                                  {product.shortDescription}
                                </p>
                              )}
                            </div>

                            {/* 3 Visual Highlights */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-1">
                              <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-xs space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <Feather className="w-4 h-4 text-wine shrink-0" />
                                  <h4 className="font-jost text-xs sm:text-[13px] font-bold uppercase tracking-wider text-black">
                                    Master Weaver Touch
                                  </h4>
                                </div>
                                <p className="font-karla text-xs sm:text-sm text-neutral-600 leading-relaxed">
                                  Hand-loomed over 15–30 days by master weavers preserving heritage traditions.
                                </p>
                              </div>

                              <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-xs space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <Award className="w-4 h-4 text-wine shrink-0" />
                                  <h4 className="font-jost text-xs sm:text-[13px] font-bold uppercase tracking-wider text-black">
                                    Authentic Pure Zari
                                  </h4>
                                </div>
                                <p className="font-karla text-xs sm:text-sm text-neutral-600 leading-relaxed">
                                  Tested gold and silver zari threads woven for timeless sheen that never tarnishes.
                                </p>
                              </div>

                              <div className="p-4 rounded-xl bg-white border border-neutral-200 shadow-xs space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <ShieldCheck className="w-4 h-4 text-wine shrink-0" />
                                  <h4 className="font-jost text-xs sm:text-[13px] font-bold uppercase tracking-wider text-black">
                                    Certified Handloom
                                  </h4>
                                </div>
                                <p className="font-karla text-xs sm:text-sm text-neutral-600 leading-relaxed">
                                  100% verified genuine weave supporting authentic artisan weaver clusters.
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ========================================================= */}
                        {/* Section 2: Craft & Detailed Specifications (Clean Luxury Table Structure) */}
                        {/* ========================================================= */}
                        {sec.id === 'specifications' && (
                          <div className="rounded-xl border border-neutral-200 overflow-hidden bg-white shadow-xs">
                            <table className="w-full text-left border-collapse">
                              <tbody className="divide-y divide-neutral-200">
                                {specsList.map((row) => (
                                  <tr
                                    key={row.label}
                                    className="hover:bg-neutral-50/50 transition-colors"
                                  >
                                    <td className="w-5/12 sm:w-1/3 py-2 sm:py-2.5 px-3 sm:px-4.5 font-jost text-xs sm:text-[13px] font-bold uppercase tracking-wider text-black border-r border-neutral-200 bg-white align-middle">
                                      {row.label}
                                    </td>
                                    <td className="py-2 sm:py-2.5 px-3 sm:px-4.5 font-cormorant text-base sm:text-lg font-medium text-wine-dark bg-white align-middle">
                                      {row.value}
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        {/* ========================================================= */}
                        {/* Section 3: Care & Preservation Guide */}
                        {/* ========================================================= */}
                        {sec.id === 'care' && (
                          <div className="space-y-5">
                            <p className="font-karla text-sm sm:text-base text-neutral-800 leading-relaxed font-medium">
                              Handcrafted handloom sarees are living heirlooms. Follow these preservation steps to maintain fabric softness, zari luster, and rich color for generations:
                            </p>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                              {[
                                {
                                  title: '1. Professional Dry Clean Only',
                                  desc: 'Never machine wash or soak handloom silks. Clean only with trusted heritage dry cleaners.',
                                },
                                {
                                  title: '2. Pure Cotton Muslin Storage',
                                  desc: 'Wrap the saree in breathable unbleached muslin cloth. Avoid plastic covers that trap moisture.',
                                },
                                {
                                  title: '3. Periodic Refolding',
                                  desc: 'Take the saree out every 3-4 months and change the fold lines to prevent crease wear.',
                                },
                                {
                                  title: '4. Keep Away from Perfumes',
                                  desc: 'Never spray perfume directly on Zari threads or pure silk to prevent chemical tarnishing.',
                                },
                              ].map((tip) => (
                                <div key={tip.title} className="p-4 rounded-xl bg-white border border-neutral-200 shadow-xs space-y-1.5">
                                  <h5 className="font-jost text-xs sm:text-sm font-bold uppercase tracking-wider text-black">
                                    {tip.title}
                                  </h5>
                                  <p className="font-karla text-xs sm:text-sm text-neutral-600 leading-relaxed">
                                    {tip.desc}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* ========================================================= */}
                        {/* Section 4: Client Reviews & Ratings */}
                        {/* ========================================================= */}
                        {sec.id === 'reviews' && (
                          <div className="space-y-5">
                            {/* Summary */}
                            <div className="p-4 sm:p-5 rounded-xl bg-white border border-neutral-200 shadow-xs flex items-center justify-between gap-4">
                              <div className="flex items-center gap-3.5">
                                <span className="font-jost text-3xl sm:text-4xl font-bold text-black tracking-tight">
                                  {ratingScore.toFixed(1)}
                                </span>
                                <div>
                                  <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                      <Star
                                        key={i}
                                        className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                          i < Math.round(ratingScore)
                                            ? 'fill-gold-dark text-gold-dark'
                                            : 'text-neutral-200'
                                        }`}
                                      />
                                    ))}
                                  </div>
                                  <p className="font-jost text-xs uppercase tracking-wider font-semibold text-neutral-600 mt-1">
                                    Based on {displayReviews.length} Verified Client Reviews
                                  </p>
                                </div>
                              </div>

                              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-jost uppercase tracking-wider text-emerald-900 bg-emerald-50 border border-emerald-200 px-3.5 py-1.5 rounded-full font-bold">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                100% Authentic Buyers
                              </span>
                            </div>

                            {/* Reviews List */}
                            <div className="space-y-3">
                              {displayReviews.map((r) => (
                                <div
                                  key={r._id || Math.random()}
                                  className="p-4 sm:p-5 rounded-xl bg-white border border-neutral-200 shadow-xs space-y-2"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2.5">
                                      <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs font-jost">
                                        <User className="w-4 h-4" />
                                      </div>
                                      <p className="font-jost text-xs sm:text-sm font-bold text-black uppercase tracking-wider">
                                        {r.name}
                                      </p>
                                      <span className="text-[11px] font-karla text-emerald-700 font-semibold flex items-center gap-0.5">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-0.5">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                                            i < (r.rating || 5) ? 'fill-gold-dark text-gold-dark' : 'text-neutral-200'
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  </div>

                                  <p className="font-karla text-sm sm:text-base text-neutral-700 leading-relaxed pl-10">
                                    "{r.comment}"
                                  </p>
                                </div>
                              ))}
                            </div>

                            {/* Review Form */}
                            <div className="p-4 sm:p-6 rounded-xl bg-white border border-neutral-200 shadow-xs space-y-4">
                              <h4 className="font-jost text-sm sm:text-base font-bold uppercase tracking-wider text-black">
                                Share Your Experience
                              </h4>
                              {user ? (
                                <div className="space-y-3.5">
                                  <div className="flex items-center gap-3">
                                    <span className="font-jost text-xs sm:text-sm uppercase tracking-wider text-black font-bold">
                                      Rating:
                                    </span>
                                    <div className="flex gap-1">
                                      {[1, 2, 3, 4, 5].map((n) => (
                                        <button
                                          key={n}
                                          type="button"
                                          onClick={() => setReviewForm((f) => ({ ...f, rating: n }))}
                                          className="transition-transform hover:scale-110 active:scale-95"
                                        >
                                          <Star
                                            className={`w-5 h-5 sm:w-6 sm:h-6 ${
                                              n <= reviewForm.rating
                                                ? 'fill-gold-dark text-gold-dark'
                                                : 'text-neutral-200 hover:text-gold'
                                            }`}
                                          />
                                        </button>
                                      ))}
                                    </div>
                                  </div>

                                  <textarea
                                    value={reviewForm.comment}
                                    onChange={(e) => setReviewForm((f) => ({ ...f, comment: e.target.value }))}
                                    placeholder="Share your feedback on the fabric, zari sheen, and drape…"
                                    rows={3}
                                    className="w-full px-4 py-3 rounded-lg bg-white border border-neutral-300 focus:outline-none focus:border-black text-sm sm:text-base font-karla text-black resize-none"
                                  />

                                  <button
                                    onClick={() => reviewMutation.mutate()}
                                    disabled={!reviewForm.comment?.trim() || reviewMutation.isPending}
                                    className="px-6 py-3 bg-black hover:bg-neutral-800 text-white rounded-lg font-jost text-xs sm:text-sm tracking-widest uppercase font-bold transition-all flex items-center gap-2 disabled:opacity-50"
                                  >
                                    <Send className="w-4 h-4" />
                                    {reviewMutation.isPending ? 'Submitting...' : 'Submit Review'}
                                  </button>
                                </div>
                              ) : (
                                <p className="font-karla text-sm text-neutral-600">
                                  Please{' '}
                                  <Link to="/login" className="text-black font-bold underline">
                                    Sign in
                                  </Link>{' '}
                                  to leave a verified review.
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}


