import { motion } from 'framer-motion';
import { RotateCcw, CheckCircle, XCircle, AlertCircle, Clock, CreditCard } from 'lucide-react';

const eligible = [
  'Item received is damaged or defective',
  'Wrong item delivered',
  'Item significantly different from product description',
  'Item missing from order',
];

const notEligible = [
  'Item has been used or washed',
  'Tags and packaging removed',
  'Return requested after 7 days of delivery',
  'Custom or personalised orders',
  'Sale or discounted items (unless defective)',
];

export default function ReturnsPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <section className="bg-gradient-hero py-20 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="font-jost text-[10px] tracking-[0.4em] uppercase text-secondary mb-3">DhagaRatan</p>
          <h1 className="font-cormorant text-5xl sm:text-6xl font-light text-cream-light">Returns & Exchanges</h1>
        </motion.div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-8">

        {/* Policy summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white border border-wine-dark/10 rounded-2xl p-6 sm:p-8">
          <div className="flex gap-4 items-start">
            <div className="w-10 h-10 bg-cream rounded-full flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5 text-wine" />
            </div>
            <div>
              <h2 className="font-jost font-bold text-sm tracking-wide uppercase text-wine-dark mb-2">7-Day Return Policy</h2>
              <p className="font-karla text-sm text-wine-dark/65 leading-relaxed">
                We accept returns within <strong>7 days</strong> of delivery for eligible items. Once your return is approved and the item is received, refunds are processed within 5–7 business days to your original payment method.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Eligible / Not eligible */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border border-wine-dark/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <h3 className="font-jost font-bold text-sm tracking-wide uppercase text-wine-dark">Eligible for Return</h3>
            </div>
            <ul className="space-y-2.5">
              {eligible.map(item => (
                <li key={item} className="flex gap-2 font-karla text-sm text-wine-dark/70">
                  <span className="text-green-500 mt-0.5 shrink-0">✓</span>{item}
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-white border border-wine-dark/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <XCircle className="w-5 h-5 text-red-500" />
              <h3 className="font-jost font-bold text-sm tracking-wide uppercase text-wine-dark">Not Eligible</h3>
            </div>
            <ul className="space-y-2.5">
              {notEligible.map(item => (
                <li key={item} className="flex gap-2 font-karla text-sm text-wine-dark/70">
                  <span className="text-red-400 mt-0.5 shrink-0">✗</span>{item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* How to return */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white border border-wine-dark/10 rounded-2xl p-6 sm:p-8">
          <h2 className="font-jost text-xs tracking-[0.3em] uppercase text-wine-dark mb-6">How to Initiate a Return</h2>
          <div className="space-y-5">
            {[
              { step: '01', title: 'Contact Us', desc: 'Email care@dhagaratan.com with your order ID and reason for return. Attach photos of the item.' },
              { step: '02', title: 'Approval', desc: 'We will review and respond within 24–48 hours with approval or next steps.' },
              { step: '03', title: 'Ship Back', desc: 'Pack the item in its original packaging and ship to the address we provide. Use a trackable courier.' },
              { step: '04', title: 'Refund', desc: 'Once we receive and inspect the item, your refund is processed in 5–7 business days.' },
            ].map(({ step, title, desc }) => (
              <div key={step} className="flex gap-5">
                <span className="font-cormorant text-3xl text-wine/20 leading-none w-8 shrink-0">{step}</span>
                <div>
                  <p className="font-jost font-bold text-sm text-wine-dark mb-1">{title}</p>
                  <p className="font-karla text-sm text-wine-dark/60">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Refund timeline */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white border border-wine-dark/10 rounded-2xl p-6">
            <div className="flex gap-3 items-start">
              <CreditCard className="w-5 h-5 text-wine shrink-0 mt-0.5" />
              <div>
                <h3 className="font-jost font-bold text-sm tracking-wide uppercase text-wine-dark mb-2">Refund Methods</h3>
                <ul className="space-y-1.5 font-karla text-sm text-wine-dark/65">
                  <li>Online payments → Original payment method</li>
                  <li>COD orders → Bank transfer (NEFT)</li>
                  <li>Store credit available on request</li>
                </ul>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="bg-white border border-wine-dark/10 rounded-2xl p-6">
            <div className="flex gap-3 items-start">
              <Clock className="w-5 h-5 text-wine shrink-0 mt-0.5" />
              <div>
                <h3 className="font-jost font-bold text-sm tracking-wide uppercase text-wine-dark mb-2">Refund Timeline</h3>
                <ul className="space-y-1.5 font-karla text-sm text-wine-dark/65">
                  <li>Credit/Debit Card: 5–7 days</li>
                  <li>UPI / Net Banking: 2–3 days</li>
                  <li>Bank Transfer: 7–10 days</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="bg-amber-50 border border-amber-200 rounded-2xl p-5 flex gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <p className="font-karla text-sm text-amber-800 leading-relaxed">
            Return shipping costs are borne by the customer unless the item is defective or incorrect. We recommend using a tracked courier and keeping the receipt.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
