import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Save,
  Eye,
  CheckCircle2,
  X,
  Tag,
  ShoppingBag,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
  ShieldCheck,
} from 'lucide-react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export default function ExitIntentPage() {
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    isActive: true,
    heading: "Wait! Don't Leave Your Saree Behind",
    subheading: 'Complete your order now and enjoy an exclusive handcrafted discount on your heirloom weave.',
    discountBadge: 'FLAT 10% OFF',
    couponCode: 'TANTVANI10',
    buttonText: 'Claim Offer & Checkout',
    buttonLink: '/checkout',
    showOnlyWithCartItems: true,
    imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
  });

  const { data, isLoading } = useQuery({
    queryKey: ['exit-intent-settings'],
    queryFn: () => api.get('/exit-intent').then((r) => r.data),
  });

  useEffect(() => {
    if (data?.settings) {
      setForm({
        isActive: data.settings.isActive ?? true,
        heading: data.settings.heading || "Wait! Don't Leave Your Saree Behind",
        subheading: data.settings.subheading || '',
        discountBadge: data.settings.discountBadge || 'FLAT 10% OFF',
        couponCode: data.settings.couponCode || 'TANTVANI10',
        buttonText: data.settings.buttonText || 'Claim Offer & Checkout',
        buttonLink: data.settings.buttonLink || '/checkout',
        showOnlyWithCartItems: data.settings.showOnlyWithCartItems ?? true,
        imageUrl: data.settings.imageUrl || '',
      });
    }
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: (updatedForm) => api.put('/exit-intent', updatedForm),
    onSuccess: () => {
      queryClient.invalidateQueries(['exit-intent-settings']);
      toast.success('Exit Intent Popup settings saved successfully!');
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || 'Failed to save settings');
    },
  });

  const handleChange = (key) => (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm((prev) => ({ ...prev, [key]: val }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    saveMutation.mutate(form);
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-wine border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-lg bg-wine/10 text-wine">
              <Sparkles className="w-4 h-4" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold font-jost text-gray-900 tracking-tight">
              Exit-Intent "Don't Leave" Popup
            </h1>
          </div>
          <p className="text-xs sm:text-sm font-karla text-gray-500">
            Zara & Myntra style exit popup that triggers when desktop visitors move their mouse to leave. Configurable directly from this panel without hardcoded text!
          </p>
        </div>

        {/* Global Toggle Status Button */}
        <button
          type="button"
          onClick={() => setForm((p) => ({ ...p, isActive: !p.isActive }))}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-jost text-xs font-bold uppercase tracking-wider transition-all ${
            form.isActive
              ? 'bg-emerald-600 text-white shadow-sm hover:bg-emerald-700'
              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          {form.isActive ? (
            <>
              <ToggleRight className="w-5 h-5 text-emerald-200" />
              <span>Popup is ACTIVE (Live)</span>
            </>
          ) : (
            <>
              <ToggleLeft className="w-5 h-5 text-gray-400" />
              <span>Popup is PAUSED (Off)</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Form Settings */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-xs">
          <h2 className="font-jost text-sm font-bold uppercase tracking-widest text-gray-800 pb-3 border-b border-gray-100 flex items-center justify-between">
            <span>Popup Content Settings</span>
            <span className="text-[11px] font-normal font-karla text-gray-400">All fields update live in preview</span>
          </h2>

          {/* Heading */}
          <div className="space-y-1.5">
            <label className="block font-jost text-xs font-bold tracking-wider uppercase text-gray-700">
              Popup Heading
            </label>
            <input
              type="text"
              value={form.heading}
              onChange={handleChange('heading')}
              required
              placeholder="e.g. Wait! Don't Leave Your Saree Behind"
              className="w-full px-4 py-2.5 text-sm font-karla border border-gray-300 rounded-xl focus:border-wine focus:ring-1 focus:ring-wine outline-none transition-all"
            />
          </div>

          {/* Subheading */}
          <div className="space-y-1.5">
            <label className="block font-jost text-xs font-bold tracking-wider uppercase text-gray-700">
              Subheading / Description
            </label>
            <textarea
              rows={2}
              value={form.subheading}
              onChange={handleChange('subheading')}
              placeholder="Explain the offer or urge the customer to complete their order..."
              className="w-full px-4 py-2.5 text-sm font-karla border border-gray-300 rounded-xl focus:border-wine focus:ring-1 focus:ring-wine outline-none transition-all"
            />
          </div>

          {/* Discount Badge & Coupon Code */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block font-jost text-xs font-bold tracking-wider uppercase text-gray-700">
                Discount Badge Tag
              </label>
              <input
                type="text"
                value={form.discountBadge}
                onChange={handleChange('discountBadge')}
                placeholder="e.g. FLAT 10% OFF or EXTRA ₹500"
                className="w-full px-4 py-2.5 text-sm font-karla border border-gray-300 rounded-xl focus:border-wine focus:ring-1 focus:ring-wine outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-jost text-xs font-bold tracking-wider uppercase text-gray-700">
                Coupon Code
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={form.couponCode}
                  onChange={handleChange('couponCode')}
                  placeholder="e.g. TANTVANI10"
                  className="w-full pl-9 pr-3 py-2.5 text-sm font-jost font-bold uppercase tracking-wider border border-gray-300 rounded-xl focus:border-wine focus:ring-1 focus:ring-wine outline-none transition-all text-wine"
                />
              </div>
            </div>
          </div>

          {/* Button Text & Button Link */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block font-jost text-xs font-bold tracking-wider uppercase text-gray-700">
                Call to Action Button Text
              </label>
              <input
                type="text"
                value={form.buttonText}
                onChange={handleChange('buttonText')}
                placeholder="e.g. Claim Offer & Checkout"
                className="w-full px-4 py-2.5 text-sm font-karla border border-gray-300 rounded-xl focus:border-wine focus:ring-1 focus:ring-wine outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block font-jost text-xs font-bold tracking-wider uppercase text-gray-700">
                Button Redirect Link
              </label>
              <input
                type="text"
                value={form.buttonLink}
                onChange={handleChange('buttonLink')}
                placeholder="e.g. /checkout or /cart"
                className="w-full px-4 py-2.5 text-sm font-karla border border-gray-300 rounded-xl focus:border-wine focus:ring-1 focus:ring-wine outline-none transition-all"
              />
            </div>
          </div>

          {/* Saree Image URL */}
          <div className="space-y-1.5">
            <label className="block font-jost text-xs font-bold tracking-wider uppercase text-gray-700">
              Popup Saree Image URL
            </label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={handleChange('imageUrl')}
              placeholder="https://... image link"
              className="w-full px-4 py-2.5 text-sm font-karla border border-gray-300 rounded-xl focus:border-wine focus:ring-1 focus:ring-wine outline-none transition-all"
            />
          </div>

          {/* Behaviour Toggle: Show only with Cart items */}
          <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="font-jost text-xs font-bold tracking-wide uppercase text-gray-800">
                Show Only When Customer Has Items In Cart
              </p>
              <p className="font-karla text-xs text-gray-500">
                Highly recommended: Prevents showing discount to users who haven't even picked a saree yet.
              </p>
            </div>
            <input
              type="checkbox"
              id="showOnlyWithCartItems"
              checked={form.showOnlyWithCartItems}
              onChange={handleChange('showOnlyWithCartItems')}
              className="w-5 h-5 accent-wine rounded cursor-pointer"
            />
          </div>

          {/* Save Button */}
          <div className="pt-4 border-t border-gray-200 flex justify-end">
            <button
              type="submit"
              disabled={saveMutation.isLoading}
              className="px-8 py-3 bg-wine hover:bg-wine-light text-white font-jost text-xs font-bold uppercase tracking-widest rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saveMutation.isLoading ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>

        {/* Right Side: Live Interactive Desktop Preview */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-jost text-xs font-bold tracking-widest uppercase text-gray-500 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-gray-400" /> Live Customer Screen Preview
            </h3>
            <span className="text-[10px] font-jost font-semibold uppercase px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
              Desktop Modal
            </span>
          </div>

          {/* Simulated Browser Viewport with Luxury Modal inside */}
          <div className="bg-gray-800/90 p-4 sm:p-6 rounded-2xl border border-gray-300 shadow-2xl relative overflow-hidden backdrop-blur-md">
            {/* Close hint */}
            <div className="absolute top-3 right-3 text-white/50 hover:text-white cursor-pointer p-1 rounded-full bg-white/10">
              <X className="w-3.5 h-3.5" />
            </div>

            {/* Simulated Luxury Exit Modal Card */}
            <div className="bg-[#FDFAF5] rounded-xl overflow-hidden border border-[#D9B574]/40 shadow-xl">
              {/* Image banner */}
              {form.imageUrl && (
                <div className="h-32 sm:h-36 w-full relative overflow-hidden bg-wine-darker/10">
                  <img src={form.imageUrl} alt="Saree Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#FDFAF5] via-transparent to-black/20" />
                  {form.discountBadge && (
                    <span className="absolute top-2.5 left-2.5 bg-wine text-white font-jost text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-sm shadow-xs">
                      {form.discountBadge}
                    </span>
                  )}
                </div>
              )}

              {/* Text content */}
              <div className="p-4 sm:p-5 text-center space-y-3">
                <div className="space-y-1">
                  <h4 className="font-cormorant text-lg sm:text-xl font-bold text-[#411B1E] leading-tight">
                    {form.heading || "Wait! Don't Leave Your Saree Behind"}
                  </h4>
                  <p className="font-karla text-xs text-gray-600 leading-relaxed max-w-xs mx-auto">
                    {form.subheading || 'Complete your order now and enjoy an exclusive discount on your weave.'}
                  </p>
                </div>

                {/* Coupon Code Pill */}
                {form.couponCode && (
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-[#D9B574] rounded-lg shadow-2xs">
                    <span className="font-jost text-[10px] tracking-wider uppercase text-gray-500">Code:</span>
                    <span className="font-jost text-xs font-bold text-wine tracking-widest">{form.couponCode}</span>
                  </div>
                )}

                {/* CTA Button */}
                <button
                  type="button"
                  className="w-full py-2.5 bg-wine hover:bg-wine-light text-white font-jost text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm"
                >
                  {form.buttonText || 'Claim Offer & Checkout'}
                </button>

                <p className="font-karla text-[10px] text-gray-400">
                  Offer valid for this session only • Instant applied at checkout
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
