import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, Search, Heart, Menu, ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import api from '../../utils/api';
import AnnouncementBar from './Navbar/AnnouncementBar';
import MobileDrawer from './Navbar/MobileDrawer';
import InstagramSearchModal from './Navbar/InstagramSearchModal';
import BottomNav from './BottomNav';

function IconBtn({ children, onClick, as: Tag = 'button', transparent, label, ...props }) {
  const cls = `relative p-2 sm:p-2.5 transition-colors duration-200 ${
    transparent
      ? 'text-[#FDFAF5]/90 hover:text-[#FDFAF5] drop-shadow-sm'
      : 'text-[#411B1E]/80 hover:text-[#6B2732]'
  }`;
  if (Tag === 'button') return <button onClick={onClick} className={cls} aria-label={label} {...props}>{children}</button>;
  return <Tag className={cls} aria-label={label} {...props}>{children}</Tag>;
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const user = useAuthStore(s => s.user);
  const logout = useAuthStore(s => s.logout);
  const cartCount = useCartStore(s => s.items.reduce((a, i) => a + i.quantity, 0));
  const { pathname } = useLocation();
  const dropdownTimer = useRef(null);

  const { data: catsData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    let prevScrolled = window.scrollY > 20;
    const onScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== prevScrolled) {
        prevScrolled = isScrolled;
        setScrolled(isScrolled);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isHome = pathname === '/';
  const transparent = isHome && !scrolled;

  const openDropdown = (id) => {
    clearTimeout(dropdownTimer.current);
    setActiveDropdown(id);
  };
  const closeDropdown = () => {
    dropdownTimer.current = setTimeout(() => setActiveDropdown(null), 180);
  };

  const cats = catsData?.categories?.slice(0, 6) || [];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-30 transition-all duration-300">
        <AnnouncementBar scrolled={scrolled} transparent={transparent} />

        <div
          className={`w-full transition-all duration-300 ${
            transparent
              ? 'bg-gradient-to-b from-black/60 via-black/25 to-transparent'
              : 'bg-white/98 backdrop-blur-md shadow-xs border-b border-neutral-200/80'
          }`}
        >
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">
            <div className={`flex items-center justify-between transition-all duration-300 ${scrolled ? 'h-16' : 'h-16 sm:h-20'}`}>
              
              {/* Desktop Left nav */}
              <nav className="hidden lg:flex items-center gap-7 flex-1">
                <div
                  className="relative"
                  onMouseEnter={() => openDropdown('collections')}
                  onMouseLeave={closeDropdown}
                >
                  <Link
                    to="/collections"
                    className={`nav-link flex items-center gap-1 transition-colors duration-200 ${
                      transparent ? 'text-[#FDFAF5] hover:text-[#D9B574] drop-shadow-sm' : 'text-[#411B1E] hover:text-[#6B2732]'
                    }`}
                  >
                    Collections
                    <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeDropdown === 'collections' ? 'rotate-180' : ''}`} />
                  </Link>
                  <AnimatePresence>
                    {activeDropdown === 'collections' && (
                      <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 6 }}
                        transition={{ duration: 0.18 }}
                        onMouseEnter={() => openDropdown('collections')}
                        onMouseLeave={closeDropdown}
                        className="absolute top-full left-0 mt-3 w-52 bg-[#FDFAF5] shadow-luxury border border-[#DDD0BC]/60 py-2 z-50 rounded-sm"
                      >
                        {cats.map(c => (
                          <Link
                            key={c._id}
                            to={`/collections?category=${c._id}`}
                            className="block px-5 py-2.5 text-[11px] font-jost tracking-[0.12em] uppercase text-[#411B1E]/75 hover:text-[#6B2732] hover:bg-[#FBF4E9] transition-colors duration-150"
                          >
                            {c.name}
                          </Link>
                        ))}
                        <div className="border-t border-[#DDD0BC]/40 mt-1 pt-1">
                          <Link to="/collections" className="block px-5 py-2.5 text-[11px] font-jost tracking-[0.12em] uppercase text-[#6B2732] font-medium hover:bg-[#FBF4E9] transition-colors">
                            All Collections →
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <Link to="/collections?newArrival=true" className={`nav-link transition-colors duration-200 ${transparent ? 'text-[#FDFAF5] hover:text-[#D9B574] drop-shadow-sm' : 'text-[#411B1E] hover:text-[#6B2732]'}`}>
                  New Arrivals
                </Link>
                <Link to="/collections?bestseller=true" className={`nav-link transition-colors duration-200 ${transparent ? 'text-[#FDFAF5] hover:text-[#D9B574] drop-shadow-sm' : 'text-[#411B1E] hover:text-[#6B2732]'}`}>
                  Bestsellers
                </Link>
                <Link to="/collections?occasion=wedding" className={`nav-link transition-colors duration-200 ${transparent ? 'text-[#FDFAF5] hover:text-[#D9B574] drop-shadow-sm' : 'text-[#411B1E] hover:text-[#6B2732]'}`}>
                  Bridal
                </Link>
              </nav>

              {/* Mobile Left Hamburger Menu Button (Mobile & Tablet ONLY) */}
              <div className="flex lg:hidden items-center flex-1 justify-start">
                <button
                  type="button"
                  onClick={() => setMobileOpen(true)}
                  className={`p-2 transition-colors duration-200 ${transparent ? 'text-[#FDFAF5]' : 'text-[#411B1E]'}`}
                  aria-label="Open menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </div>

              {/* Logo (Centered) */}
              <div className="shrink-0 flex justify-center">
                <Link to="/" className="block text-center select-none group">
                  <span className={`font-cormorant text-2xl sm:text-3xl font-light tracking-[0.38em] transition-colors duration-300 ${transparent ? 'text-[#FDFAF5] drop-shadow-sm group-hover:text-[#D9B574]' : 'text-[#6B2732] group-hover:text-[#411B1E]'}`}>
                    Tantvani
                  </span>
                  <span className={`block text-[8px] font-jost tracking-[0.55em] uppercase mt-0.5 transition-colors duration-300 ${transparent ? 'text-[#D9B574] drop-shadow-sm' : 'text-[#C99B4E]'}`}>
                    Luxury Sarees
                  </span>
                </Link>
              </div>

              {/* Desktop Right actions */}
              <div className="hidden lg:flex items-center gap-1 sm:gap-2 flex-1 justify-end">
                <nav className="hidden lg:flex items-center gap-7 mr-4">
                  <Link to="/about" className={`nav-link transition-colors duration-200 ${transparent ? 'text-[#FDFAF5] hover:text-[#D9B574] drop-shadow-sm' : 'text-[#411B1E] hover:text-[#6B2732]'}`}>
                    Our Story
                  </Link>
                </nav>

                <IconBtn onClick={() => setSearchOpen(true)} transparent={transparent} label="Search">
                  <Search className="w-[18px] h-[18px]" />
                </IconBtn>
                <IconBtn as={Link} to="/wishlist" transparent={transparent} label="Wishlist">
                  <Heart className="w-[18px] h-[18px]" />
                </IconBtn>
                <IconBtn as={Link} to={user ? '/account' : '/login'} transparent={transparent} label="Account">
                  <User className="w-[18px] h-[18px]" />
                </IconBtn>
                <div>
                  <IconBtn as={Link} to="/cart" transparent={transparent} label="Cart">
                    <span className="relative inline-flex items-center justify-center">
                      <ShoppingBag className="w-[18px] h-[18px]" />
                      <AnimatePresence>
                        {cartCount > 0 && (
                          <motion.span
                            key={cartCount}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                            className="absolute -top-1.5 -right-2 bg-[#C99B4E] text-[#411B1E] text-[9px] font-jost font-bold w-[16px] h-[16px] rounded-full flex items-center justify-center leading-none shadow-sm pointer-events-none ring-1 ring-[#FDFAF5]/60"
                          >
                            {cartCount > 9 ? '9+' : cartCount}
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                  </IconBtn>
                </div>
              </div>

              {/* Mobile Right Profile Icon (Mobile & Tablet ONLY) */}
              <div className="flex lg:hidden items-center flex-1 justify-end">
                <Link
                  to={user ? '/account' : '/login'}
                  className={`p-2 transition-colors duration-200 ${transparent ? 'text-[#FDFAF5]' : 'text-[#411B1E]'}`}
                  aria-label="Account"
                >
                  <User className="w-6 h-6" />
                </Link>
              </div>

            </div>
          </div>
        </div>
      </header>

      {!isHome && <div className="h-[104px] sm:h-[116px]" />}

      {/* Instagram-Style Explore & Search Modal */}
      <InstagramSearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />

      {/* Mobile Drawer (Hamburger Menu) */}
      <MobileDrawer
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        cats={cats}
        user={user}
        logout={logout}
      />

      {/* Bottom Glass Navigation Bar (Mobile & Tablet ONLY) */}
      <BottomNav
        onOpenSearch={() => setSearchOpen(prev => !prev)}
        isSearchOpen={searchOpen}
        onCloseSearch={() => setSearchOpen(false)}
      />
    </>
  );
}
