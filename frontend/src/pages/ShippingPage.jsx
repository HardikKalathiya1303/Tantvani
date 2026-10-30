import { motion } from 'framer-motion';
import { Truck, Clock, MapPin, Shield, Package, RefreshCw } from 'lucide-react';

const sections = [
  {
    Icon: Truck,
    title: 'Free Shipping',
    content: 'We offer free shipping on all orders above ₹2,000 across India. For orders below ₹2,000, a flat shipping fee of ₹99 applies.',
  },
  {
    Icon: Clock,
    title: 'Delivery Timeline',
    content: 'Standard delivery takes 5–8 business days. Express delivery (2–3 days) is available for select pin codes at an additional charge of ₹199.',
  },
  {
    Icon: MapPin,
    title: 'Shipping Coverage',
    content: 'We ship to all major cities and towns across India. Enter your pincode at checkout to check availability for your area.',
  },
  {
    Icon: Shield,
    title: 'Safe Packaging',
    content: 'Every saree is carefully folded, wrapped in tissue, and packed in a premium box to ensure it reaches you in pristine condition.',
  },
  {
    Icon: Package,
    title: 'Order Tracking',
    content: 'Once your order is dispatched, you will receive an AWB number and courier details. Track your order anytime from My Account → Orders.',
  },
  {
    Icon: RefreshCw,
    title: 'Delayed Shipments',
    content: 'In rare cases of delay due to weather or logistics issues, our team will proactively notify you via email and WhatsApp.',
  },
];

export default function ShippingPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="bg-gradient-hero py-20 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="font-jost text-[10px] tracking-[0.4em] uppercase text-secondary mb-3">DhagaRatan</p>
          <h1 className="font-cormorant text-5xl sm:text-6xl font-light text-cream-light">Shipping Policy</h1>
        </motion.div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-16">
          {sections.map(({ Icon, title, content }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white border border-wine-dark/10 rounded-2xl p-6"
            >
              <div className="w-10 h-10 bg-cream rounded-full flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-wine" />
              </div>
              <h3 className="font-jost font-bold text-sm tracking-wide uppercase text-wine-dark mb-2">{title}</h3>
              <p className="font-karla text-sm text-wine-dark/65 leading-relaxed">{content}</p>
            </motion.div>
          ))}
        </div>

        {/* Rates table */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="bg-white border border-wine-dark/10 rounded-2xl p-6 sm:p-8 mb-10">
          <h2 className="font-jost text-xs tracking-[0.3em] uppercase text-wine-dark mb-6">Shipping Rates</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-cream-darker/20">
                  <th className="font-jost text-[10px] tracking-widest uppercase text-wine-dark/50 pb-3 pr-6">Order Value</th>
                  <th className="font-jost text-[10px] tracking-widest uppercase text-wine-dark/50 pb-3 pr-6">Standard (5–8 days)</th>
                  <th className="font-jost text-[10px] tracking-widest uppercase text-wine-dark/50 pb-3">Express (2–3 days)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-darker/10">
                {[
                  ['Below ₹2,000', '₹99', '₹299'],
                  ['₹2,000 – ₹5,000', 'FREE', '₹199'],
                  ['Above ₹5,000', 'FREE', '₹199'],
                ].map(([range, std, exp]) => (
                  <tr key={range}>
                    <td className="font-karla text-sm text-wine-dark py-3 pr-6">{range}</td>
                    <td className="font-karla text-sm text-wine py-3 pr-6 font-semibold">{std}</td>
                    <td className="font-karla text-sm text-wine-dark/70 py-3">{exp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="bg-wine-dark/5 border border-wine-dark/10 rounded-2xl p-6">
          <p className="font-karla text-sm text-wine-dark/70 leading-relaxed">
            For any shipping-related queries, write to us at <a href="mailto:care@dhagaratan.com" className="text-wine font-semibold">care@dhagaratan.com</a> or WhatsApp us at <a href="tel:+919876543210" className="text-wine font-semibold">+91 98765 43210</a>. We respond within 24 hours on working days.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
