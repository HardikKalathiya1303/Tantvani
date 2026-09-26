import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function MobileDrawer({ mobileOpen, setMobileOpen, cats, user, logout }) {
  return (
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
  );
}
