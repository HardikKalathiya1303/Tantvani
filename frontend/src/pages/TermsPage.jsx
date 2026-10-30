import { motion } from 'framer-motion';

const sections = [
  {
    title: 'Acceptance of Terms',
    content: `By accessing and using the DhagaRatan website (dhagaratan.com), you agree to be bound by these Terms of Service. If you do not agree, please do not use our services. We reserve the right to update these terms at any time.`,
  },
  {
    title: 'Products and Pricing',
    content: `All products displayed are handcrafted and may have minor variations in colour, weave, or dimensions — this is a characteristic of authentic handloom textiles, not a defect. Prices are in Indian Rupees (INR) and include all applicable taxes. We reserve the right to change prices without prior notice.`,
  },
  {
    title: 'Orders and Payment',
    content: `Orders are confirmed once payment is successfully processed. We accept UPI, credit/debit cards, and net banking via Razorpay. Cash on Delivery (COD) is available on select pin codes. In the event of payment failure, the order will not be placed and no amount will be charged.`,
  },
  {
    title: 'Cancellations',
    content: `Orders can be cancelled within 12 hours of placement. After 12 hours, cancellations are not accepted as the item may have already entered preparation. COD orders cancelled after dispatch may attract a fee. For online payments, approved cancellations will be refunded to the original payment method.`,
  },
  {
    title: 'Shipping and Delivery',
    content: `Delivery times are estimates and not guaranteed. DhagaRatan is not responsible for delays caused by courier partners, natural events, or government restrictions. Risk of loss passes to you upon delivery. Please inspect your order upon receipt and report issues within 48 hours.`,
  },
  {
    title: 'Intellectual Property',
    content: `All content on this website — including text, images, logos, and design — is the property of DhagaRatan and is protected by copyright law. You may not reproduce, distribute, or use any content without our written permission.`,
  },
  {
    title: 'User Accounts',
    content: `You are responsible for maintaining the confidentiality of your account credentials. You agree not to share your account with others. We reserve the right to suspend accounts engaged in fraudulent activity, abuse, or violations of these terms.`,
  },
  {
    title: 'Limitation of Liability',
    content: `DhagaRatan's total liability for any claim arising from these terms or your use of our services shall not exceed the amount you paid for the relevant order. We are not liable for indirect, incidental, or consequential damages.`,
  },
  {
    title: 'Governing Law',
    content: `These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Varanasi, Uttar Pradesh.`,
  },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-cream">
      <section className="bg-gradient-hero py-20 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="font-jost text-[10px] tracking-[0.4em] uppercase text-secondary mb-3">DhagaRatan</p>
          <h1 className="font-cormorant text-5xl sm:text-6xl font-light text-cream-light">Terms of Service</h1>
          <p className="font-karla text-cream-light/50 text-xs mt-3">Last updated: October 2026</p>
        </motion.div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <div className="space-y-6">
          {sections.map(({ title, content }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-white border border-wine-dark/10 rounded-2xl p-6">
              <h2 className="font-jost font-bold text-sm tracking-wide uppercase text-wine-dark mb-3">{title}</h2>
              <p className="font-karla text-sm text-wine-dark/65 leading-relaxed">{content}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 bg-wine-dark/5 border border-wine-dark/10 rounded-2xl p-6">
          <p className="font-karla text-sm text-wine-dark/65">
            For questions about these terms, contact us at{' '}
            <a href="mailto:care@dhagaratan.com" className="text-wine font-semibold">care@dhagaratan.com</a>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
