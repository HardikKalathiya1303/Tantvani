import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex">
      {/* Decorative left panel */}
      <div className="hidden lg:flex w-1/2 bg-gradient-hero relative overflow-hidden flex-col items-center justify-center p-16">
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
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 bg-cream-light">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <Link to="/" className="lg:hidden inline-block mb-8">
              <span className="font-cormorant text-3xl tracking-[0.35em] text-wine">Tantvani</span>
            </Link>
            <h2 className="font-cormorant text-3xl sm:text-4xl font-light text-wine-dark">{title}</h2>
            <p className="font-karla text-sm text-wine-dark/50 mt-2">{subtitle}</p>
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
      toast.success('Welcome back!', { style: { fontFamily: 'Jost' } });
      navigate(redirect);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to your Tantvani account">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="font-jost text-[10px] tracking-[0.25em] uppercase text-wine-dark/55 block mb-2">Email</label>
          <input
            type="email" value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            required className="input-field" placeholder="your@email.com"
          />
        </div>
        <div>
          <label className="font-jost text-[10px] tracking-[0.25em] uppercase text-wine-dark/55 block mb-2">Password</label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'} value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required className="input-field pr-12" placeholder="••••••••"
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-wine-dark/40 hover:text-wine-dark">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <motion.button
          type="submit" disabled={isLoading}
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          className="btn-primary w-full disabled:opacity-60"
        >
          {isLoading ? 'Signing in…' : 'Sign In'}
        </motion.button>
      </form>
      <p className="text-center mt-6 font-karla text-sm text-wine-dark/50">
        New to Tantvani?{' '}
        <Link to={`/register${redirect !== '/' ? `?redirect=${redirect}` : ''}`} className="text-wine hover:underline font-medium">
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
    if (form.password !== form.confirm) { toast.error('Passwords do not match'); return; }
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
      <form onSubmit={handleSubmit} className="space-y-4">
        {[
          ['name', 'Full Name', 'text', 'Your full name'],
          ['email', 'Email', 'email', 'your@email.com'],
          ['phone', 'Phone (Optional)', 'tel', '+91 98765 43210'],
        ].map(([key, label, type, ph]) => (
          <div key={key}>
            <label className="font-jost text-[10px] tracking-[0.25em] uppercase text-wine-dark/55 block mb-2">{label}</label>
            <input type={type} value={form[key]} onChange={f(key)} required={key !== 'phone'} className="input-field" placeholder={ph} />
          </div>
        ))}
        <div>
          <label className="font-jost text-[10px] tracking-[0.25em] uppercase text-wine-dark/55 block mb-2">Password</label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'} value={form.password}
              onChange={f('password')} required minLength={6}
              className="input-field pr-12" placeholder="Min. 6 characters"
            />
            <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-wine-dark/40">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="font-jost text-[10px] tracking-[0.25em] uppercase text-wine-dark/55 block mb-2">Confirm Password</label>
          <input type={showPass ? 'text' : 'password'} value={form.confirm} onChange={f('confirm')} required className="input-field" placeholder="Repeat password" />
        </div>
        <motion.button
          type="submit" disabled={isLoading}
          whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
          className="btn-primary w-full mt-2 disabled:opacity-60"
        >
          {isLoading ? 'Creating account…' : 'Create Account'}
        </motion.button>
      </form>
      <p className="text-center mt-6 font-karla text-sm text-wine-dark/50">
        Already have an account?{' '}
        <Link to="/login" className="text-wine hover:underline font-medium">Sign in</Link>
      </p>
    </AuthLayout>
  );
}
