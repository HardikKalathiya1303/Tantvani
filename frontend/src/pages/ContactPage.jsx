import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Instagram, Facebook, Youtube } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill all required fields');
      return;
    }
    setSending(true);
    // Open mailto as fallback (backend email not yet wired)
    const mailto = `mailto:care@dhagaratan.com?subject=${encodeURIComponent(form.subject || 'Enquiry from ' + form.name)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
    window.location.href = mailto;
    toast.success('Opening your email client...');
    setSending(false);
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="bg-gradient-hero py-20 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="font-jost text-[10px] tracking-[0.4em] uppercase text-secondary mb-3">DhagaRatan</p>
          <h1 className="font-cormorant text-5xl sm:text-6xl font-light text-cream-light">Get in Touch</h1>
          <p className="font-karla text-cream-light/60 mt-3 text-sm">We'd love to hear from you</p>
        </motion.div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact info */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="font-cormorant text-3xl text-wine-dark mb-8">Contact Information</h2>
            <div className="space-y-6 mb-10">
              {[
                { Icon: MapPin, label: 'Address', value: '123 Silk Route, Varanasi, Uttar Pradesh 221001, India' },
                { Icon: Phone, label: 'Phone / WhatsApp', value: '+91 98765 43210' },
                { Icon: Mail, label: 'Email', value: 'care@dhagaratan.com' },
                { Icon: Clock, label: 'Support Hours', value: 'Mon – Sat, 10 AM – 6 PM IST' },
              ].map(({ Icon, label, value }) => (
                <div key={label} className="flex gap-4">
                  <div className="w-10 h-10 bg-white border border-wine-dark/10 rounded-full flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-wine" />
                  </div>
                  <div>
                    <p className="font-jost text-[10px] tracking-widest uppercase text-wine-dark/40 mb-0.5">{label}</p>
                    <p className="font-karla text-sm text-wine-dark">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <p className="font-jost text-[10px] tracking-widest uppercase text-wine-dark/40 mb-4">Follow Us</p>
              <div className="flex gap-3">
                {[
                  { Icon: Instagram, href: '#', label: 'Instagram' },
                  { Icon: Facebook, href: '#', label: 'Facebook' },
                  { Icon: Youtube, href: '#', label: 'YouTube' },
                ].map(({ Icon, href, label }) => (
                  <a key={label} href={href} aria-label={label} className="w-10 h-10 bg-white border border-wine-dark/10 rounded-full flex items-center justify-center hover:bg-wine hover:border-wine hover:text-cream-light transition-colors text-wine-dark/60">
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact form */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.1 }}>
            <div className="bg-white border border-wine-dark/10 rounded-2xl p-6 sm:p-8">
              <h2 className="font-jost text-xs tracking-[0.3em] uppercase text-wine-dark mb-6">Send a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="font-jost text-[10px] tracking-widest uppercase text-wine-dark/50 block mb-2">Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="Your name"
                      className="w-full border border-wine-dark/15 rounded-xl px-4 py-3 font-karla text-sm text-wine-dark placeholder:text-wine-dark/30 focus:outline-none focus:border-wine bg-cream/50"
                    />
                  </div>
                  <div>
                    <label className="font-jost text-[10px] tracking-widest uppercase text-wine-dark/50 block mb-2">Email *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="your@email.com"
                      className="w-full border border-wine-dark/15 rounded-xl px-4 py-3 font-karla text-sm text-wine-dark placeholder:text-wine-dark/30 focus:outline-none focus:border-wine bg-cream/50"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-jost text-[10px] tracking-widest uppercase text-wine-dark/50 block mb-2">Subject</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={e => setForm(p => ({ ...p, subject: e.target.value }))}
                    placeholder="How can we help?"
                    className="w-full border border-wine-dark/15 rounded-xl px-4 py-3 font-karla text-sm text-wine-dark placeholder:text-wine-dark/30 focus:outline-none focus:border-wine bg-cream/50"
                  />
                </div>
                <div>
                  <label className="font-jost text-[10px] tracking-widest uppercase text-wine-dark/50 block mb-2">Message *</label>
                  <textarea
                    rows={5}
                    value={form.message}
                    onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                    placeholder="Tell us what's on your mind..."
                    className="w-full border border-wine-dark/15 rounded-xl px-4 py-3 font-karla text-sm text-wine-dark placeholder:text-wine-dark/30 focus:outline-none focus:border-wine bg-cream/50 resize-none"
                  />
                </div>
                <button type="submit" disabled={sending} className="btn-primary w-full">
                  {sending ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
