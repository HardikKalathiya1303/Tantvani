import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ZoomIn, ChevronLeft, ChevronRight, Sparkles, Maximize2, Zap } from 'lucide-react';
import { getHdImageUrl, preloadHdImage } from '../../utils/imageHelper';

export default function ProductImageGallery({
  product,
  activeImage,
  setActiveImage,
  setShowZoom,
  hasDiscount,
}) {
  const containerRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0, pctX: 50, pctY: 50, width: 0, height: 0 });
  const [zoomFactor, setZoomFactor] = useState(2.8);

  const images = product?.images || [];
  const currentImage = images[activeImage]?.url || product?.image || '/placeholder-saree.jpg';
  const hdImageUrl = getHdImageUrl(currentImage, 2800, 95);

  // Preload HD image on image switch for instantaneous crisp zoom
  useEffect(() => {
    preloadHdImage(currentImage);
  }, [currentImage]);

  const LENS_SIZE = 220; // 220px lens diameter for crystal clear inspection
  const LENS_RADIUS = LENS_SIZE / 2;

  const handleMouseMove = useCallback((e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Constrain percentages
    const pctX = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const pctY = Math.max(0, Math.min(100, (y / rect.height) * 100));

    setMousePos({
      x,
      y,
      pctX,
      pctY,
      width: rect.width,
      height: rect.height,
    });
  }, []);

  const handleMouseEnter = (e) => {
    setIsHovered(true);
    handleMouseMove(e);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setActiveImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setActiveImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4 select-none">
      {/* Main Image Container */}
      <div
        ref={containerRef}
        className="relative aspect-portrait overflow-hidden rounded-xl bg-[#F9F9FB] cursor-crosshair group shadow-xs border border-neutral-200/80"
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setShowZoom(true)}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage}
            src={currentImage}
            alt={product?.name || 'Product Image'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full h-full object-cover pointer-events-none"
            loading="eager"
          />
        </AnimatePresence>

        {/* Amazon-style Floating HD Rounded Zoom Lens (Magnifier Loupe) */}
        {isHovered && mousePos.width > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.85 }}
            transition={{ duration: 0.12 }}
            style={{
              position: 'absolute',
              top: `${mousePos.y - LENS_RADIUS}px`,
              left: `${mousePos.x - LENS_RADIUS}px`,
              width: `${LENS_SIZE}px`,
              height: `${LENS_SIZE}px`,
              backgroundImage: `url("${hdImageUrl}")`,
              backgroundRepeat: 'no-repeat',
              backgroundSize: `${mousePos.width * zoomFactor}px ${mousePos.height * zoomFactor}px`,
              backgroundPosition: `${-(mousePos.x * zoomFactor - LENS_RADIUS)}px ${-(mousePos.y * zoomFactor - LENS_RADIUS)}px`,
              imageRendering: '-webkit-optimize-contrast',
            }}
            className="pointer-events-none rounded-full border-2 border-gold/90 shadow-[0_16px_40px_rgba(0,0,0,0.45),0_0_0_1px_rgba(255,255,255,0.4)_inset] z-30 overflow-hidden ring-4 ring-wine-dark/20 backdrop-brightness-105"
          >
            {/* Glass reflection highlight */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none" />
            
            {/* Center reticle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full border border-gold/50 pointer-events-none flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-gold/90" />
            </div>

            {/* HD Badge inside Lens */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-wine-darker/80 backdrop-blur-sm border border-gold/40 text-[9px] font-jost font-semibold tracking-wider text-gold uppercase flex items-center gap-1 shadow">
              <Zap className="w-2.5 h-2.5 text-gold fill-gold" />
              Ultra HD
            </div>
          </motion.div>
        )}

        {/* Badge: New Arrival */}
        {product?.isNewArrival && (
          <span className="absolute top-4 left-4 bg-gold text-wine-dark font-jost text-[10px] tracking-[0.2em] font-semibold uppercase px-3 py-1.5 rounded-sm shadow-sm z-20 pointer-events-none">
            New
          </span>
        )}

        {/* Badge: Discount */}
        {hasDiscount && (
          <span
            className="absolute top-4 left-4 bg-wine text-cream-light font-jost text-[10px] tracking-[0.2em] font-semibold uppercase px-3 py-1.5 rounded-sm shadow-sm z-20 pointer-events-none"
            style={{ top: product?.isNewArrival ? '54px' : '16px' }}
          >
            -{Math.round((1 - product.discountPrice / product.price) * 100)}%
          </span>
        )}

        {/* Top Right Action Overlay (Fullscreen Hint) */}
        <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-cream-light/95 hover:bg-white text-wine-dark p-2 rounded-lg shadow-elegant border border-gold/20 flex items-center gap-1.5 text-xs font-jost">
            <Maximize2 className="w-3.5 h-3.5 text-wine" />
            <span className="hidden sm:inline text-[11px] font-medium tracking-wide">Deep Zoom</span>
          </div>
        </div>

        {/* Bottom Helper Bar on Image */}
        <div className="absolute bottom-3 inset-x-3 z-20 flex items-center justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="bg-wine-dark/75 backdrop-blur-sm text-cream-light text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-md shadow flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-gold" />
            Hover for Ultra-HD Magnifier • Click to inspect
          </span>
          <span className="bg-wine-dark/75 backdrop-blur-sm text-cream-light text-[10px] px-2 py-1 rounded-md shadow">
            {activeImage + 1} / {images.length || 1}
          </span>
        </div>

        {/* Left / Right Quick Arrows (for multi-image) */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-cream-light/90 hover:bg-white text-wine-dark shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextImage}
              aria-label="Next image"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-2 rounded-full bg-cream-light/90 hover:bg-white text-wine-dark shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail Bar */}
      {images.length > 1 && (
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveImage(i)}
              className={`aspect-square overflow-hidden rounded-lg border-2 transition-all duration-200 relative group ${
                activeImage === i
                  ? 'border-gold shadow-md ring-2 ring-gold/20 scale-[1.02]'
                  : 'border-neutral-200/90 hover:border-gold/50 opacity-80 hover:opacity-100 bg-neutral-50'
              }`}
            >
              <img
                src={img.url}
                alt={product?.name ? `${product.name} thumbnail ${i + 1}` : ''}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              {activeImage === i && (
                <div className="absolute bottom-0 inset-x-0 h-1 bg-gold" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
