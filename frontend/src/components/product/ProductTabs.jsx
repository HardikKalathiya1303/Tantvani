import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';

export default function ProductTabs({
  activeTab,
  setActiveTab,
  product,
  user,
  reviewForm,
  setReviewForm,
  reviewMutation,
}) {
  return (
    <div className="mt-16 sm:mt-20 border-t border-cream-darker/40 pt-10 sm:pt-12">
      <div className="flex gap-6 sm:gap-8 border-b border-cream-darker/40 mb-8 sm:mb-10 overflow-x-auto scrollbar-hide">
        {[
          ['description', 'Description'],
          ['care', 'Care Instructions'],
          ['reviews', `Reviews (${product.numReviews})`],
        ].map(([id, label]) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`pb-4 font-jost text-[10px] tracking-[0.22em] uppercase transition-colors border-b-2 -mb-px whitespace-nowrap shrink-0 ${activeTab === id ? 'border-wine text-wine-dark' : 'border-transparent text-wine-dark/45 hover:text-wine-dark'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'description' && (
          <motion.div
            key="desc"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-3xl"
          >
            <p className="font-karla text-base text-wine-dark/75 leading-relaxed whitespace-pre-line">{product.description}</p>
          </motion.div>
        )}

        {activeTab === 'care' && (
          <motion.div
            key="care"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-3xl"
          >
            <p className="font-karla text-base text-wine-dark/75 leading-relaxed">
              {product.care || 'Dry clean only. Store in a cool, dry place away from direct sunlight. Fold along the original fold lines. Do not wring or twist. Handle embellishments and zari work with care.'}
            </p>
          </motion.div>
        )}

        {activeTab === 'reviews' && (
          <motion.div
            key="reviews"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="max-w-3xl space-y-8"
          >
            {product.reviews?.length === 0 && (
              <p className="font-cormorant text-xl text-wine-dark/40">No reviews yet. Be the first to review!</p>
            )}
            {product.reviews?.map(r => (
              <div key={r._id} className="border-b border-cream-darker/40 pb-8">
                <div className="flex items-center gap-1.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-gold text-gold' : 'text-cream-darker'}`} />
                  ))}
                </div>
                <p className="font-karla text-sm text-wine-dark/75 mb-3 leading-relaxed">"{r.comment}"</p>
                <p className="font-jost text-[9px] tracking-[0.2em] uppercase text-wine-dark/40">— {r.name}</p>
              </div>
            ))}

            {user ? (
              <div className="pt-4">
                <h4 className="font-cormorant text-2xl text-wine-dark mb-6">Write a Review</h4>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} onClick={() => setReviewForm(f => ({ ...f, rating: n }))}>
                        <Star className={`w-6 h-6 ${n <= reviewForm.rating ? 'fill-gold text-gold' : 'text-cream-darker hover:text-gold'} transition-colors`} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={reviewForm.comment}
                    onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                    placeholder="Share your experience with this saree…"
                    rows={4}
                    className="input-field resize-none"
                  />
                  <button
                    onClick={() => reviewMutation.mutate()}
                    disabled={!reviewForm.comment || reviewMutation.isPending}
                    className="btn-primary disabled:opacity-60"
                  >
                    {reviewMutation.isPending ? 'Submitting…' : 'Submit Review'}
                  </button>
                </div>
              </div>
            ) : (
              <p className="font-karla text-sm text-wine-dark/50">
                <Link to="/login" className="text-wine hover:underline">Sign in</Link> to write a review.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
