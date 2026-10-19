const express = require('express');
const router = express.Router();
const ExitIntentSetting = require('../models/ExitIntentSetting');
const { protect, adminOnly } = require('../middleware/auth');

// Default initial config fallback
const DEFAULT_CONFIG = {
  isActive: true,
  heading: "Wait! Don't Leave Your Saree Behind",
  subheading: 'Complete your order now and enjoy an exclusive handcrafted discount on your heirloom weave.',
  discountBadge: 'FLAT 10% OFF',
  couponCode: 'TANTVANI10',
  buttonText: 'Claim Offer & Checkout',
  buttonLink: '/checkout',
  showOnlyWithCartItems: true,
  imageUrl: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=800&auto=format&fit=crop',
};

// Public GET route - returns exit intent settings for storefront
router.get('/', async (req, res) => {
  try {
    let settings = await ExitIntentSetting.findOne();
    if (!settings) {
      settings = await ExitIntentSetting.create(DEFAULT_CONFIG);
    }
    res.json({ success: true, settings });
  } catch (err) {
    // Return default config gracefully if database lookup fails
    res.json({ success: true, settings: DEFAULT_CONFIG });
  }
});

// Admin PUT route - allows admin to update the exit intent settings
router.put('/', protect, adminOnly, async (req, res) => {
  try {
    const {
      isActive,
      heading,
      subheading,
      discountBadge,
      couponCode,
      buttonText,
      buttonLink,
      showOnlyWithCartItems,
      imageUrl,
    } = req.body;

    let settings = await ExitIntentSetting.findOne();
    if (!settings) {
      settings = new ExitIntentSetting();
    }

    if (typeof isActive !== 'undefined') settings.isActive = isActive;
    if (heading) settings.heading = heading;
    if (subheading) settings.subheading = subheading;
    if (discountBadge) settings.discountBadge = discountBadge;
    if (couponCode) settings.couponCode = couponCode;
    if (buttonText) settings.buttonText = buttonText;
    if (buttonLink) settings.buttonLink = buttonLink;
    if (typeof showOnlyWithCartItems !== 'undefined') settings.showOnlyWithCartItems = showOnlyWithCartItems;
    if (imageUrl) settings.imageUrl = imageUrl;

    await settings.save();
    res.json({ success: true, settings, message: 'Exit intent popup settings updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message || 'Failed to update settings' });
  }
});

module.exports = router;
