const mongoose = require('mongoose');

const exitIntentSettingSchema = new mongoose.Schema(
  {
    isActive: { type: Boolean, default: true },
    heading: { type: String, default: "Wait! Don't Leave Your Saree Behind" },
    subheading: {
      type: String,
      default: 'Complete your order now and enjoy an exclusive handcrafted discount on your heirloom weave.',
    },
    discountBadge: { type: String, default: 'FLAT 10% OFF' },
    couponCode: { type: String, default: 'TANTVANI10' },
    buttonText: { type: String, default: 'Claim Offer & Checkout' },
    buttonLink: { type: String, default: '/checkout' },
    showOnlyWithCartItems: { type: Boolean, default: true },
    imageUrl: {
      type: String,
      default: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ExitIntentSetting', exitIntentSettingSchema);
