import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { X, Sparkles, Tag, ArrowRight, Check } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { trackEvent } from '../../utils/analytics';
import api from '../../utils/api';
import toast from 'react-hot-toast';

export default function ExitIntentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const items = useCartStore((s) => s.items);
  const navigate = useNavigate();

  // Fetch dynamic exit intent settings configured by admin
  const { data } = useQuery({
    queryKey: ['exit-intent-settings'],
    queryFn: () => api.get('/exit-intent').then((r) => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const settings = data?.settings;

  useEffect(() => {
    // If disabled in admin panel, do nothing
    if (settings?.isActive === false) return;

    // Check if already displayed in this browser session
    const hasShown = sessionStorage.getItem('tantvani_exit_modal_shown');
    if (hasShown) return;

    const handleMouseLeave = (e) => {
      // Trigger when mouse moves towards top of browser window (closing tab / url bar)
      if (e.clientY <= 12) {
        // If configured to only show when user has sarees in cart
        if (settings?.showOnlyWithCartItems && (!items || items.length === 0)) {
          return;
        }

        // Show once per session
        sessionStorage.setItem('tantvani_exit_modal_shown', 'true');
        setIsOpen(true);
        trackEvent('exit_intent_triggered', {
          coupon_offered: settings?.couponCode || 'TANTVANI10',
          cart_items_count: items?.length || 0,
        });
      }
    };

    // Attach only on desktop screens
    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
      document.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [settings, items]);

  if (!isOpen || !settings || settings.isActive === false) return null;

  const handleCopyAndClaim = () => {
    if (settings.couponCode) {
      navigator.clipboard?.writeText(settings.couponCode);
      setCopied(true);
      toast.success(`Coupon "${settings.couponCode}" copied to clipboard!`, {
        style: { fontFamily: 'Jost', fontSize: '12px' },
      });
    }

    trackEvent('exit_intent_claimed', {
      coupon: settings.couponCode,
      destination: settings.buttonLink || '/checkout',
    });

    setIsOpen(false);
    navigate(settings.buttonLink || '/checkout');
  };

  const handleClose = () => {
    trackEvent('exit_intent_dismissed', {
      coupon: settings.couponCode,
    });
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-[#2A0D10]/70 backdrop-blur-sm"
        />

        {/* Luxury Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-lg bg-[#FDFAF5] rounded-2xl overflow-hidden shadow-2xl border-2 border-gold/40 z-10"
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-white/80 hover:bg-white text-wine-dark flex items-center justify-center transition-all shadow-xs"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Saree Banner Image */}
          {settings.imageUrl && (
            <div className="relative h-44 sm:h-52 w-full overflow-hidden bg-wine-darker/10">
              <img
                src={settings.imageUrl}
                alt="Heirloom Saree"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#FDFAF5] via-transparent to-black/30" />

              {/* Discount Badge */}
              {settings.discountBadge && (
                <span className="absolute top-3 left-3 bg-wine text-white font-jost text-[10px] tracking-widest font-bold uppercase px-3 py-1 rounded-sm shadow-sm flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-gold" />
                  {settings.discountBadge}
                </span>
              )}
            </div>
          )}

          {/* Modal Body */}
          <div className="p-6 sm:p-7 text-center space-y-4">
            <div className="space-y-1.5">
              <span className="font-jost text-[10px] tracking-[0.25em] uppercase text-gold font-bold block">
                Exclusive Opportunity
              </span>
              <h3 className="font-cormorant text-2xl sm:text-3xl font-light text-wine-dark leading-snug">
                {settings.heading}
              </h3>
              <p className="font-karla text-xs sm:text-sm text-wine-dark/70 leading-relaxed max-w-sm mx-auto">
                {settings.subheading}
              </p>
            </div>

            {/* Coupon Box */}
            {settings.couponCode && (
              <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white border border-gold/60 rounded-xl shadow-xs">
                <Tag className="w-4 h-4 text-gold" />
                <span className="font-jost text-xs tracking-wider uppercase text-neutral-500 font-semibold">
                  Use Code:
                </span>
                <span className="font-jost text-sm font-bold text-wine tracking-widest">
                  {settings.couponCode}
                </span>
                {copied && <Check className="w-4 h-4 text-emerald-600 ml-1" />}
              </div>
            )}

            {/* CTA Button */}
            <div className="pt-2">
              <button
                onClick={handleCopyAndClaim}
                className="w-full py-4 bg-wine hover:bg-wine-light text-white font-jost text-xs sm:text-sm font-bold uppercase tracking-widest rounded-xl transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                <span>{settings.buttonText}</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            <p className="font-karla text-[10px] text-neutral-400">
              Valid for this browsing session • Handcrafted silk mark verified
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
