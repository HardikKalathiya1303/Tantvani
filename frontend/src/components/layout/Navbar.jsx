import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, User, Search, Heart, Menu, X, ChevronDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '../../store/useAuthStore';
import { useCartStore } from '../../store/useCartStore';
import api from '../../utils/api';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const { user, logout } = useAuthStore();
  const cartCount = useCartStore(s => s.items.reduce((a, i) => a + i.quantity, 0));
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const searchRef = useRef(null);
  const dropdownTimer = useRef(null);

  const { data: catsData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setActiveDropdown(null);
  }, [pathname]);

  useEffect(() => {
    if (searchOpen) { setTimeout(() => searchRef.current?.focus(), 150); }
  }, [searchOpen]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const isHome = pathname === '/';
  const transparent = isHome && !scrolled;

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchQ.trim();
    if (q) { navigate(`/collections?search=${encodeURIComponent(q)}`); setSearchQ(''); setSearchOpen(false); }
  };

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
      {/* ─ Fixed Header Container (Announcement + Main Nav) ─ */}
      <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
        
        {/* ─ Announcement bar ─ */}
        <div
          className={`transition-all duration-300 overflow-hidden text-center text-[10px] font-jost tracking-[0.22em] uppercase ${
            scrolled
              ? 'max-h-0 py-0 opacity-0 pointer-events-none'
              : 'max-h-12 py-2 sm:py-2.5 opacity-100 ' + (transparent ? 'bg-[#2A0D10]/85 text-[#FDFAF5]/90 border-b border-white/10 backdrop-blur-sm' : 'bg-wine text-cream-light')
          }`}
        >
          FREE SHIPPING ON ORDERS ABOVE ₹2000 &nbsp;·&nbsp; AUTHENTIC HANDLOOM &nbsp;·&nbsp; 15-DAY RETURNS
        </div>

        {/* ─ Main navigation bar ─ */}
        <div
          className={`w-full transition-all duration-300 ${
            transparent
              ? 'bg-gradient-to-b from-black/60 via-black/25 to-transparent'
              : 'bg-[#FDFAF5] bg-opacity-98 backdrop-blur-md shadow-[0_4px_24px_-4px_rgba(65,27,30,0.12)] border-b border-[#DDD0BC]/70'
          }`}
        >
          <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-10">
            <div className={`flex items-center transition-all duration-300 ${scrolled ? 'h-16' : 'h-16 sm:h-20'}`}>

              {/* Left nav (desktop) */}
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
                    <ChevronDown
                      className={`w-3 h-3 transition-transform duration-200 ${
                        activeDropdown === 'collections' ? 'rotate-180' : ''
                      }`}
                    />
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
                          <Link
                            to="/collections"
                            className="block px-5 py-2.5 text-[11px] font-jost tracking-[0.12em] uppercase text-[#6B2732] font-medium hover:bg-[#FBF4E9] transition-colors"
                          >
                            All Collections →
                          </Link>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                <Link
                  to="/collections?newArrival=true"
                  className={`nav-link transition-colors duration-200 ${
                    transparent ? 'text-[#FDFAF5] hover:text-[#D9B574] drop-shadow-sm' : 'text-[#411B1E] hover:text-[#6B2732]'
                  }`}
                >
                  New Arrivals
                </Link>
                <Link
                  to="/collections?bestseller=true"
                  className={`nav-link transition-colors duration-200 ${
                    transparent ? 'text-[#FDFAF5] hover:text-[#D9B574] drop-shadow-sm' : 'text-[#411B1E] hover:text-[#6B2732]'
                  }`}
                >
                  Bestsellers
                </Link>
                <Link
                  to="/collections?occasion=wedding"
                  className={`nav-link transition-colors duration-200 ${
                    transparent ? 'text-[#FDFAF5] hover:text-[#D9B574] drop-shadow-sm' : 'text-[#411B1E] hover:text-[#6B2732]'
                  }`}
                >
                  Bridal
                </Link>
              </nav>

              {/* Logo (centered) */}
              <div className="flex-1 lg:flex-none flex justify-center lg:justify-center">
                <Link to="/" className="block text-center select-none group">
                  <span
                    className={`font-cormorant text-2xl sm:text-3xl font-light tracking-[0.38em] transition-colors duration-300 ${
                      transparent ? 'text-[#FDFAF5] drop-shadow-sm group-hover:text-[#D9B574]' : 'text-[#6B2732] group-hover:text-[#411B1E]'
                    }`}
                  >
                    Tantvani
                  </span>
                  <span
                    className={`block text-[8px] font-jost tracking-[0.55em] uppercase mt-0.5 transition-colors duration-300 ${
                      transparent ? 'text-[#D9B574] drop-shadow-sm' : 'text-[#C99B4E]'
                    }`}
                  >
                    Luxury Sarees
                  </span>
                </Link>
              </div>

              {/* Right actions */}
              <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-end">
                {/* Desktop extra links */}
                <nav className="hidden lg:flex items-center gap-7 mr-4">
                  <Link
                    to="/about"
                    className={`nav-link transition-colors duration-200 ${
                      transparent ? 'text-[#FDFAF5] hover:text-[#D9B574] drop-shadow-sm' : 'text-[#411B1E] hover:text-[#6B2732]'
                    }`}
                  >
                    Our Story
                  </Link>
                  <Link
                    to="/contact"
                    className={`nav-link transition-colors duration-200 ${
                      transparent ? 'text-[#FDFAF5] hover:text-[#D9B574] drop-shadow-sm' : 'text-[#411B1E] hover:text-[#6B2732]'
                    }`}
                  >
                    Contact
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

                {/* Mobile menu trigger */}
                <button
                  onClick={() => setMobileOpen(true)}
                  className={`lg:hidden ml-1 p-2 transition-colors duration-200 ${
                    transparent ? 'text-[#FDFAF5]' : 'text-[#411B1E]'
                  }`}
                  aria-label="Open menu"
                >
                  <Menu className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ─ Spacer (pushes content below fixed header + announcement on non-home pages) ─ */}
      {!isHome && <div className="h-[104px] sm:h-[116px]" />}

      {/* ─ Search overlay ─ */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex flex-col items-center justify-start pt-24 sm:pt-36 bg-[#2A0D10]/95 backdrop-blur-md px-4"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ delay: 0.05 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-2xl"
            >
              <form onSubmit={handleSearch} className="flex items-center border-b-2 border-[#FDFAF5]/30 pb-5">
                <Search className="w-5 h-5 sm:w-6 sm:h-6 text-[#FDFAF5]/50 shrink-0 mr-4" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQ}
                  onChange={e => setSearchQ(e.target.value)}
                  placeholder="Search sarees, fabrics, occasions…"
                  className="flex-1 bg-transparent text-[#FDFAF5] text-xl sm:text-3xl font-cormorant font-light placeholder:text-[#FDFAF5]/30 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="ml-4 text-[#FDFAF5]/50 hover:text-[#FDFAF5] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </form>
              <div className="mt-5 flex flex-wrap gap-3">
                {['Banarasi', 'Kanjivaram', 'Wedding', 'Silk', 'Chanderi'].map(s => (
                  <button
                    key={s}
                    onClick={() => {
                      setSearchQ(s);
                      navigate(`/collections?search=${s}`);
                      setSearchOpen(false);
                    }}
                    className="font-jost text-[10px] tracking-[0.18em] uppercase text-[#FDFAF5]/50 hover:text-[#FDFAF5] transition-colors border border-[#FDFAF5]/15 hover:border-[#FDFAF5]/40 px-4 py-2"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─ Mobile drawer ─ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-[#2A0D10]/60 backdrop-blur-xs"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 32, stiffness: 320 }}
              className="fixed top-0 right-0 bottom-0 z-[65] w-[85vw] max-w-sm bg-[#FDFAF5] flex flex-col shadow-luxury overflow-hidden border-l border-[#DDD0BC]/60"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-[#DDD0BC]/40">
                <span className="font-cormorant text-2xl tracking-[0.35em] text-[#6B2732]">Tantvani</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-[#411B1E]/60 hover:text-[#6B2732] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-y-auto py-4">
                {[
                  { label: 'Home', href: '/' },
                  { label: 'All Collections', href: '/collections' },
                  { label: 'New Arrivals', href: '/collections?newArrival=true' },
                  { label: 'Bestsellers', href: '/collections?bestseller=true' },
                  { label: 'Bridal', href: '/collections?occasion=wedding' },
                  { label: 'Our Story', href: '/about' },
                ].map(({ label, href }) => (
                  <Link
                    key={href}
                    to={href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-6 py-4 border-b border-[#DDD0BC]/30 font-jost text-[11px] tracking-[0.22em] uppercase text-[#411B1E]/80 hover:text-[#6B2732] hover:bg-[#FBF4E9] transition-colors"
                  >
                    {label}
                  </Link>
                ))}
                {cats.length > 0 && (
                  <div className="px-6 pt-4 pb-2">
                    <p className="eyebrow mb-3">Categories</p>
                    {cats.map(c => (
                      <Link
                        key={c._id}
                        to={`/collections?category=${c._id}`}
                        onClick={() => setMobileOpen(false)}
                        className="block py-2.5 font-karla text-sm text-[#411B1E]/65 hover:text-[#6B2732] transition-colors"
                      >
                        {c.name}
                      </Link>
                    ))}
                  </div>
                )}
              </nav>
              <div className="p-6 border-t border-[#DDD0BC]/40 space-y-3">
                {user ? (
                  <>
                    <Link
                      to="/account"
                      onClick={() => setMobileOpen(false)}
                      className="btn-primary w-full text-center block"
                    >
                      My Account
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMobileOpen(false);
                      }}
                      className="btn-outline w-full"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMobileOpen(false)}
                      className="btn-primary w-full text-center block"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setMobileOpen(false)}
                      className="btn-outline w-full text-center block"
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function IconBtn({ children, onClick, as: Tag = 'button', transparent, label, ...props }) {
  const cls = `relative p-2 sm:p-2.5 transition-colors duration-200 ${
    transparent
      ? 'text-[#FDFAF5]/90 hover:text-[#FDFAF5] drop-shadow-sm'
      : 'text-[#411B1E]/80 hover:text-[#6B2732]'
  }`;
  if (Tag === 'button') return <button onClick={onClick} className={cls} aria-label={label} {...props}>{children}</button>;
  return <Tag className={cls} aria-label={label} {...props}>{children}</Tag>;
}
