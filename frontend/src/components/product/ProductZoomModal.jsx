import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function ProductZoomModal({ showZoom, setShowZoom, product, activeImage }) {
  return (
    <AnimatePresence>
      {showZoom && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowZoom(false)}
          className="fixed inset-0 z-[100] bg-wine-darker/95 flex items-center justify-center p-4"
        >
          <button className="absolute top-4 right-4 text-cream-light/60 hover:text-cream-light">
            <X className="w-6 h-6" />
          </button>
          <img
            src={product?.images?.[activeImage]?.url}
            alt={product?.name}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={e => e.stopPropagation()}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
