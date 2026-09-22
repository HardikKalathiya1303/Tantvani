import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingBag, ArrowRight, Plus, Minus } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

export default function CartPage() {
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const subtotal = items.reduce((sum, i) => sum + (i.discountPrice || i.price) * i.quantity, 0);
  const shipping = subtotal >= 2000 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  const handleCheckout = () => {
    if (!user) { navigate('/login?redirect=/checkout'); return; }
    navigate('/checkout');
  };

  if (items.length === 0) return (
    <div className="pb-24 min-h-screen flex items-center justify-center bg-cream">
      <div className="text-center max-w-md px-4">
        <div className="w-20 h-20 border border-cream-darker mx-auto mb-6 flex items-center justify-center">
          <ShoppingBag className="w-8 h-8 text-wine-dark/25" />
        </div>
        <h2 className="font-cormorant text-3xl sm:text-4xl text-wine-dark mb-4">Your bag is empty</h2>
        <p className="body-sm mb-8">Discover our handcrafted sarees and add your favourites.</p>
        <Link to="/collections" className="btn-primary">Explore Collections</Link>
      </div>
    </div>
  );

  return (
    <div className="pb-24 min-h-screen bg-cream">
      <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <div className="flex items-baseline justify-between mb-10 sm:mb-12">
          <div>
            <p className="eyebrow mb-2">Your</p>
            <h1 className="font-cormorant text-3xl sm:text-4xl font-light text-wine-dark">
              Shopping Bag <span className="text-wine-dark/40">({items.length})</span>
            </h1>
          </div>
          <button onClick={clearCart} className="font-jost text-[10px] tracking-[0.2em] uppercase text-wine-dark/40 hover:text-wine underline transition-colors">
            Clear all
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Items */}
          <div className="lg:col-span-2 space-y-5 sm:space-y-6">
            <AnimatePresence>
              {items.map(item => (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -24, transition: { duration: 0.2 } }}
                  className="flex gap-4 sm:gap-6 pb-5 sm:pb-6 border-b border-cream-darker/40"
                >
                  <Link to={`/product/${item.slug}`} className="shrink-0">
                    <div className="w-24 h-32 sm:w-28 sm:h-36 overflow-hidden bg-cream-dark">
                      {item.images?.[0] ? (
                        <img src={item.images[0].url} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-wine" />
                      )}
                    </div>
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        {item.category && (
                          <p className="font-jost text-[9px] tracking-[0.2em] uppercase text-gold mb-1">{item.category?.name}</p>
                        )}
                        <Link to={`/product/${item.slug}`}>
                          <h3 className="font-cormorant text-lg sm:text-xl text-wine-dark hover:text-wine transition-colors leading-snug">{item.name}</h3>
                        </Link>
                        {item.fabric && <p className="font-karla text-xs text-wine-dark/50 mt-1">{item.fabric}</p>}
                      </div>
                      <button onClick={() => removeItem(item._id)} className="text-wine-dark/30 hover:text-wine transition-colors shrink-0 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between mt-3 sm:mt-4">
                      <div className="flex items-center border border-cream-darker/60">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="px-3 py-2 hover:bg-cream-dark transition-colors"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3 h-3 text-wine-dark/60" />
                        </button>
                        <span className="px-4 py-2 font-karla text-sm border-x border-cream-darker/60 min-w-[36px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="px-3 py-2 hover:bg-cream-dark transition-colors"
                          aria-label="Increase"
                        >
                          <Plus className="w-3 h-3 text-wine-dark/60" />
                        </button>
                      </div>
                      <div className="text-right">
                        <p className="font-cormorant text-xl text-wine">
                          ₹{((item.discountPrice || item.price) * item.quantity).toLocaleString('en-IN')}
                        </p>
                        {item.discountPrice && item.discountPrice < item.price && (
                          <p className="font-karla text-xs text-wine-dark/35 line-through">
                            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link to="/collections" className="btn-ghost inline-flex items-center justify-center gap-2 sm:justify-start">
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-cream-light border border-cream-darker/40 p-6 sm:p-8 lg:sticky lg:top-36">
              <h3 className="font-cormorant text-2xl text-wine-dark mb-6">Order Summary</h3>

              {subtotal < 2000 && (
                <div className="bg-gold/10 border border-gold/25 px-4 py-3 mb-6">
                  <p className="font-karla text-xs text-wine-dark/70 leading-relaxed">
                    Add <strong className="text-wine">₹{(2000 - subtotal).toLocaleString('en-IN')}</strong> more for free shipping!
                  </p>
                  <div className="mt-2 h-1 bg-cream-dark rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gold rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((subtotal / 2000) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-3 text-sm border-b border-cream-darker/40 pb-5 mb-5">
                <div className="flex justify-between font-karla">
                  <span className="text-wine-dark/55">Subtotal ({items.length} items)</span>
                  <span className="text-wine-dark">₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-karla">
                  <span className="text-wine-dark/55">Shipping</span>
                  <span className={shipping === 0 ? 'text-gold font-medium' : 'text-wine-dark'}>
                    {shipping === 0 ? 'Free' : `₹${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between font-karla">
                  <span className="text-wine-dark/55">GST (5%)</span>
                  <span className="text-wine-dark">₹{tax.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline mb-7">
                <span className="font-jost text-[10px] tracking-[0.22em] uppercase text-wine-dark/60">Total</span>
                <span className="font-cormorant text-3xl text-wine">₹{total.toLocaleString('en-IN')}</span>
              </div>

              <button onClick={handleCheckout} className="btn-primary w-full flex items-center justify-center gap-2">
                Proceed to Checkout <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <div className="flex items-center justify-center gap-6 mt-6 pt-5 border-t border-cream-darker/30">
                {['100% Secure', '15-Day Returns', 'Authentic'].map(t => (
                  <p key={t} className="font-jost text-[9px] tracking-[0.15em] uppercase text-wine-dark/35">{t}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
