import { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuthStore } from './store/useAuthStore';
import { useCartStore } from './store/useCartStore';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/ScrollToTop';
import PageTransition from './components/PageTransition';

// Lazy loaded page components
const HomePage = lazy(() => import('./pages/HomePage'));
const CollectionsPage = lazy(() => import('./pages/CollectionsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const AccountPage = lazy(() => import('./pages/AccountPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));
const LoginPage = lazy(() => import('./pages/AuthPages').then(m => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('./pages/AuthPages').then(m => ({ default: m.RegisterPage })));

function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-cream relative">
      {/* Top loading bar */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-cream-darker/20 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-wine via-gold to-wine animate-[loading-bar_1.5s_ease-in-out_infinite] w-1/3" />
      </div>
      <div className="w-10 h-10 border-2 border-gold/30 border-t-wine rounded-full animate-spin mb-4" />
      <p className="font-jost text-[10px] tracking-[0.25em] uppercase text-wine-dark/50">Loading Tantvani...</p>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const user = useAuthStore(s => s.user);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const token = useAuthStore(s => s.token);
  const fetchMe = useAuthStore(s => s.fetchMe);
  const syncWithBackend = useCartStore(s => s.syncWithBackend);
  const location = useLocation();

  useEffect(() => {
    if (token) {
      fetchMe();
      syncWithBackend();
    }
  }, [token, fetchMe, syncWithBackend]);

  return (
    <Layout>
      <ScrollToTop />
      <AnimatePresence mode="wait">
        <Suspense fallback={<PageLoader />}>
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
            <Route path="/collections" element={<PageTransition><CollectionsPage /></PageTransition>} />
            <Route path="/product/:slug" element={<PageTransition><ProductDetailPage /></PageTransition>} />
            <Route path="/cart" element={<PageTransition><CartPage /></PageTransition>} />
            <Route path="/checkout" element={<ProtectedRoute><PageTransition><CheckoutPage /></PageTransition></ProtectedRoute>} />
            <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
            <Route path="/register" element={<PageTransition><RegisterPage /></PageTransition>} />
            <Route path="/account" element={<ProtectedRoute><PageTransition><AccountPage /></PageTransition></ProtectedRoute>} />
            <Route path="/account/orders" element={<ProtectedRoute><PageTransition><AccountPage /></PageTransition></ProtectedRoute>} />
            <Route path="/wishlist" element={<ProtectedRoute><PageTransition><WishlistPage /></PageTransition></ProtectedRoute>} />
            <Route path="/about" element={<PageTransition><AboutPage /></PageTransition>} />
            <Route path="*" element={
              <PageTransition>
                <div className="pb-24 min-h-screen flex items-center justify-center bg-cream">
                  <div className="text-center px-4">
                    <h1 className="font-cormorant text-8xl sm:text-9xl text-wine-dark/15 mb-4">404</h1>
                    <p className="font-cormorant text-3xl text-wine-dark mb-3">Page Not Found</p>
                    <p className="body-sm mb-8">The page you're looking for doesn't exist.</p>
                    <a href="/" className="btn-primary">Go Home</a>
                  </div>
                </div>
              </PageTransition>
            } />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </Layout>
  );
}

