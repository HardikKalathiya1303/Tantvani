const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  buttonText: { type: String },
  buttonLink: { type: String },
  image: { type: String, required: true },
  imagePublicId: { type: String },
  isActive: { type: Boolean, default: true },
  sortOrder: { type: Number, default: 0 },
  placement: { type: String, enum: ['hero', 'mid', 'bottom'], default: 'hero' },
}, { timestamps: true });

module.exports = mongoose.model('Banner', bannerSchema);
