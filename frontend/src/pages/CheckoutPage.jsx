import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useMutation } from '@tanstack/react-query';
import { CheckCircle, Banknote, CreditCard, Smartphone, Building2 } from 'lucide-react';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import api from '../utils/api';
import toast from 'react-hot-toast';

const STEPS = ['Shipping', 'Payment', 'Confirmed'];

const PAYMENT_OPTIONS = [
  { id: 'cod', Icon: Banknote, label: 'Cash on Delivery', sub: 'Pay when your order arrives' },
  { id: 'card', Icon: CreditCard, label: 'Credit / Debit Card', sub: 'Visa, Mastercard, RuPay' },
  { id: 'upi', Icon: Smartphone, label: 'UPI', sub: 'GPay, PhonePe, Paytm' },
  { id: 'netbanking', Icon: Building2, label: 'Net Banking', sub: 'All major Indian banks' },
];

export default function CheckoutPage() {
  const [step, setStep] = useState(0);
  const [orderId, setOrderId] = useState(null);
  const [address, setAddress] = useState({
    name: '', phone: '', street: '', city: '', state: '', pincode: '', country: 'India',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const { items, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const subtotal = items.reduce((s, i) => s + (i.discountPrice || i.price) * i.quantity, 0);
  const shipping = subtotal >= 2000 ? 0 : 99;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;

  const orderMutation = useMutation({
    mutationFn: () => api.post('/orders', {
      orderItems: items.map(i => ({ product: i._id, quantity: i.quantity })),
      shippingAddress: address,
      paymentMethod,
    }),
    onSuccess: ({ data }) => {
      setOrderId(data.order._id);
      clearCart();
      setStep(2);
    },
    onError: err => toast.error(err.response?.data?.message || 'Could not place order. Please try again.'),
  });

  const af = key => e => setAddress(a => ({ ...a, [key]: e.target.value }));

  const validateAddress = () => {
    const required = ['name', 'phone', 'street', 'city', 'state', 'pincode'];
    for (const k of required) {
      if (!address[k]?.trim()) {
        toast.error(`Please enter ${k.charAt(0).toUpperCase() + k.slice(1)}`);
        return false;
      }
    }
    return true;
  };

  return (
    <div className="pb-24 min-h-screen bg-cream">
      <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <div className="text-center mb-10 sm:mb-12">
          <p className="eyebrow mb-3">Secure Checkout</p>
          <h1 className="font-cormorant text-3xl sm:text-4xl font-light text-wine-dark">Complete Your Order</h1>
        </div>

        {/* Stepper */}
        <div className="flex items-center justify-center mb-10 sm:mb-12">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center">
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 flex items-center justify-center text-[11px] font-jost border transition-all duration-300 ${
                  i < step ? 'bg-gold border-gold text-wine-dark' :
                  i === step ? 'bg-wine border-wine text-cream-light' :
                  'border-cream-darker text-wine-dark/30'
                }`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`font-jost text-[10px] tracking-[0.2em] uppercase hidden sm:block ${i === step ? 'text-wine-dark' : 'text-wine-dark/40'}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-12 sm:w-20 h-px mx-2 transition-colors duration-500 ${i < step ? 'bg-gold' : 'bg-cream-darker/50'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Step 0: Shipping */}
            {step === 0 && (
              <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="font-cormorant text-2xl text-wine-dark mb-6">Delivery Address</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    ['name', 'Full Name', ''],
                    ['phone', 'Phone Number', ''],
                    ['street', 'Street / Area', 'sm:col-span-2'],
                    ['city', 'City', ''],
                    ['state', 'State', ''],
                    ['pincode', 'Pincode', ''],
                    ['country', 'Country', ''],
                  ].map(([key, label, cls]) => (
                    <div key={key} className={cls}>
                      <label className="font-jost text-[10px] tracking-[0.22em] uppercase text-wine-dark/55 block mb-2">{label}</label>
                      <input
                        type={key === 'pincode' ? 'tel' : 'text'}
                        value={address[key]}
                        onChange={af(key)}
                        className="input-field"
                        maxLength={key === 'pincode' ? 6 : undefined}
                      />
                    </div>
                  ))}
                </div>
                <button onClick={() => validateAddress() && setStep(1)} className="btn-primary mt-8">
                  Continue to Payment
                </button>
              </motion.div>
            )}

            {/* Step 1: Payment */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}>
                <h3 className="font-cormorant text-2xl text-wine-dark mb-6">Payment Method</h3>
                <div className="space-y-3">
                  {PAYMENT_OPTIONS.map(({ id, Icon, label, sub }) => (
                    <label
                      key={id}
                      className={`flex items-center gap-4 p-4 sm:p-5 border-2 cursor-pointer transition-all duration-200 ${paymentMethod === id ? 'border-wine bg-wine/5' : 'border-cream-darker/50 hover:border-wine/40'}`}
                    >
                      <input type="radio" name="payment" value={id} checked={paymentMethod === id} onChange={() => setPaymentMethod(id)} className="sr-only" />
                      <div className={`w-10 h-10 flex items-center justify-center border ${paymentMethod === id ? 'border-wine bg-wine/10 text-wine' : 'border-cream-darker text-wine-dark/40'}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        <p className="font-jost text-[11px] tracking-[0.15em] uppercase text-wine-dark">{label}</p>
                        <p className="font-karla text-xs text-wine-dark/50 mt-0.5">{sub}</p>
                      </div>
                      {paymentMethod === id && (
                        <div className="w-5 h-5 bg-wine flex items-center justify-center shrink-0">
                          <span className="text-cream-light text-[10px]">✓</span>
                        </div>
                      )}
                    </label>
                  ))}
                </div>
                <div className="flex gap-4 mt-8">
                  <button onClick={() => setStep(0)} className="btn-outline">Back</button>
                  <button
                    onClick={() => orderMutation.mutate()}
                    disabled={orderMutation.isPending}
                    className="btn-primary flex-1 disabled:opacity-60"
                  >
                    {orderMutation.isPending ? 'Placing…' : `Place Order — ₹${total.toLocaleString('en-IN')}`}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Confirmation */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-12 sm:py-16"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-gold/15 flex items-center justify-center">
                  <CheckCircle className="w-10 h-10 text-gold" />
                </div>
                <h3 className="font-cormorant text-3xl sm:text-4xl text-wine-dark mb-4">Order Confirmed!</h3>
                <p className="body-sm mb-2">Thank you, <strong>{user?.name}</strong>.</p>
                <p className="body-sm mb-8 text-wine-dark/40">Order #{orderId?.slice(-8).toUpperCase()}</p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button onClick={() => navigate('/account')} className="btn-primary">Track Order</button>
                  <button onClick={() => navigate('/collections')} className="btn-outline">Continue Shopping</button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Order summary */}
          {step < 2 && (
            <div className="lg:col-span-1">
              <div className="bg-cream-light border border-cream-darker/40 p-5 sm:p-6 lg:sticky lg:top-36">
                <h4 className="font-cormorant text-xl text-wine-dark mb-5">Your Order</h4>
                <div className="space-y-4 max-h-60 overflow-y-auto scrollbar-hide mb-5">
                  {items.map(item => (
                    <div key={item._id} className="flex gap-3">
                      <div className="w-14 h-18 overflow-hidden bg-cream-dark shrink-0">
                        {item.images?.[0] ? (
                          <img src={item.images[0].url} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-gradient-wine" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-cormorant text-sm leading-snug line-clamp-2 text-wine-dark">{item.name}</p>
                        <p className="font-karla text-xs text-wine-dark/50 mt-0.5">Qty: {item.quantity}</p>
                        <p className="font-cormorant text-base text-wine mt-1">₹{((item.discountPrice || item.price) * item.quantity).toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-cream-darker/40 pt-4 space-y-2.5">
                  {[
                    ['Subtotal', `₹${subtotal.toLocaleString('en-IN')}`],
                    ['Shipping', shipping === 0 ? 'Free' : `₹${shipping}`],
                    ['GST (5%)', `₹${tax.toLocaleString('en-IN')}`],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="font-karla text-sm text-wine-dark/55">{k}</span>
                      <span className={`font-karla text-sm ${k === 'Shipping' && shipping === 0 ? 'text-gold font-medium' : 'text-wine-dark'}`}>{v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between pt-3 border-t border-cream-darker/40">
                    <span className="font-jost text-[10px] tracking-[0.2em] uppercase text-wine-dark/60">Total</span>
                    <span className="font-cormorant text-2xl text-wine">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
