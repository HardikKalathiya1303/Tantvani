import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn } from 'lucide-react';

export default function ProductImageGallery({ product, activeImage, setActiveImage, setShowZoom, hasDiscount }) {
  return (
    <div className="space-y-4">
      <div
        className="relative aspect-portrait overflow-hidden bg-cream-dark cursor-zoom-in group"
        onClick={() => setShowZoom(true)}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage}
            src={product.images?.[activeImage]?.url}
            alt={product.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-cream-light/90 p-2 shadow-elegant">
            <ZoomIn className="w-4 h-4 text-wine-dark/50" />
          </div>
        </div>
        {product.isNewArrival && (
          <span className="absolute top-4 left-4 bg-gold text-wine-dark font-jost text-[9px] tracking-[0.2em] uppercase px-3 py-1.5">New</span>
        )}
        {hasDiscount && (
          <span className="absolute top-4 left-4 bg-wine text-cream-light font-jost text-[9px] tracking-[0.2em] uppercase px-3 py-1.5" style={{ top: product.isNewArrival ? '56px' : '16px' }}>
            -{Math.round((1 - product.discountPrice / product.price) * 100)}%
          </span>
        )}
      </div>
      {product.images?.length > 1 && (
        <div className="grid grid-cols-4 gap-2 sm:gap-3">
          {product.images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              className={`aspect-square overflow-hidden border-2 transition-all duration-200 ${activeImage === i ? 'border-wine' : 'border-transparent hover:border-cream-darker'}`}
            >
              <img src={img.url} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
