import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Move,
  Eye,
  Zap,
} from 'lucide-react';
import { getHdImageUrl, preloadHdImage } from '../../utils/imageHelper';

export default function ProductZoomModal({
  showZoom,
  setShowZoom,
  product,
  activeImage,
  setActiveImage,
}) {
  const [scale, setScale] = useState(1.8);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mode, setMode] = useState('pan'); // 'pan' | 'lens'
  const [lensPos, setLensPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const containerRef = useRef(null);
  const imageRef = useRef(null);

  const images = product?.images || [];
  const currentImage = images[activeImage]?.url || product?.image || '/placeholder-saree.jpg';
  const hdImageUrl = getHdImageUrl(currentImage, 3200, 95);

  // Lock body scroll when modal is open & reset zoom
  useEffect(() => {
    if (showZoom) {
      document.body.style.overflow = 'hidden';
      setScale(1.8);
      setPosition({ x: 0, y: 0 });
      setMode('pan');
      preloadHdImage(currentImage);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showZoom, activeImage, currentImage]);

  // Keyboard navigation
  useEffect(() => {
    if (!showZoom) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowZoom(false);
      } else if (e.key === 'ArrowRight') {
        if (setActiveImage && images.length > 1) {
          setActiveImage((prev) => (prev + 1) % images.length);
        }
      } else if (e.key === 'ArrowLeft') {
        if (setActiveImage && images.length > 1) {
          setActiveImage((prev) => (prev - 1 + images.length) % images.length);
        }
      } else if (e.key === '+' || e.key === '=') {
        handleZoomIn();
      } else if (e.key === '-' || e.key === '_') {
        handleZoomOut();
      } else if (e.key.toLowerCase() === 'r') {
        handleReset();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showZoom, images.length, setActiveImage]);

  const handleZoomIn = () => {
    setScale((s) => Math.min(4.5, Number((s + 0.5).toFixed(1))));
  };

  const handleZoomOut = () => {
    setScale((s) => {
      const next = Math.max(1, Number((s - 0.5).toFixed(1)));
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Mouse wheel zoom
  const handleWheel = (e) => {
    e.preventDefault();
    if (mode === 'lens') return;
    const delta = e.deltaY * -0.002;
    setScale((prev) => {
      const newScale = Math.min(Math.max(1, prev + delta), 4.5);
      if (newScale === 1) setPosition({ x: 0, y: 0 });
      return Number(newScale.toFixed(2));
    });
  };

  // Dragging logic for Pan mode
  const handleMouseDown = (e) => {
    if (mode !== 'pan' || scale <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e) => {
    if (mode === 'pan') {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    } else if (mode === 'lens' && imageRef.current) {
      const rect = imageRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setLensPos({ x, y, width: rect.width, height: rect.height });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e) => {
    if (e.touches.length === 1 && scale > 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - position.x, y: touch.clientY - position.y });
    }
  };

  const handleTouchMove = (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = () => {
    if (scale > 1.2) {
      handleReset();
    } else {
      setScale(2.5);
    }
  };

  const LENS_MODAL_SIZE = 240;
  const LENS_MODAL_RADIUS = LENS_MODAL_SIZE / 2;
  const LENS_ZOOM = 3.2;

  return (
    <AnimatePresence>
      {showZoom && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[120] bg-wine-darker/95 backdrop-blur-md flex flex-col select-none"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-gold/15 bg-wine-darker/60 backdrop-blur-sm z-20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-gold" />
              </div>
              <div>
                <h3 className="font-cormorant text-lg sm:text-xl text-cream-light font-medium truncate max-w-[200px] sm:max-w-md">
                  {product?.name}
                </h3>
                <div className="flex items-center gap-2">
                  <p className="font-jost text-[11px] text-cream-light/50 tracking-wider uppercase">
                    Ultra-HD Inspector • Image {activeImage + 1} of {images.length || 1}
                  </p>
                  <span className="px-1.5 py-0.2 bg-gold/20 text-gold text-[9px] font-jost rounded font-semibold tracking-wide">
                    4K ULTRA-HD
                  </span>
                </div>
              </div>
            </div>

            {/* Mode & Action Controls */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mode Toggle (Pan vs Rounded Loupe) */}
              <div className="hidden sm:flex items-center bg-cream-light/10 p-1 rounded-lg border border-gold/20">
                <button
                  onClick={() => {
                    setMode('pan');
                    setScale(1.8);
                  }}
                  className={`px-3 py-1 text-xs font-jost rounded-md transition-all flex items-center gap-1.5 ${
                    mode === 'pan'
                      ? 'bg-gold text-wine-dark font-semibold shadow'
                      : 'text-cream-light/70 hover:text-cream-light'
                  }`}
                  title="Drag & Pan Mode"
                >
                  <Move className="w-3.5 h-3.5" />
                  <span>Pan & Drag</span>
                </button>
                <button
                  onClick={() => {
                    setMode('lens');
                    setScale(1);
                    setPosition({ x: 0, y: 0 });
                  }}
                  className={`px-3 py-1 text-xs font-jost rounded-md transition-all flex items-center gap-1.5 ${
                    mode === 'lens'
                      ? 'bg-gold text-wine-dark font-semibold shadow'
                      : 'text-cream-light/70 hover:text-cream-light'
                  }`}
                  title="Amazon-style Rounded Lens"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Amazon Lens</span>
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowZoom(false)}
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-cream-light/10 hover:bg-cream-light/20 text-cream-light flex items-center justify-center transition-transform hover:scale-105 active:scale-95 border border-gold/20"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Zoom Area */}
          <div
            ref={containerRef}
            onWheel={handleWheel}
            className="flex-1 relative overflow-hidden flex items-center justify-center p-4 sm:p-8"
          >
            {/* Image Wrapper */}
            <div
              ref={imageRef}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onDoubleClick={handleDoubleClick}
              className={`relative max-h-[75vh] max-w-[85vw] flex items-center justify-center ${
                mode === 'pan' && scale > 1
                  ? isDragging
                    ? 'cursor-grabbing'
                    : 'cursor-grab'
                  : mode === 'lens'
                  ? 'cursor-crosshair'
                  : 'cursor-zoom-in'
              }`}
            >
              <img
                src={hdImageUrl}
                alt={product?.name || 'Zoomed product'}
                style={{
                  transform:
                    mode === 'pan'
                      ? `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`
                      : 'none',
                  transition: isDragging ? 'none' : 'transform 0.15s ease-out',
                  imageRendering: '-webkit-optimize-contrast',
                }}
                className="max-h-[75vh] max-w-[85vw] object-contain rounded-md select-none pointer-events-auto shadow-2xl"
                draggable={false}
              />

              {/* In-Modal Amazon-Style Circular Lens */}
              {mode === 'lens' && isHovered && lensPos.width > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.1 }}
                  style={{
                    position: 'absolute',
                    top: `${lensPos.y - LENS_MODAL_RADIUS}px`,
                    left: `${lensPos.x - LENS_MODAL_RADIUS}px`,
                    width: `${LENS_MODAL_SIZE}px`,
                    height: `${LENS_MODAL_SIZE}px`,
                    backgroundImage: `url("${hdImageUrl}")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: `${lensPos.width * LENS_ZOOM}px ${lensPos.height * LENS_ZOOM}px`,
                    backgroundPosition: `${-(lensPos.x * LENS_ZOOM - LENS_MODAL_RADIUS)}px ${-(lensPos.y * LENS_ZOOM - LENS_MODAL_RADIUS)}px`,
                    imageRendering: '-webkit-optimize-contrast',
                  }}
                  className="pointer-events-none rounded-full border-2 border-gold shadow-[0_18px_45px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.4)_inset] z-30 overflow-hidden ring-4 ring-gold/25"
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-white/35 pointer-events-none" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full border border-gold/50 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                  </div>
                </motion.div>
              )}
            </div>

            {/* Left / Right Nav Arrows */}
            {images.length > 1 && (
              <>
                <button
                  onClick={() => {
                    if (setActiveImage) {
                      setActiveImage((prev) => (prev - 1 + images.length) % images.length);
                      handleReset();
                    }
                  }}
                  className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-cream-light/15 hover:bg-gold hover:text-wine-dark text-cream-light backdrop-blur-sm border border-gold/20 transition-all hover:scale-110 active:scale-95 shadow-lg"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => {
                    if (setActiveImage) {
                      setActiveImage((prev) => (prev + 1) % images.length);
                      handleReset();
                    }
                  }}
                  className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 p-3 rounded-full bg-cream-light/15 hover:bg-gold hover:text-wine-dark text-cream-light backdrop-blur-sm border border-gold/20 transition-all hover:scale-110 active:scale-95 shadow-lg"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Bottom Floating Control Bar */}
          <div className="px-4 py-3 sm:py-4 border-t border-gold/15 bg-wine-darker/80 backdrop-blur-sm z-20 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Zoom Controls Pill */}
            <div className="flex items-center gap-1.5 bg-cream-light/10 p-1.5 rounded-full border border-gold/20">
              <button
                onClick={handleZoomOut}
                disabled={scale <= 1}
                className="w-8 h-8 rounded-full flex items-center justify-center text-cream-light hover:bg-cream-light/20 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                title="Zoom Out (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <div className="px-3 py-0.5 text-xs font-jost text-gold font-medium tracking-wider min-w-[52px] text-center">
                {Math.round(scale * 100)}%
              </div>

              <button
                onClick={handleZoomIn}
                disabled={scale >= 4.5}
                className="w-8 h-8 rounded-full flex items-center justify-center text-cream-light hover:bg-cream-light/20 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                title="Zoom In (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <div className="h-4 w-[1px] bg-gold/20 mx-1" />

              <button
                onClick={handleReset}
                className="px-2.5 py-1 text-[11px] font-jost tracking-wider uppercase text-cream-light/80 hover:text-gold transition-colors flex items-center gap-1"
                title="Reset Zoom (R)"
              >
                <RotateCcw className="w-3 h-3" />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>

            {/* Thumbnail Carousel */}
            {images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      if (setActiveImage) {
                        setActiveImage(i);
                        handleReset();
                      }
                    }}
                    className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImage === i
                        ? 'border-gold shadow-md ring-2 ring-gold/30 scale-105'
                        : 'border-white/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Hint & Tips */}
            <div className="hidden lg:flex items-center gap-3 text-[11px] font-jost text-cream-light/50">
              <span className="flex items-center gap-1 text-gold">
                <Zap className="w-3 h-3 fill-gold" /> Ultra-HD 4K
              </span>
              <span>•</span>
              <span>Scroll to zoom</span>
              <span>•</span>
              <span>Double-click to toggle</span>
              <span>•</span>
              <span>Esc to close</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
