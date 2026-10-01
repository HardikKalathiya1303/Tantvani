import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, Search, LayoutGrid, Heart, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';

export default function BottomNav({ onOpenSearch, isSearchOpen, onCloseSearch }) {
  const location = useLocation();
  const cartCount = useCartStore((s) => s.items.reduce((a, i) => a + i.quantity, 0));
  const user = useAuthStore((s) => s.user);
  const wishlistCount = user?.wishlist?.length || 0;

  const currentPath = location.pathname;

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      to: '/',
      isActive: !isSearchOpen && currentPath === '/',
    },
    {
      id: 'search',
      label: 'Explore',
      icon: Search,
      onClick: onOpenSearch,
      isActive: isSearchOpen,
    },
    {
      id: 'collections',
      label: 'Collections',
      icon: LayoutGrid,
      to: '/collections',
      isActive: !isSearchOpen && currentPath === '/collections',
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      icon: Heart,
      to: '/wishlist',
      badge: wishlistCount,
      isActive: !isSearchOpen && currentPath === '/wishlist',
    },
    {
      id: 'cart',
      label: 'Bag',
      icon: ShoppingBag,
      to: '/cart',
      badge: cartCount,
      isActive: !isSearchOpen && currentPath === '/cart',
    },
  ];

  return (
    <nav
      aria-label="Mobile Bottom Navigation"
      className="fixed bottom-0 left-0 right-0 z-[60] lg:hidden bg-white/90 backdrop-blur-2xl border-t border-neutral-200/80 shadow-[0_-4px_25px_rgba(0,0,0,0.06)] px-1 py-1 safe-area-inset-bottom"
    >
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const content = (
            <div
              className={`relative flex flex-col items-center justify-center h-12 w-16 px-1 rounded-xl transition-all duration-200 ${
                item.isActive
                  ? 'bg-[#6B2732]/8 text-[#6B2732]'
                  : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              {/* Active Top Accent Line */}
              {item.isActive && (
                <motion.div
                  layoutId="activeBottomLine"
                  className="absolute top-0 w-7 h-[2px] bg-[#6B2732] rounded-full"
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}

              <div className="relative flex items-center justify-center">
                <Icon
                  className={`w-[21px] h-[21px] transition-all duration-200 ${
                    item.isActive
                      ? 'text-[#6B2732] stroke-[2.3px] scale-105'
                      : 'text-neutral-500 stroke-[1.8px]'
                  }`}
                />

                {/* Live Count Badge */}
                {item.badge > 0 && (
                  <AnimatePresence>
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -top-1.5 -right-2.5 bg-[#C99B4E] text-[#411B1E] text-[9px] font-jost font-bold w-4 h-4 rounded-full flex items-center justify-center leading-none shadow-xs ring-1.5 ring-white"
                    >
                      {item.badge > 9 ? '9+' : item.badge}
                    </motion.span>
                  </AnimatePresence>
                )}
              </div>

              <span
                className={`text-[9.5px] font-jost uppercase tracking-wider mt-0.5 leading-tight transition-colors duration-200 ${
                  item.isActive
                    ? 'text-[#6B2732] font-bold'
                    : 'text-neutral-500 font-medium'
                }`}
              >
                {item.label}
              </span>
            </div>
          );

          if (item.onClick) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={item.onClick}
                className="focus:outline-none select-none"
              >
                {content}
              </button>
            );
          }

          return (
            <Link
              key={item.id}
              to={item.to}
              onClick={onCloseSearch}
              className="focus:outline-none select-none"
            >
              {content}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
