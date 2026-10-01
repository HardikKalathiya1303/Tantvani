import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Sparkles } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-[calc(100vh-140px)] flex flex-col lg:flex-row items-center justify-center bg-[#FDFAF5]">
      {/* Decorative left panel for Desktop */}
      <div className="hidden lg:flex w-1/2 min-h-screen bg-gradient-hero relative overflow-hidden flex-col items-center justify-center p-16">
        <div className="absolute inset-0 opacity-[0.06]">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className="absolute border border-cream-light/20 rounded-full"
              style={{ width: `${80 + i * 70}px`, height: `${80 + i * 70}px`, top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
            />
          ))}
        </div>
        <div className="relative z-10 text-center">
          <h1 className="font-cormorant text-5xl font-light text-cream-light tracking-[0.35em] mb-3">Tantvani</h1>
          <p className="font-jost text-[9px] tracking-[0.55em] uppercase text-gold mb-16">Luxury Sarees</p>
          <div className="w-px h-24 bg-gradient-to-b from-transparent via-cream-light/25 to-transparent mx-auto mb-16" />
          <blockquote className="font-cormorant text-2xl font-light italic text-cream-light/75 max-w-xs leading-relaxed">
            "Every saree is a canvas where heritage and artistry meet in perfect harmony."
          </blockquote>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex-1 w-full flex items-center justify-center px-4 py-4 sm:py-8 pb-20 lg:pb-8">
        <div className="w-full max-w-md bg-white sm:bg-white/80 sm:backdrop-blur-md p-5 sm:p-8 rounded-2xl border border-neutral-200/80 shadow-xs">
          <div className="text-center mb-5 sm:mb-6">
            <span className="font-jost text-[10px] tracking-[0.25em] uppercase text-[#C99B4E] font-bold flex items-center justify-center gap-1.5 mb-1">
              <Sparkles className="w-3 h-3 text-[#C99B4E]" />
              Luxury Heritage
            </span>
            <h2 className="font-cormorant text-2xl sm:text-3xl font-light text-[#411B1E] tracking-tight">{title}</h2>
            <p className="font-karla text-xs sm:text-sm text-neutral-500 mt-0.5">{subtitle}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const { login, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      toast.success('Welcome back!');
      navigate(redirect);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your Tantvani account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-jost text-[10px] tracking-[0.2em] uppercase text-[#411B1E]/70 font-bold block mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            required
            className="w-full px-4 py-2.5 sm:py-3 text-sm font-karla bg-neutral-50/70 border border-neutral-300 rounded-xl focus:bg-white focus:border-[#6B2732] focus:ring-1 focus:ring-[#6B2732] outline-none transition-all"
            placeholder="your@email.com"
          />
        </div>
        <div>
          <label className="font-jost text-[10px] tracking-[0.2em] uppercase text-[#411B1E]/70 font-bold block mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
              className="w-full pl-4 pr-11 py-2.5 sm:py-3 text-sm font-karla bg-neutral-50/70 border border-neutral-300 rounded-xl focus:bg-white focus:border-[#6B2732] focus:ring-1 focus:ring-[#6B2732] outline-none transition-all"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#411B1E] p-1"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full py-3 sm:py-3.5 px-6 bg-[#6B2732] hover:bg-[#411B1E] text-white font-jost text-xs sm:text-sm font-bold uppercase tracking-widest rounded-xl transition-all shadow-md disabled:opacity-60 mt-2"
        >
          {isLoading ? 'Signing in…' : 'Sign In'}
        </motion.button>
      </form>
      <p className="text-center mt-5 font-karla text-xs sm:text-sm text-neutral-500">
        New to Tantvani?{' '}
        <Link to={`/register${redirect !== '/' ? `?redirect=${redirect}` : ''}`} className="text-[#6B2732] hover:underline font-bold">
          Create account
        </Link>
      </p>
    </AuthLayout>
  );
}

export function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '' });
  const [showPass, setShowPass] = useState(false);
  const { register: reg, isLoading } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await reg(form.name, form.email, form.password, form.phone);
      toast.success('Welcome to Tantvani!');
      navigate(redirect);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  const f = key => e => setForm(prev => ({ ...prev, [key]: e.target.value }));

  return (
    <AuthLayout title="Join Tantvani" subtitle="Create your account to begin your journey">
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {[
          ['name', 'Full Name', 'text', 'Your full name'],
          ['email', 'Email Address', 'email', 'your@email.com'],
          ['phone', 'Mobile (Optional)', 'tel', '+91 98765 43210'],
        ].map(([key, label, type, ph]) => (
          <div key={key}>
            <label className="font-jost text-[10px] tracking-[0.2em] uppercase text-[#411B1E]/70 font-bold block mb-1">
              {label}
            </label>
            <input
              type={type}
              value={form[key]}
              onChange={f(key)}
              required={key !== 'phone'}
              className="w-full px-4 py-2.5 text-sm font-karla bg-neutral-50/70 border border-neutral-300 rounded-xl focus:bg-white focus:border-[#6B2732] focus:ring-1 focus:ring-[#6B2732] outline-none transition-all"
              placeholder={ph}
            />
          </div>
        ))}
        <div>
          <label className="font-jost text-[10px] tracking-[0.2em] uppercase text-[#411B1E]/70 font-bold block mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              value={form.password}
              onChange={f('password')}
              required
              minLength={6}
              className="w-full pl-4 pr-11 py-2.5 text-sm font-karla bg-neutral-50/70 border border-neutral-300 rounded-xl focus:bg-white focus:border-[#6B2732] focus:ring-1 focus:ring-[#6B2732] outline-none transition-all"
              placeholder="Min. 6 characters"
            />
            <button
              type="button"
              onClick={() => setShowPass(!showPass)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#411B1E] p-1"
            >
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="font-jost text-[10px] tracking-[0.2em] uppercase text-[#411B1E]/70 font-bold block mb-1">
            Confirm Password
          </label>
          <input
            type={showPass ? 'text' : 'password'}
            value={form.confirm}
            onChange={f('confirm')}
            required
            className="w-full px-4 py-2.5 text-sm font-karla bg-neutral-50/70 border border-neutral-300 rounded-xl focus:bg-white focus:border-[#6B2732] focus:ring-1 focus:ring-[#6B2732] outline-none transition-all"
            placeholder="Repeat password"
          />
        </div>
        <motion.button
          type="submit"
          disabled={isLoading}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full py-3 sm:py-3.5 px-6 bg-[#6B2732] hover:bg-[#411B1E] text-white font-jost text-xs sm:text-sm font-bold uppercase tracking-widest rounded-xl transition-all shadow-md disabled:opacity-60 mt-2"
        >
          {isLoading ? 'Creating account…' : 'Create Account'}
        </motion.button>
      </form>
      <p className="text-center mt-5 font-karla text-xs sm:text-sm text-neutral-500">
        Already have an account?{' '}
        <Link to="/login" className="text-[#6B2732] hover:underline font-bold">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
