import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Instagram, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-wine-dark text-cream-light/80">
      {/* Newsletter */}
      <div className="border-b border-cream-light/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <p className="font-jost text-xs tracking-[0.3em] uppercase text-secondary mb-3">Join the Heritage Circle</p>
          <h3 className="font-cormorant text-4xl font-light text-cream-light mb-6">Stay Woven in Culture</h3>
          <p className="font-karla text-sm text-cream-light/50 mb-8 max-w-md mx-auto">
            Subscribe for exclusive collections, heritage stories, and artisan spotlights.
          </p>
          <form className="flex max-w-md mx-auto gap-3">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 bg-cream-light/10 border border-cream-light/20 px-5 py-3 text-sm font-karla text-cream-light placeholder:text-cream-light/30 focus:outline-none focus:border-secondary transition-colors"
            />
            <button type="submit" className="bg-secondary text-wine-dark px-6 py-3 font-jost text-xs tracking-[0.2em] uppercase hover:bg-secondary-light transition-colors duration-200">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h2 className="font-cormorant text-3xl tracking-[0.3em] text-cream-light mb-2">Tantvani</h2>
            <p className="font-jost text-[10px] tracking-[0.4em] uppercase text-secondary mb-5">Luxury Sarees</p>
            <p className="font-karla text-sm text-cream-light/50 leading-relaxed mb-6">
              Where ancient weaving traditions meet contemporary elegance. Each saree tells a story of heritage, craft, and timeless beauty.
            </p>
            <div className="flex gap-4">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 border border-cream-light/20 flex items-center justify-center hover:border-secondary hover:text-secondary transition-colors duration-200">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Collections */}
          <div>
            <h4 className="font-jost text-xs tracking-[0.3em] uppercase text-cream-light mb-6">Collections</h4>
            <ul className="space-y-3">
              {['Silk Sarees', 'Banarasi', 'Kanjivaram', 'Chanderi', 'Linen', 'Cotton'].map(item => (
                <li key={item}>
                  <Link to={`/collections?search=${item.toLowerCase()}`} className="font-karla text-sm text-cream-light/50 hover:text-cream-light transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-jost text-xs tracking-[0.3em] uppercase text-cream-light mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {[['About Us', '/about'], ['Our Story', '/about#story'], ['Artisans', '/about#artisans'], ['Shipping Policy', '/shipping'], ['Return Policy', '/returns'], ['Contact', '/contact']].map(([label, href]) => (
                <li key={href}>
                  <Link to={href} className="font-karla text-sm text-cream-light/50 hover:text-cream-light transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-jost text-xs tracking-[0.3em] uppercase text-cream-light mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                <span className="font-karla text-sm text-cream-light/50">123 Silk Route, Varanasi, Uttar Pradesh 221001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-secondary shrink-0" />
                <span className="font-karla text-sm text-cream-light/50">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-secondary shrink-0" />
                <span className="font-karla text-sm text-cream-light/50">care@tantvani.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-cream-light/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-karla text-xs text-cream-light/30">© 2024 Tantvani. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
              <a key={item} href="#" className="font-karla text-xs text-cream-light/30 hover:text-cream-light/60 transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
