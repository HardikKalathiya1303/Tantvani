import { motion } from 'framer-motion';

const sections = [
  {
    title: 'Information We Collect',
    content: `We collect information you provide when you create an account, place an order, or contact us. This includes your name, email address, phone number, shipping address, and payment information. We also automatically collect certain technical information such as your IP address, browser type, and browsing behaviour on our site.`,
  },
  {
    title: 'How We Use Your Information',
    content: `Your information is used to process orders, communicate order updates, provide customer support, send promotional communications (with your consent), improve our website and services, and comply with legal obligations. We never sell your personal information to third parties.`,
  },
  {
    title: 'Information Sharing',
    content: `We share your information only with trusted partners necessary to fulfil your order — payment processors (Razorpay), shipping partners (Shiprocket), and cloud service providers (Cloudinary, MongoDB Atlas). All partners are bound by confidentiality agreements and are not permitted to use your data for their own purposes.`,
  },
  {
    title: 'Cookies',
    content: `We use cookies to maintain your session, remember your preferences, and analyse traffic. Essential cookies are always active. You can control optional cookies through your browser settings. Disabling cookies may affect certain features of our website.`,
  },
  {
    title: 'Data Security',
    content: `We use industry-standard SSL encryption for all data transmission. Passwords are hashed and never stored in plain text. Payment information is processed directly by Razorpay and never stored on our servers. We regularly review our security practices.`,
  },
  {
    title: 'Your Rights',
    content: `You have the right to access, correct, or delete your personal data. You may request a copy of your data, opt out of marketing communications, or ask us to delete your account by contacting care@dhagaratan.com. We will respond within 30 days.`,
  },
  {
    title: 'Data Retention',
    content: `We retain your personal data for as long as your account is active or as needed to provide services. Order data is retained for 7 years for tax and legal compliance. You may request deletion of marketing data at any time.`,
  },
  {
    title: 'Changes to This Policy',
    content: `We may update this policy from time to time. Significant changes will be communicated via email or a prominent notice on our website. Your continued use of our services after changes constitutes acceptance of the updated policy.`,
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-cream">
      <section className="bg-gradient-hero py-20 px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <p className="font-jost text-[10px] tracking-[0.4em] uppercase text-secondary mb-3">DhagaRatan</p>
          <h1 className="font-cormorant text-5xl sm:text-6xl font-light text-cream-light">Privacy Policy</h1>
          <p className="font-karla text-cream-light/50 text-xs mt-3">Last updated: October 2026</p>
        </motion.div>
      </section>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="font-karla text-sm text-wine-dark/65 leading-relaxed mb-10 bg-white border border-wine-dark/10 rounded-2xl p-6">
          At DhagaRatan, your privacy is important to us. This policy explains how we collect, use, and protect your personal information when you use our website and services.
        </motion.p>

        <div className="space-y-8">
          {sections.map(({ title, content }, i) => (
            <motion.div key={title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="bg-white border border-wine-dark/10 rounded-2xl p-6">
              <h2 className="font-jost font-bold text-sm tracking-wide uppercase text-wine-dark mb-3">{title}</h2>
              <p className="font-karla text-sm text-wine-dark/65 leading-relaxed">{content}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-8 bg-wine-dark/5 border border-wine-dark/10 rounded-2xl p-6">
          <p className="font-karla text-sm text-wine-dark/65">
            Questions about our privacy practices? Contact our Privacy Officer at{' '}
            <a href="mailto:care@dhagaratan.com" className="text-wine font-semibold">care@dhagaratan.com</a>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
